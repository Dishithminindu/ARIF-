import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { 
  generateToken, 
  validatePasswordStrength, 
  sanitizeText, 
  rateLimit, 
  requireAuth, 
  AuthenticatedRequest 
} from '../auth';

const router = Router();

// Helper to extract real client IP (supporting CF-Connecting-IP, X-Forwarded-For, etc.)
function getClientIp(req: AuthenticatedRequest): string {
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string') return cfIp;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * POST /api/auth/register
 * Secure Student Registration
 */
router.post('/register', rateLimit(60000, 10), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      full_name, 
      student_id, 
      email, 
      password, 
      confirm_password, 
      department, 
      course, 
      contact_number 
    } = req.body;

    // 1. Validate required fields
    if (!full_name || !student_id || !email || !password || !department || !course) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required registration fields (Full Name, Student ID, Email, Password, Department, Course).'
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid institutional or personal email address.'
      });
    }

    // 3. Validate password confirmation
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please re-enter your password.'
      });
    }

    // 4. Validate password strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        success: false,
        error: passwordCheck.message
      });
    }

    // 5. Check duplicate Email or Student ID
    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = student_id.trim().toUpperCase();

    if (db.findUserByEmail(cleanEmail)) {
      return res.status(409).json({
        success: false,
        error: `An account registered with email "${cleanEmail}" already exists. Please log in instead.`
      });
    }

    if (db.findUserByStudentId(cleanStudentId)) {
      return res.status(409).json({
        success: false,
        error: `An account with Student/Staff ID "${cleanStudentId}" already exists.`
      });
    }

    // 6. Hash password with bcrypt (10 rounds salt)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 7. Create User record
    const newUser = db.createUser({
      full_name: sanitizeText(full_name.trim()),
      student_id: cleanStudentId,
      email: cleanEmail,
      password_hash: passwordHash,
      department: sanitizeText(department.trim()),
      course: sanitizeText(course.trim()),
      contact_number: contact_number ? sanitizeText(contact_number.trim()) : undefined,
      role: 'student',
      account_status: 'active',
      email_verified: true
    });

    // 8. Generate JWT session token
    const token = generateToken(newUser);

    // 9. Set HTTP-only Cookie for security
    res.cookie('arif_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 10. Audit Log
    db.logAudit({
      user_id: newUser.id,
      user_name: newUser.full_name,
      user_role: newUser.role,
      action: 'USER_REGISTERED',
      entity_type: 'user',
      entity_id: newUser.id,
      description: `New student account registered: ${newUser.full_name} (${newUser.student_id}) - ${newUser.department}`,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent']
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to ARIF Laboratory!',
      user: newUser,
      token
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred during account registration.'
    });
  }
});

/**
 * POST /api/auth/login
 * Secure User Login (Email or Student ID + Password)
 */
router.post('/login', rateLimit(60000, 15), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { identifier, password, remember } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both your Email / Student ID and your Password.'
      });
    }

    // Lookup user by email or student ID
    const user = db.findUserByEmailOrStudentId(identifier);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your Email/Student ID and Password.'
      });
    }

    // Check account status
    if (user.account_status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: 'Your account is currently suspended. Please contact laboratory management at support@ariflab.edu.'
      });
    }
    if (user.account_status === 'disabled') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been deactivated. Please contact laboratory administration.'
      });
    }

    // Verify bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      db.logAudit({
        user_id: user.id,
        user_name: user.full_name,
        user_role: user.role,
        action: 'FAILED_LOGIN_ATTEMPT',
        entity_type: 'auth',
        description: `Failed login attempt for user ${user.email}`,
        ip_address: getClientIp(req),
        user_agent: req.headers['user-agent']
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your Email/Student ID and Password.'
      });
    }

    // Update last_login timestamp
    db.updateUser(user.id, { last_login: new Date().toISOString() });

    const safeUser = db.sanitizeUser(user);
    const token = generateToken(safeUser);

    const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    res.cookie('arif_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge
    });

    db.logAudit({
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action: 'USER_LOGIN',
      entity_type: 'auth',
      description: `User logged in successfully (${user.role.toUpperCase()})`,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent']
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      user: safeUser,
      token,
      redirect: safeUser.role === 'admin' ? '/admin' : '/dashboard'
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred during authentication.'
    });
  }
});

/**
 * POST /api/auth/logout
 * Secure Session Logout
 */
router.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  res.clearCookie('arif_auth_token');
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * POST /api/auth/forgot-password
 * Request single-use password reset link / token
 */
router.post('/forgot-password', rateLimit(60000, 5), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your registered email address.'
      });
    }

    const user = db.findUserByEmail(email.trim());
    if (!user) {
      // Return ambiguous success to avoid user enumeration attacks
      return res.json({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been issued.'
      });
    }

    const resetToken = db.createPasswordResetToken(user.id, user.email);

    db.logAudit({
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action: 'PASSWORD_RESET_REQUESTED',
      entity_type: 'auth',
      description: `Password reset requested for email: ${user.email}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: 'If an account exists with this email address, a password reset link has been issued.',
      // Provide token in response for testing/demo environments where SMTP is not connected
      demoResetToken: resetToken,
      resetUrl: `/reset-password?token=${resetToken}`
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to process password reset request.'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Complete password reset using secure token
 */
router.post('/reset-password', rateLimit(60000, 5), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token, new_password, confirm_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password reset request.'
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match.'
      });
    }

    const passwordCheck = validatePasswordStrength(new_password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        success: false,
        error: passwordCheck.message
      });
    }

    const verification = db.verifyAndConsumeResetToken(token);
    if (!verification.valid || !verification.userId) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Password reset link is invalid or expired.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(new_password, salt);

    db.updateUserPassword(verification.userId, passwordHash);

    const user = db.findUserById(verification.userId);
    if (user) {
      db.logAudit({
        user_id: user.id,
        user_name: user.full_name,
        user_role: user.role,
        action: 'PASSWORD_RESET_COMPLETED',
        entity_type: 'auth',
        description: `Password reset successfully completed for user: ${user.email}`,
        ip_address: req.ip
      });
    }

    return res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password.'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update personal profile information
 */
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { full_name, contact_number, department, course } = req.body;
    const userId = req.user!.id;

    const updates: any = {};
    if (full_name) updates.full_name = sanitizeText(full_name.trim());
    if (contact_number !== undefined) updates.contact_number = sanitizeText(contact_number.trim());
    if (department) updates.department = sanitizeText(department.trim());
    if (course) updates.course = sanitizeText(course.trim());

    const updatedUser = db.updateUser(userId, updates);

    db.logAudit({
      user_id: updatedUser.id,
      user_name: updatedUser.full_name,
      user_role: updatedUser.role,
      action: 'PROFILE_UPDATED',
      entity_type: 'user',
      entity_id: updatedUser.id,
      description: `User updated profile information`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update profile.'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change password for currently authenticated user
 */
router.post('/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.user!.id;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both your current password and a new password.'
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        error: 'New passwords do not match.'
      });
    }

    const passwordCheck = validatePasswordStrength(new_password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        success: false,
        error: passwordCheck.message
      });
    }

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.'
      });
    }

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(new_password, salt);
    db.updateUserPassword(userId, passwordHash);

    db.logAudit({
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action: 'PASSWORD_CHANGED',
      entity_type: 'auth',
      description: 'User successfully changed their password',
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to change password.'
    });
  }
});

export default router;

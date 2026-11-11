import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest, sanitizeText, validatePasswordStrength } from '../auth';

const router = Router();

/**
 * GET /api/users
 * Admin: List users with search and role/status filters
 */
router.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, role, status } = req.query;

    const users = db.listUsers({
      query: typeof query === 'string' ? query : undefined,
      role: typeof role === 'string' ? (role as any) : undefined,
      status: typeof status === 'string' ? (status as any) : undefined
    });

    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user directory.'
    });
  }
});

/**
 * GET /api/users/:id
 * Admin: Get user details and user reservation history
 */
router.get('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = db.findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    const safeUser = db.sanitizeUser(user);
    const reservations = db.listReservations({ userId: user.id });

    return res.json({
      success: true,
      user: safeUser,
      reservations
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user details.'
    });
  }
});

/**
 * PUT /api/users/:id/status
 * Admin: Update user account status (active | suspended | disabled)
 */
router.put('/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, reason } = req.body;

    if (!['active', 'suspended', 'disabled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be active, suspended, or disabled.'
      });
    }

    // Safety guard: prevent admin from disabling their own account
    if (id === req.user!.id && status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Security Guard: You cannot suspend or disable your own active administrator account.'
      });
    }

    const updatedUser = db.updateUser(id, { account_status: status });

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'USER_STATUS_CHANGED',
      entity_type: 'user',
      entity_id: updatedUser.id,
      description: `Changed account status of ${updatedUser.full_name} (${updatedUser.email}) to ${status.toUpperCase()}. Reason: ${reason || 'Administrative action'}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `User status changed to ${status}.`,
      user: updatedUser
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update user status.'
    });
  }
});

/**
 * PUT /api/users/:id/role
 * Admin: Update user role (student | admin)
 */
router.put('/:id/role', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be either "student" or "admin".'
      });
    }

    // Safety guard: prevent admin from revoking their own admin role
    if (id === req.user!.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Security Guard: You cannot revoke your own administrator privileges.'
      });
    }

    const updatedUser = db.updateUser(id, { role });

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'USER_ROLE_CHANGED',
      entity_type: 'user',
      entity_id: updatedUser.id,
      description: `Modified role for ${updatedUser.full_name} to ${role.toUpperCase()}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user: updatedUser
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update user role.'
    });
  }
});

/**
 * POST /api/users/:id/reset-password
 * Admin: Reset a user's password directly
 */
router.post('/:id/reset-password', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { new_password } = req.body;

    if (!new_password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide the new password.'
      });
    }

    const passwordCheck = validatePasswordStrength(new_password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        success: false,
        error: passwordCheck.message
      });
    }

    const targetUser = db.findUserById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);
    db.updateUserPassword(id, hash);

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'ADMIN_PASSWORD_RESET',
      entity_type: 'user',
      entity_id: targetUser.id,
      description: `Administrator reset password for user: ${targetUser.email} (${targetUser.student_id})`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `Password for ${targetUser.full_name} has been reset successfully.`
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reset user password.'
    });
  }
});

export default router;

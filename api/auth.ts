import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { AuthJWTPayload, SafeUser } from './types';

/**
 * CRITICAL SECURITY ARCHITECTURE:
 * 1. JWT_SECRET is strictly a private, server-side secret key used exclusively on the Node.js backend
 *    to sign and verify HMAC-SHA256 authentication tokens.
 * 2. It must NEVER be exposed to browser JavaScript, never bundled into client assets,
 *    never sent in API responses, and never prefixed with VITE_.
 * 3. In production environments, JWT_SECRET must be configured as a secure server-only environment variable.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CRITICAL SECURITY CONFIGURATION ERROR: JWT_SECRET environment variable is missing on the server in production. ' +
        'It must be configured securely on the server and must NEVER be exposed to browser JavaScript.'
      );
    }
    return 'arif_lab_dev_only_jwt_secret_key_change_in_production_environment!';
  }
  return secret;
}

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

/**
 * Generate signed JWT token containing essential user claims
 */
export function generateToken(user: SafeUser): string {
  const payload: AuthJWTPayload = {
    userId: user.id,
    email: user.email,
    studentId: user.student_id,
    role: user.role,
    status: user.account_status,
    name: user.full_name
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: (JWT_EXPIRY as any) || '7d' });
}

/**
 * Extract token from Authorization Bearer header or cookie
 */
export function extractToken(req: Request): string | null {
  // Check Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check cookies
  if (req.cookies && req.cookies.arif_auth_token) {
    return req.cookies.arif_auth_token;
  }

  return null;
}

/**
 * Password strength validator
 * Requirements: >= 8 chars, at least 1 uppercase, 1 lowercase, 1 digit or special character
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters in length.' };
  }
  return { valid: true };
}

/**
 * Input sanitization to prevent XSS in user provided text
 */
export function sanitizeText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * In-memory sliding window rate limiter to protect login & registration from brute-force
 */
const rateLimitBuckets = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(windowMs: number = 60000, maxRequests: number = 10) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const bucket = rateLimitBuckets.get(key);
    if (!bucket || now > bucket.resetTime) {
      rateLimitBuckets.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    bucket.count++;
    if (bucket.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many authentication attempts. Please wait a minute before trying again.'
      });
    }

    next();
  };
}

/**
 * Middleware: Require valid authenticated session
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in to continue.'
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthJWTPayload;
    const user = db.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Session invalid. User account could not be found.'
      });
    }

    if (user.account_status !== 'active') {
      return res.status(403).json({
        success: false,
        error: `Account is ${user.account_status}. Please contact laboratory administration.`
      });
    }

    req.user = db.sanitizeUser(user);
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.'
    });
  }
}

/**
 * Middleware: Require Administrator privileges
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Administrative privileges required for this operation.'
      });
    }
    next();
  });
}

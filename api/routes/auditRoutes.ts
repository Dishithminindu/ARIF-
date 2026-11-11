import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../auth';

const router = Router();

/**
 * GET /api/audit-logs
 * Admin: View system audit trail
 */
router.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, entityType, query } = req.query;

    const logs = db.listAuditLogs({
      action: typeof action === 'string' ? action : undefined,
      entityType: typeof entityType === 'string' ? entityType : undefined,
      query: typeof query === 'string' ? query : undefined
    });

    return res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve audit logs.'
    });
  }
});

/**
 * GET /api/stats/dashboard
 * Admin: Comprehensive laboratory analytics
 */
router.get('/stats/dashboard', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = db.getDashboardStats();

    return res.json({
      success: true,
      stats
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to compute dashboard analytics.'
    });
  }
});

export default router;

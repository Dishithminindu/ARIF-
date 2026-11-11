import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest, sanitizeText } from '../auth';

const router = Router();

/**
 * GET /api/content
 * Public: Get laboratory notices, safety guidelines, lab hours, contact info
 */
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const contents = db.listSiteContent();
    return res.json({
      success: true,
      contents
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve site content.'
    });
  }
});

/**
 * PUT /api/content/:key
 * Admin: Update site announcements, safety notices, or operating hours
 */
router.put('/:key', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const key = String(req.params.key);
    const { title, content, is_active } = req.body;

    if (!title || content === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required.'
      });
    }

    const updated = db.updateSiteContent(
      key,
      {
        title: sanitizeText(title),
        content: content, // preserve formatted multi-line text
        is_active: is_active !== undefined ? Boolean(is_active) : true
      },
      req.user!.full_name
    );

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'CONTENT_UPDATED',
      entity_type: 'content',
      entity_id: updated.id,
      description: `Updated site content for [${key}]: ${updated.title}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: 'Content updated successfully.',
      content: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update content.'
    });
  }
});

export default router;

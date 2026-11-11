import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireAdmin, AuthenticatedRequest, sanitizeText } from '../auth';

const router = Router();

/**
 * POST /api/reservations
 * Student / User: Submit new equipment reservation request
 */
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      equipment_id,
      reservation_date,
      start_time,
      end_time,
      purpose,
      project_name,
      supervisor_name,
      notes
    } = req.body;

    const user = req.user!;

    // 1. Validate required fields
    if (!equipment_id || !reservation_date || !start_time || !end_time || !purpose || !project_name) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all mandatory reservation fields (Equipment, Date, Start Time, End Time, Purpose, Project Name).'
      });
    }

    // 2. Validate time format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid time format. Please provide time in HH:mm 24-hour format.'
      });
    }

    // 3. Delegate to Database Reservation Engine (performs all overlap checks, maintenance checks, date checks)
    const reservation = db.createReservation(user.id, {
      equipment_id,
      reservation_date,
      start_time,
      end_time,
      purpose: sanitizeText(purpose),
      project_name: sanitizeText(project_name),
      supervisor_name: supervisor_name ? sanitizeText(supervisor_name) : undefined,
      notes: notes ? sanitizeText(notes) : undefined
    });

    // 4. Audit Log
    db.logAudit({
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action: 'RESERVATION_CREATED',
      entity_type: 'reservation',
      entity_id: reservation.id,
      description: `Submitted reservation request #${reservation.id} for [${reservation.equipment_code}] ${reservation.equipment_name} on ${reservation.reservation_date} (${reservation.start_time} - ${reservation.end_time})`,
      ip_address: req.ip
    });

    return res.status(201).json({
      success: true,
      message: `Reservation request submitted successfully. Status: PENDING laboratory administrator review.`,
      reservation
    });
  } catch (err: any) {
    console.error('Reservation creation failed:', err);
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to submit reservation request.'
    });
  }
});

/**
 * GET /api/reservations/my
 * Student: View personal reservations history & statuses
 */
router.get('/my', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const reservations = db.listReservations({ userId: user.id });

    return res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve your reservations.'
    });
  }
});

/**
 * GET /api/reservations
 * Admin: View all laboratory equipment reservations
 */
router.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, date, equipmentId, query } = req.query;

    const reservations = db.listReservations({
      status: typeof status === 'string' ? (status as any) : undefined,
      date: typeof date === 'string' ? date : undefined,
      equipmentId: typeof equipmentId === 'string' ? equipmentId : undefined,
      query: typeof query === 'string' ? query : undefined
    });

    return res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to query reservations database.'
    });
  }
});

/**
 * GET /api/reservations/:id
 * Retrieve specific reservation
 */
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const resId = String(req.params.id);
    const reservation = db.getReservationById(resId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation record not found.'
      });
    }

    // Access control: only owner or admin can view full details
    if (req.user!.role !== 'admin' && req.user!.id !== reservation.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only view your own reservation requests.'
      });
    }

    return res.json({
      success: true,
      reservation
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve reservation details.'
    });
  }
});

/**
 * PUT /api/reservations/:id/approve
 * Admin: Approve pending reservation
 */
router.put('/:id/approve', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const resId = String(req.params.id);
    const reservation = db.getReservationById(resId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found.'
      });
    }

    if (reservation.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'This reservation is already approved.'
      });
    }

    // Check if another reservation has been approved in the meantime that causes an overlap
    const conflict = db.checkReservationConflict(
      reservation.equipment_id,
      reservation.reservation_date,
      reservation.start_time,
      reservation.end_time,
      reservation.id
    );

    // If an approved conflict exists, do not permit approval
    if (conflict.hasConflict && conflict.conflictingReservation?.status === 'approved') {
      return res.status(409).json({
        success: false,
        error: `Cannot approve: Another reservation (#${conflict.conflictingReservation.id} by ${conflict.conflictingReservation.user_name}) was already approved for this time slot.`
      });
    }

    const updated = db.updateReservationStatus(resId, 'approved', req.user!);

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'RESERVATION_APPROVED',
      entity_type: 'reservation',
      entity_id: updated.id,
      description: `Approved reservation #${updated.id} for ${updated.user_name} on ${updated.reservation_date} (${updated.equipment_name})`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `Reservation #${updated.id} has been approved.`,
      reservation: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to approve reservation.'
    });
  }
});

/**
 * PUT /api/reservations/:id/reject
 * Admin: Reject reservation with reason
 */
router.put('/:id/reject', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const resId = String(req.params.id);
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A rejection reason is mandatory to notify the student.'
      });
    }

    const updated = db.updateReservationStatus(resId, 'rejected', req.user!, sanitizeText(reason.trim()));

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'RESERVATION_REJECTED',
      entity_type: 'reservation',
      entity_id: updated.id,
      description: `Rejected reservation #${updated.id} for ${updated.user_name}. Reason: ${reason}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `Reservation #${updated.id} was rejected.`,
      reservation: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to reject reservation.'
    });
  }
});

/**
 * PUT /api/reservations/:id/cancel
 * Student (own reservation) or Admin: Cancel reservation
 */
router.put('/:id/cancel', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const resId = String(req.params.id);
    const { reason } = req.body;
    const user = req.user!;

    const reservation = db.getReservationById(resId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found.'
      });
    }

    // Permission check
    if (user.role !== 'admin' && user.id !== reservation.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only cancel your own reservations.'
      });
    }

    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel a reservation that is already ${reservation.status}.`
      });
    }

    const cancelReason = reason ? sanitizeText(reason.trim()) : `Cancelled by ${user.role === 'admin' ? 'Administrator' : 'Student'}`;
    const updated = db.updateReservationStatus(resId, 'cancelled', undefined, cancelReason);

    db.logAudit({
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      action: 'RESERVATION_CANCELLED',
      entity_type: 'reservation',
      entity_id: updated.id,
      description: `Cancelled reservation #${updated.id} (${updated.equipment_name}). Reason: ${cancelReason}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: 'Reservation cancelled successfully.',
      reservation: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to cancel reservation.'
    });
  }
});

/**
 * PUT /api/reservations/:id/complete
 * Admin: Mark reservation as completed after lab session concludes
 */
router.put('/:id/complete', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const resId = String(req.params.id);
    const updated = db.updateReservationStatus(resId, 'completed');

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'RESERVATION_COMPLETED',
      entity_type: 'reservation',
      entity_id: updated.id,
      description: `Marked reservation #${updated.id} for ${updated.user_name} as COMPLETED.`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `Reservation #${updated.id} marked as completed.`,
      reservation: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to complete reservation.'
    });
  }
});

export default router;

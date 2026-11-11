import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireAdmin, AuthenticatedRequest, sanitizeText } from '../auth';

const router = Router();

/**
 * GET /api/equipment
 * List equipment & inventory items with search & filters
 */
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      query, 
      category, 
      block, 
      status, 
      condition, 
      isReservableOnly 
    } = req.query;

    const items = db.listEquipment({
      query: typeof query === 'string' ? query : undefined,
      category: typeof category === 'string' ? category : undefined,
      block: typeof block === 'string' ? block : undefined,
      status: typeof status === 'string' ? status : undefined,
      condition: typeof condition === 'string' ? condition : undefined,
      isReservableOnly: isReservableOnly === 'true'
    });

    return res.json({
      success: true,
      count: items.length,
      equipment: items
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve equipment catalog.'
    });
  }
});

/**
 * GET /api/equipment/:id
 * Retrieve specific equipment details
 */
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const eq = db.getEquipmentById(id);
    if (!eq) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found.'
      });
    }

    return res.json({
      success: true,
      equipment: eq
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch equipment details.'
    });
  }
});

/**
 * GET /api/equipment/:id/availability
 * Get equipment booked time intervals for a specific date or date range.
 * Privacy-safe: Hides other students' personal project titles and names from peers.
 */
router.get('/:id/availability', (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { date } = req.query;

    const eq = db.getEquipmentById(id);
    if (!eq) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found.'
      });
    }

    const targetDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const reservations = db.listReservations({
      equipmentId: eq.id,
      date: targetDate
    });

    // Filter to active bookings
    const active = reservations.filter(r => r.status === 'approved' || r.status === 'pending');

    // Check if the requester is an admin
    const isAdmin = req.user?.role === 'admin';

    const timeSlots = active.map(r => ({
      id: r.id,
      date: r.reservation_date,
      start_time: r.start_time,
      end_time: r.end_time,
      status: r.status,
      // Only expose student & project info to admin or the owner
      display_label: isAdmin || (req.user && req.user.id === r.user_id) 
        ? `${r.user_name} (${r.status.toUpperCase()}): ${r.project_name}`
        : `Reserved (${r.status.toUpperCase()})`,
      is_own: req.user ? req.user.id === r.user_id : false
    }));

    return res.json({
      success: true,
      equipmentId: eq.id,
      equipmentName: eq.name,
      equipmentCode: eq.equipment_code,
      status: eq.status,
      date: targetDate,
      timeSlots
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to query equipment availability.'
    });
  }
});

/**
 * POST /api/equipment
 * Admin: Add new laboratory equipment
 */
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      category,
      description,
      equipment_code,
      manufacturer,
      model,
      serial_number,
      location,
      block,
      quantity,
      unit,
      condition,
      operating_instructions,
      safety_information,
      status,
      is_reservable,
      notes,
      formula
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Name, Category, and Location for the equipment.'
      });
    }

    const qtyNum = parseInt(quantity, 10);
    const parsedQty = isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);

    const newEq = db.createEquipment({
      item_no: 0,
      equipment_code: equipment_code ? sanitizeText(equipment_code.trim().toUpperCase()) : '',
      name: sanitizeText(name.trim()),
      category: category || 'Equipment',
      description: sanitizeText(description || ''),
      formula: formula ? sanitizeText(formula.trim()) : '',
      formula_plain: formula ? sanitizeText(formula.trim()) : '',
      manufacturer: manufacturer ? sanitizeText(manufacturer.trim()) : '',
      model: model ? sanitizeText(model.trim()) : '',
      serial_number: serial_number ? sanitizeText(serial_number.trim()) : '',
      location: sanitizeText(location.trim()),
      block: block ? sanitizeText(block.trim()) : sanitizeText(location.trim()),
      quantity: String(parsedQty),
      available_quantity: parsedQty,
      total_quantity: parsedQty,
      unit: unit ? sanitizeText(unit.trim()) : 'units',
      condition: condition || 'Good',
      operating_instructions: operating_instructions ? sanitizeText(operating_instructions.trim()) : undefined,
      safety_information: safety_information ? sanitizeText(safety_information.trim()) : undefined,
      status: status || 'available',
      is_reservable: is_reservable !== undefined ? Boolean(is_reservable) : true,
      notes: notes ? sanitizeText(notes.trim()) : undefined
    });

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'EQUIPMENT_CREATED',
      entity_type: 'equipment',
      entity_id: newEq.id,
      description: `Added new equipment: [${newEq.equipment_code}] ${newEq.name} at ${newEq.location}`,
      ip_address: req.ip
    });

    return res.status(201).json({
      success: true,
      message: `Equipment ${newEq.name} created successfully with code ${newEq.equipment_code}.`,
      equipment: newEq
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to create equipment.'
    });
  }
});

/**
 * PUT /api/equipment/:id
 * Admin: Update equipment properties
 */
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const updates = req.body;

    const sanitizedUpdates: any = {};
    if (updates.name) sanitizedUpdates.name = sanitizeText(updates.name.trim());
    if (updates.category) sanitizedUpdates.category = updates.category;
    if (updates.description !== undefined) sanitizedUpdates.description = sanitizeText(updates.description.trim());
    if (updates.location) sanitizedUpdates.location = sanitizeText(updates.location.trim());
    if (updates.block) sanitizedUpdates.block = sanitizeText(updates.block.trim());
    if (updates.condition) sanitizedUpdates.condition = updates.condition;
    if (updates.status) sanitizedUpdates.status = updates.status;
    if (updates.manufacturer !== undefined) sanitizedUpdates.manufacturer = sanitizeText(updates.manufacturer.trim());
    if (updates.model !== undefined) sanitizedUpdates.model = sanitizeText(updates.model.trim());
    if (updates.serial_number !== undefined) sanitizedUpdates.serial_number = sanitizeText(updates.serial_number.trim());
    if (updates.safety_information !== undefined) sanitizedUpdates.safety_information = sanitizeText(updates.safety_information.trim());
    if (updates.operating_instructions !== undefined) sanitizedUpdates.operating_instructions = sanitizeText(updates.operating_instructions.trim());
    if (updates.notes !== undefined) sanitizedUpdates.notes = sanitizeText(updates.notes.trim());
    if (updates.is_reservable !== undefined) sanitizedUpdates.is_reservable = Boolean(updates.is_reservable);
    if (updates.quantity !== undefined) {
      sanitizedUpdates.quantity = String(updates.quantity);
      const q = parseInt(updates.quantity, 10);
      if (!isNaN(q)) {
        sanitizedUpdates.total_quantity = q;
        sanitizedUpdates.available_quantity = q;
      }
    }

    const updated = db.updateEquipment(id, sanitizedUpdates);

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'EQUIPMENT_UPDATED',
      entity_type: 'equipment',
      entity_id: updated.id,
      description: `Updated equipment [${updated.equipment_code}] ${updated.name} (Status: ${updated.status}, Condition: ${updated.condition})`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: 'Equipment details updated successfully.',
      equipment: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update equipment.'
    });
  }
});

/**
 * DELETE /api/equipment/:id
 * Admin: Deactivate / Soft delete equipment
 */
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { reason } = req.body;

    const deactivated = db.deactivateEquipment(id, reason);

    db.logAudit({
      user_id: req.user!.id,
      user_name: req.user!.full_name,
      user_role: req.user!.role,
      action: 'EQUIPMENT_DEACTIVATED',
      entity_type: 'equipment',
      entity_id: deactivated.id,
      description: `Deactivated equipment [${deactivated.equipment_code}] ${deactivated.name}. Reason: ${reason || 'Not specified'}`,
      ip_address: req.ip
    });

    return res.json({
      success: true,
      message: `Equipment ${deactivated.name} has been set to unavailable.`,
      equipment: deactivated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to deactivate equipment.'
    });
  }
});

export default router;

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { 
  User, 
  SafeUser, 
  Equipment, 
  Reservation, 
  AuditLog, 
  SiteContent, 
  PasswordResetToken,
  ReservationStatus,
  AccountStatus,
  UserRole 
} from './types';

export interface DatabaseSchema {
  users: User[];
  equipment: Equipment[];
  reservations: Reservation[];
  audit_logs: AuditLog[];
  site_content: SiteContent[];
  password_resets: PasswordResetToken[];
  version: number;
  last_updated: string;
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'arif_database.json');
const LEGACY_INVENTORY_PATH = path.resolve(process.cwd(), 'data', 'inventory.json');

class DatabaseManager {
  private data: DatabaseSchema;
  private isLoaded: boolean = false;
  private saveDebounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.data = {
      users: [],
      equipment: [],
      reservations: [],
      audit_logs: [],
      site_content: [],
      password_resets: [],
      version: 2,
      last_updated: new Date().toISOString()
    };
    this.initialize();
  }

  private initialize(): void {
    const dataDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.equipment)) {
          this.data = parsed;
          this.isLoaded = true;
          this.ensureDefaultContentAndAdmin();
          return;
        }
      } catch (err) {
        console.error('Error reading existing database, creating fresh backup and re-seeding:', err);
      }
    }

    // Seed database from inventory.json and default users
    this.seedInitialDatabase();
    this.persistSync();
    this.isLoaded = true;
  }

  private seedInitialDatabase(): void {
    console.log('Seeding initial ARIF Laboratory database...');
    
    // 1. Seed Administrators & Students
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'Admin@ARIF2026!', salt);
    const studentPasswordHash = bcrypt.hashSync('Student@ARIF2026!', salt);

    const initialUsers: User[] = [
      {
        id: 'usr-admin-001',
        full_name: 'ARIF Lab Administrator',
        student_id: 'ADM-001',
        email: 'admin@ariflab.edu',
        password_hash: adminPasswordHash,
        department: 'Laboratory Operations & Safety',
        course: 'Laboratory Administration',
        contact_number: '+94 11 288 1234',
        role: 'admin',
        account_status: 'active',
        email_verified: true,
        created_at: '2026-01-15T08:00:00.000Z',
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      },
      {
        id: 'usr-student-001',
        full_name: 'Demo Student',
        student_id: 'S20000001',
        email: 'student.demo@ariflab.edu',
        password_hash: studentPasswordHash,
        department: 'Department of Chemistry',
        course: 'B.Sc. Chemistry (Special)',
        contact_number: '+94 77 123 4567',
        role: 'student',
        account_status: 'active',
        email_verified: true,
        created_at: '2026-02-01T09:30:00.000Z',
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      },
      {
        id: 'usr-student-002',
        full_name: 'Ayesha Senaratne',
        student_id: 'S20002488',
        email: 'ayesha@ariflab.edu',
        password_hash: studentPasswordHash,
        department: 'Department of Physics & Material Science',
        course: 'B.Sc. Materials Engineering',
        contact_number: '+94 71 987 6543',
        role: 'student',
        account_status: 'active',
        email_verified: true,
        created_at: '2026-02-10T11:00:00.000Z',
        updated_at: new Date().toISOString()
      }
    ];

    // 2. Load inventory items
    let inventoryItems: any[] = [];
    if (fs.existsSync(LEGACY_INVENTORY_PATH)) {
      try {
        inventoryItems = JSON.parse(fs.readFileSync(LEGACY_INVENTORY_PATH, 'utf8'));
      } catch (err) {
        console.error('Failed reading legacy inventory.json:', err);
      }
    }

    const seededEquipment: Equipment[] = [];
    let eqCounter = 1;

    // Standard high-tech laboratory apparatus specifications
    const richEquipSpecs: Record<string, { desc: string; mfg: string; model: string; safety: string; ops: string }> = {
      'AUTOLAB': {
        desc: 'Precision Potentiostat / Galvanostat electrochemical analytical workstation for cyclic voltammetry, impedance spectroscopy (EIS), and fuel cell / solar cell research.',
        mfg: 'Metrohm Autolab B.V. (Netherlands)',
        model: 'PGSTAT302N with FRA32M Module',
        safety: 'Wear nitrile gloves and safety goggles. Ground electrical shields before high-frequency impedance sweeps. Do not short counter and working electrode leads.',
        ops: '1. Connect USB interface cable to acquisition PC.\n2. Power on Autolab chassis.\n3. Insert reference (Ag/AgCl), counter (Pt), and working electrode into Faraday cage.\n4. Initialize NOVA software suite.\n5. Select Open Circuit Potential (OCP) stabilization before launching Cyclic Voltammetry (CV) sequence.'
      },
      'Quartz Cuvette': {
        desc: 'High-purity fused quartz optical spectrophotometer cell with 10 mm optical path length (190 nm – 2500 nm transmission range).',
        mfg: 'Hellma Analytics (Germany)',
        model: 'Suprasil QS Precision 10mm',
        safety: 'Handle only by frosted optical side walls. Never touch optical quartz faces. Rinse thoroughly with spectroscopic grade methanol or DI water.',
        ops: '1. Inspect windows for lint or fingerprints.\n2. Fill with 3.0 mL baseline solvent.\n3. Insert into sample holder with optical windows aligned to incident light beam.\n4. Zero spectrophotometer instrument.\n5. Carefully pipet test analyte solution without introducing air bubbles.'
      },
      'Digital Oscilloscope': {
        desc: '4-Channel 200 MHz Digital Storage Oscilloscope with 2 GSa/s real-time sampling and waveform FFT mathematical analysis.',
        mfg: 'Keysight Technologies / Rigol',
        model: 'DS2202A Mixed Signal Scope',
        safety: 'Ensure ground clip is connected only to earth-referenced ground. Do not exceed probe maximum voltage ratings (300V CAT II).',
        ops: '1. Connect 10X attenuation probe to Channel 1.\n2. Attach ground crocodile clip to reference circuit zero plane.\n3. Press "AutoSet" for immediate trigger acquisition.\n4. Adjust horizontal timebase and vertical sensitivity knobs for stable signal inspection.'
      },
      'Xenon Arc Lamp': {
        desc: '150W Ozone-free high-radiance Xenon Arc Lamp light source for Class AAA solar simulation, photocatalytic degradation, and IPCE quantum efficiency measurements.',
        mfg: 'Newport / Oriel Instruments',
        model: 'Oriel 66902 Solar Simulator Power Supply',
        safety: 'DANGER: Intense Ultraviolet (UV) & Visible Light Radiation! UV-blocking protective safety glasses MANDATORY. Allow 20 minutes fan cooldown before switching off main power.',
        ops: '1. Turn on exhaust ventilation system.\n2. Switch on cooling fans.\n3. Press Arc Ignition button.\n4. Wait 15 minutes for optical plasma arc temperature stabilization before taking AM1.5G calibrated solar irradiance measurements.'
      },
      'Hot Disk': {
        desc: 'Transient Plane Source (TPS) Thermal Constants Analyzer probe for direct anisotropic thermal conductivity and specific heat measurements.',
        mfg: 'Hot Disk AB (Sweden)',
        model: 'TPS 2500 S Kapton Insulated Sensor',
        safety: 'Handle sensor foil with delicate vacuum tweezers. Avoid bending or applying excessive clamping pressure to the nickel double-spiral foil.',
        ops: '1. Sandwich sensor flatly between two identical smooth sample halves.\n2. Apply uniform sample holder clamp.\n3. Set heating power and measurement duration in Hot Disk TPS Software.\n4. Inspect temperature drift curve before initiating recording pulse.'
      },
      'EUTECH pH': {
        desc: 'Microprocessor-based benchtop pH/mV/°C meter with automatic temperature compensation (ATC) and 5-point calibration algorithm.',
        mfg: 'Thermo Fisher Scientific / Eutech Instruments',
        model: 'CyberScan pH 1500 Benchtop Unit',
        safety: 'Glass bulb is extremely fragile. Keep electrode hydrated in 3M KCl storage buffer. Never store electrode in deionized water.',
        ops: '1. Rinse glass bulb with DI water.\n2. Blot dry with lint-free tissue.\n3. Immerse in pH 7.00 and pH 4.01/10.01 buffers for dual-point calibration.\n4. Check electrode slope (>95% required).\n5. Measure test sample under gentle magnetic stirring.'
      },
      'Liebig Condenser': {
        desc: 'Complete Borosilicate 3.3 fractional distillation and reflux glassware assembly with quick-fit ground glass 24/29 joints.',
        mfg: 'Quickfit / Borosil Lab Glassware',
        model: 'Class A 400mm Vapor Jacket Set',
        safety: 'Ensure secure Keck clamp placement on all ground joints. Apply thin trace of vacuum grease to avoid seizing. Water inlet MUST enter bottom jacket nozzle and exit top nozzle.',
        ops: '1. Assemble distillation column on heavy retort stand.\n2. Attach flexible water tubing to water faucet.\n3. Add 2-3 anti-bumping boiling granules to distillation flask.\n4. Maintain steady cooling water circulation prior to activating heating mantle.'
      },
      'FTO Glass': {
        desc: 'Fluorine-doped Tin Oxide (SnO2:F) transparent conducting oxide glass substrates (~7-10 Ω/sq sheet resistance) for perovskite and dye-sensitized solar cells.',
        mfg: 'Pilkington NSG TEC 15',
        model: 'FTO Glass Substrate Batch (2.2 mm)',
        safety: 'Wear cut-resistant nitrile gloves. Use diamond glass cutter on soft non-conductive back face. Conductive side verification with multimeter required before film deposition.',
        ops: '1. Test sheet resistance using digital multimeter in resistance mode.\n2. Ultrasonic wash sequentially in 2% Hellmanex detergent, DI water, acetone, and isopropanol (15 min each).\n3. Dry under high-purity N2 stream.\n4. Treat with UV-Ozone cleaner for 15 minutes before spin coating.'
      }
    };

    if (inventoryItems.length > 0) {
      inventoryItems.forEach((inv, index) => {
        const itemNo = inv.itemNo || (index + 1);
        const code = `ARIF-EQ-${String(itemNo).padStart(3, '0')}`;
        
        let isReservable = true;
        let defaultStatus: Equipment['status'] = 'available';
        let condition: Equipment['condition'] = 'Good';

        // Check if item matches high-tech equipment
        let matchedSpec: any = null;
        let matchedKey: string = '';
        for (const [key, spec] of Object.entries(richEquipSpecs)) {
          if ((inv.name && inv.name.includes(key)) || (inv.category === 'Equipment' && inv.notes && inv.notes.includes(key))) {
            matchedSpec = spec;
            matchedKey = key;
            break;
          }
        }

        const qtyNum = parseInt(inv.quantity, 10);
        const totalQty = isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);

        seededEquipment.push({
          id: `eq-${itemNo}`,
          item_no: itemNo,
          equipment_code: code,
          name: inv.name,
          category: inv.category || 'Equipment',
          description: matchedSpec?.desc || `${inv.name} - Laboratory grade ${inv.category.toLowerCase()} catalog item verified for ARIF laboratory research workflows.`,
          formula: inv.formula || '',
          formula_plain: inv.formulaPlain || '',
          manufacturer: matchedSpec?.mfg || 'Standard University Lab Supply / ISO Certified',
          model: matchedSpec?.model || 'ARIF Standard Grade',
          serial_number: `SN-${String(itemNo).padStart(4, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
          location: inv.location || inv.block || 'Main Storage',
          block: inv.block || inv.location || 'Block 1',
          quantity: inv.quantity || '1',
          available_quantity: totalQty,
          total_quantity: totalQty,
          unit: inv.unit || 'units',
          condition: condition,
          image_url: matchedSpec && matchedKey ? `/assets/equipment/${matchedKey.toLowerCase().replace(/\s+/g, '_')}.png` : undefined,
          operating_instructions: matchedSpec?.ops || `1. Inspect item before and after laboratory session.\n2. Adhere to standard laboratory operating procedures (SOP).\n3. Return cleanly to ${inv.location || 'assigned storage location'}.`,
          safety_information: matchedSpec?.safety || `Wear personal protective equipment (PPE): lab coat, safety glasses, and chemical-resistant nitrile gloves. Refer to Laboratory Chemical & Glassware Safety Protocol.`,
          hazard_class: inv.category === 'Chemical' ? 'Hazardous Reagent' : undefined,
          grade: inv.grade || (inv.category === 'Chemical' ? 'AR Grade' : 'Class A'),
          status: defaultStatus,
          is_reservable: isReservable,
          notes: inv.notes || '',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: new Date().toISOString()
        });
        eqCounter++;
      });
    }

    // 3. Seed Sample Reservations (To test workflows)
    const today = new Date().toISOString().split('T')[0];
    const initialReservations: Reservation[] = [
      {
        id: 'res-sample-001',
        user_id: 'usr-student-001',
        equipment_id: seededEquipment.find(e => e.name.includes('AUTOLAB'))?.id || seededEquipment[0]?.id || 'eq-1',
        reservation_date: today,
        start_time: '10:00',
        end_time: '12:30',
        purpose: 'Cyclic Voltammetry characterization of Dye-Sensitized Solar Cell photoanodes.',
        project_name: 'Novel Metal Oxide Thin-Film Solar Cells',
        supervisor_name: 'Prof. J. M. Bandara',
        notes: 'Requiring Pt counter electrode and reference cell module.',
        status: 'approved',
        approved_by: 'ARIF Lab Administrator',
        approved_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        user_name: 'Demo Student',
        user_email: 'student.demo@ariflab.edu',
        student_id: 'S20000001',
        user_department: 'Department of Chemistry',
        equipment_name: seededEquipment.find(e => e.name.includes('AUTOLAB'))?.name || 'Electrochemical Station',
        equipment_code: seededEquipment.find(e => e.name.includes('AUTOLAB'))?.equipment_code || 'ARIF-EQ-006',
        equipment_location: 'Block 6 / Cupboard 67'
      },
      {
        id: 'res-sample-002',
        user_id: 'usr-student-002',
        equipment_id: seededEquipment.find(e => e.name.includes('Quartz Cuvette'))?.id || seededEquipment[1]?.id || 'eq-2',
        reservation_date: today,
        start_time: '14:00',
        end_time: '16:00',
        purpose: 'UV-Vis absorption spectroscopy spectrum acquisition for polymer nanocomposites.',
        project_name: 'Photocatalytic Titanium Dioxide Thin Films',
        supervisor_name: 'Dr. C. Silva',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        user_name: 'Ayesha Senaratne',
        user_email: 'ayesha@ariflab.edu',
        student_id: 'S20002488',
        user_department: 'Department of Physics & Material Science',
        equipment_name: seededEquipment.find(e => e.name.includes('Quartz Cuvette'))?.name || 'Quartz Cuvette',
        equipment_code: seededEquipment.find(e => e.name.includes('Quartz Cuvette'))?.equipment_code || 'ARIF-EQ-008',
        equipment_location: 'Cupboard 67'
      }
    ];

    // 4. Seed Site Content (Configurable by Admin)
    const initialContent: SiteContent[] = [
      {
        id: 'cnt-1',
        key: 'announcement',
        title: 'Laboratory Notice: Online Equipment Booking Active',
        content: 'Welcome to the ARIF Laboratory Equipment & Chemical Inventory System. All research students must submit booking requests at least 4 hours prior to equipment utilization.',
        category: 'announcement',
        is_active: true,
        updated_at: new Date().toISOString(),
        updated_by: 'ARIF Lab Administrator'
      },
      {
        id: 'cnt-2',
        key: 'safety_notice',
        title: 'General Laboratory Safety Guidelines & PPE Mandates',
        content: '1. Standard lab coats, safety goggles, and nitrile gloves are mandatory inside ARIF Laboratories.\n2. Chemical waste must be segregated into designated halogenated and non-halogenated disposal containers.\n3. In case of emergency or spillage, immediately notify the laboratory supervisor and refer to the safety wash stations in Block 1 and Block 4.',
        category: 'safety',
        is_active: true,
        updated_at: new Date().toISOString(),
        updated_by: 'ARIF Lab Administrator'
      },
      {
        id: 'cnt-3',
        key: 'lab_hours',
        title: 'Operating Hours & Research Sessions',
        content: 'Monday – Friday: 08:30 AM – 05:30 PM\nSaturday: 09:00 AM – 01:30 PM (Special Booking Only)\nSunday & University Holidays: Closed for Maintenance',
        category: 'info',
        is_active: true,
        updated_at: new Date().toISOString(),
        updated_by: 'ARIF Lab Administrator'
      },
      {
        id: 'cnt-4',
        key: 'contact_info',
        title: 'Laboratory Contact & Support',
        content: 'Email: support@ariflab.edu / admin@ariflab.edu\nPhone: +94 11 288 1234 (Ext. 402)\nLocation: ARIF Advanced Research Complex, Science Building, Level 2',
        category: 'contact',
        is_active: true,
        updated_at: new Date().toISOString(),
        updated_by: 'ARIF Lab Administrator'
      }
    ];

    // 5. Seed Initial Audit Logs
    const initialAuditLogs: AuditLog[] = [
      {
        id: 'aud-001',
        user_id: 'usr-admin-001',
        user_name: 'ARIF Lab Administrator',
        user_role: 'admin',
        action: 'SYSTEM_INITIALIZATION',
        entity_type: 'system',
        description: `ARIF Laboratory database initialized with ${seededEquipment.length} inventory catalog assets and security schemas.`,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'aud-002',
        user_id: 'usr-admin-001',
        user_name: 'ARIF Lab Administrator',
        user_role: 'admin',
        action: 'RESERVATION_APPROVED',
        entity_type: 'reservation',
        entity_id: 'res-sample-001',
        description: 'Approved equipment reservation #res-sample-001 for Kavindu Perera (AUTOLAB Station).',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];

    this.data = {
      users: initialUsers,
      equipment: seededEquipment,
      reservations: initialReservations,
      audit_logs: initialAuditLogs,
      site_content: initialContent,
      password_resets: [],
      version: 2,
      last_updated: new Date().toISOString()
    };
  }

  private ensureDefaultContentAndAdmin(): void {
    // Check if admin user exists, if not recreate
    const hasAdmin = this.data.users.some(u => u.role === 'admin' && u.account_status === 'active');
    if (!hasAdmin) {
      const salt = bcrypt.genSaltSync(10);
      const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'Admin@ARIF2026!', salt);
      this.data.users.push({
        id: `usr-admin-${Date.now()}`,
        full_name: process.env.ADMIN_INITIAL_NAME || 'ARIF Lab Administrator',
        student_id: process.env.ADMIN_INITIAL_STUDENT_ID || 'ADM-001',
        email: process.env.ADMIN_INITIAL_EMAIL || 'admin@ariflab.edu',
        password_hash: adminPasswordHash,
        department: 'Laboratory Operations & Safety',
        course: 'Laboratory Administration',
        contact_number: '+94 11 288 1234',
        role: 'admin',
        account_status: 'active',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      this.persist();
    }
  }

  private persist(): void {
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    this.saveDebounceTimer = setTimeout(() => {
      this.persistSync();
    }, 100);
  }

  private persistSync(): void {
    try {
      this.data.last_updated = new Date().toISOString();
      const serialized = JSON.stringify(this.data, null, 2);
      const tempPath = `${DB_FILE_PATH}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, serialized, 'utf8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (err) {
      console.error('CRITICAL: Failed persisting database to disk:', err);
    }
  }

  // ===================== USER OPERATIONS =====================

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserByStudentId(studentId: string): User | undefined {
    return this.data.users.find(u => u.student_id.toLowerCase() === studentId.trim().toLowerCase());
  }

  public findUserByEmailOrStudentId(identifier: string): User | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(u => 
      u.email.toLowerCase() === clean || u.student_id.toLowerCase() === clean
    );
  }

  public createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): SafeUser {
    // Validate uniqueness
    if (this.findUserByEmail(userData.email)) {
      throw new Error(`An account with email ${userData.email} already exists.`);
    }
    if (this.findUserByStudentId(userData.student_id)) {
      throw new Error(`An account with Student ID ${userData.student_id} already exists.`);
    }

    const newUser: User = {
      ...userData,
      id: `usr-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.persist();

    return this.sanitizeUser(newUser);
  }

  public updateUser(id: string, updates: Partial<Omit<User, 'id' | 'password_hash' | 'created_at'>>): SafeUser {
    const user = this.findUserById(id);
    if (!user) {
      throw new Error('User not found.');
    }

    if (updates.email && updates.email !== user.email) {
      const existing = this.findUserByEmail(updates.email);
      if (existing && existing.id !== id) {
        throw new Error(`Email ${updates.email} is already in use by another account.`);
      }
    }

    if (updates.student_id && updates.student_id !== user.student_id) {
      const existing = this.findUserByStudentId(updates.student_id);
      if (existing && existing.id !== id) {
        throw new Error(`Student ID ${updates.student_id} is already registered.`);
      }
    }

    Object.assign(user, updates, { updated_at: new Date().toISOString() });
    this.persist();

    return this.sanitizeUser(user);
  }

  public updateUserPassword(id: string, newPasswordHash: string): void {
    const user = this.findUserById(id);
    if (!user) throw new Error('User not found.');
    user.password_hash = newPasswordHash;
    user.updated_at = new Date().toISOString();
    this.persist();
  }

  public listUsers(filters?: { query?: string; role?: UserRole; status?: AccountStatus }): SafeUser[] {
    let result = [...this.data.users];

    if (filters?.role) {
      result = result.filter(u => u.role === filters.role);
    }
    if (filters?.status) {
      result = result.filter(u => u.account_status === filters.status);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(u => 
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.student_id.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }

    return result.map(u => this.sanitizeUser(u));
  }

  public sanitizeUser(user: User): SafeUser {
    const { password_hash, ...safe } = user;
    return safe;
  }

  // ===================== EQUIPMENT OPERATIONS =====================

  public listEquipment(filters?: {
    query?: string;
    category?: string;
    block?: string;
    status?: string;
    condition?: string;
    isReservableOnly?: boolean;
  }): Equipment[] {
    let result = [...this.data.equipment];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(e => e.category === filters.category);
    }
    if (filters?.block) {
      result = result.filter(e => e.block === filters.block || e.location.includes(filters.block!));
    }
    if (filters?.status) {
      result = result.filter(e => e.status === filters.status);
    }
    if (filters?.condition) {
      result = result.filter(e => e.condition === filters.condition);
    }
    if (filters?.isReservableOnly) {
      result = result.filter(e => e.is_reservable && e.status !== 'maintenance' && e.status !== 'unavailable');
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(e => 
        e.name.toLowerCase().includes(q) ||
        e.equipment_code.toLowerCase().includes(q) ||
        (e.formula && e.formula.toLowerCase().includes(q)) ||
        (e.formula_plain && e.formula_plain.toLowerCase().includes(q)) ||
        e.location.toLowerCase().includes(q) ||
        (e.manufacturer && e.manufacturer.toLowerCase().includes(q)) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        (e.grade && e.grade.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getEquipmentById(id: string): Equipment | undefined {
    return this.data.equipment.find(e => e.id === id || e.equipment_code === id);
  }

  public createEquipment(eqData: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Equipment {
    // Generate unique code if not provided
    let code = eqData.equipment_code;
    if (!code) {
      const maxNo = this.data.equipment.reduce((max, e) => Math.max(max, e.item_no || 0), 0);
      code = `ARIF-EQ-${String(maxNo + 1).padStart(3, '0')}`;
    }

    const newEquipment: Equipment = {
      ...eqData,
      id: `eq-${crypto.randomUUID()}`,
      equipment_code: code,
      item_no: eqData.item_no || this.data.equipment.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.equipment.push(newEquipment);
    this.persist();
    return newEquipment;
  }

  public updateEquipment(id: string, updates: Partial<Omit<Equipment, 'id' | 'created_at'>>): Equipment {
    const eq = this.getEquipmentById(id);
    if (!eq) throw new Error('Equipment not found.');

    Object.assign(eq, updates, { updated_at: new Date().toISOString() });
    this.persist();
    return eq;
  }

  public deactivateEquipment(id: string, reason?: string): Equipment {
    const eq = this.getEquipmentById(id);
    if (!eq) throw new Error('Equipment not found.');

    // Soft delete / maintenance lock to preserve reservation references
    eq.status = 'unavailable';
    eq.is_reservable = false;
    eq.notes = reason ? `${eq.notes ? eq.notes + ' | ' : ''}Deactivated: ${reason}` : eq.notes;
    eq.updated_at = new Date().toISOString();

    this.persist();
    return eq;
  }

  // ===================== RESERVATION ENGINE & CONFLICT DETECTION =====================

  /**
   * Checks if a requested time slot for a piece of equipment has any overlapping active bookings.
   * A conflict occurs if (req_start < existing_end) && (req_end > existing_start) on the same date.
   */
  public checkReservationConflict(
    equipmentId: string, 
    reservationDate: string, 
    startTime: string, 
    endTime: string,
    excludeReservationId?: string
  ): { hasConflict: boolean; conflictingReservation?: Reservation } {
    // Find all active reservations (pending or approved) for this equipment on this date
    const activeReservations = this.data.reservations.filter(r => 
      r.equipment_id === equipmentId &&
      r.reservation_date === reservationDate &&
      (r.status === 'approved' || r.status === 'pending') &&
      r.id !== excludeReservationId
    );

    for (const res of activeReservations) {
      // Overlap formula: (startA < endB) && (endA > startB)
      if (startTime < res.end_time && endTime > res.start_time) {
        return {
          hasConflict: true,
          conflictingReservation: res
        };
      }
    }

    return { hasConflict: false };
  }

  public createReservation(
    userId: string,
    reservationData: {
      equipment_id: string;
      reservation_date: string;
      start_time: string;
      end_time: string;
      purpose: string;
      project_name: string;
      supervisor_name?: string;
      notes?: string;
    }
  ): Reservation {
    // 1. Verify User
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found.');
    if (user.account_status !== 'active') {
      throw new Error(`Account is currently ${user.account_status}. You cannot make equipment reservations.`);
    }

    // 2. Verify Equipment
    const eq = this.getEquipmentById(reservationData.equipment_id);
    if (!eq) throw new Error('Equipment not found.');
    if (eq.status === 'maintenance') {
      throw new Error(`Equipment ${eq.name} is currently undergoing maintenance and cannot be reserved.`);
    }
    if (eq.status === 'unavailable' || !eq.is_reservable) {
      throw new Error(`Equipment ${eq.name} is unavailable for reservation.`);
    }

    // 3. Validate Date & Time
    const todayStr = new Date().toISOString().split('T')[0];
    if (reservationData.reservation_date < todayStr) {
      throw new Error('Reservation date cannot be in the past.');
    }
    if (reservationData.start_time >= reservationData.end_time) {
      throw new Error('Start time must be strictly before end time.');
    }

    // 4. Overlap Conflict Check
    const conflict = this.checkReservationConflict(
      reservationData.equipment_id,
      reservationData.reservation_date,
      reservationData.start_time,
      reservationData.end_time
    );

    if (conflict.hasConflict) {
      throw new Error(
        `Equipment ${eq.name} is already booked on ${reservationData.reservation_date} between ${conflict.conflictingReservation?.start_time} and ${conflict.conflictingReservation?.end_time}. Please select an alternate time slot or date.`
      );
    }

    const newReservation: Reservation = {
      id: `res-${crypto.randomUUID()}`,
      user_id: user.id,
      equipment_id: eq.id,
      reservation_date: reservationData.reservation_date,
      start_time: reservationData.start_time,
      end_time: reservationData.end_time,
      purpose: reservationData.purpose.trim(),
      project_name: reservationData.project_name.trim(),
      supervisor_name: reservationData.supervisor_name?.trim(),
      notes: reservationData.notes?.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Joined fields
      user_name: user.full_name,
      user_email: user.email,
      student_id: user.student_id,
      user_department: user.department,
      equipment_name: eq.name,
      equipment_code: eq.equipment_code,
      equipment_location: eq.location
    };

    this.data.reservations.push(newReservation);
    this.persist();
    return newReservation;
  }

  public listReservations(filters?: {
    userId?: string;
    equipmentId?: string;
    status?: ReservationStatus;
    date?: string;
    query?: string;
  }): Reservation[] {
    let result = [...this.data.reservations];

    if (filters?.userId) {
      result = result.filter(r => r.user_id === filters.userId);
    }
    if (filters?.equipmentId) {
      result = result.filter(r => r.equipment_id === filters.equipmentId);
    }
    if (filters?.status) {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters?.date) {
      result = result.filter(r => r.reservation_date === filters.date);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(r => 
        (r.user_name && r.user_name.toLowerCase().includes(q)) ||
        (r.student_id && r.student_id.toLowerCase().includes(q)) ||
        (r.equipment_name && r.equipment_name.toLowerCase().includes(q)) ||
        (r.equipment_code && r.equipment_code.toLowerCase().includes(q)) ||
        (r.project_name && r.project_name.toLowerCase().includes(q)) ||
        (r.purpose && r.purpose.toLowerCase().includes(q))
      );
    }

    // Sort descending by date & created_at
    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return result;
  }

  public getReservationById(id: string): Reservation | undefined {
    return this.data.reservations.find(r => r.id === id);
  }

  public updateReservationStatus(
    id: string, 
    status: ReservationStatus, 
    adminUser?: SafeUser, 
    reason?: string
  ): Reservation {
    const res = this.getReservationById(id);
    if (!res) throw new Error('Reservation not found.');

    res.status = status;
    res.updated_at = new Date().toISOString();

    if (status === 'approved' && adminUser) {
      res.approved_by = adminUser.full_name;
      res.approved_at = new Date().toISOString();
      res.rejection_reason = undefined;
    } else if (status === 'rejected') {
      res.rejection_reason = reason || 'Reservation request declined by laboratory administration.';
    } else if (status === 'cancelled') {
      res.cancellation_reason = reason || 'Cancelled by user or administrator.';
    }

    this.persist();
    return res;
  }

  // ===================== AUDIT LOGS =====================

  public logAudit(logData: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const entry: AuditLog = {
      ...logData,
      id: `aud-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(entry);
    // Keep max 5000 logs in memory/disk
    if (this.data.audit_logs.length > 5000) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 5000);
    }
    this.persist();
  }

  public listAuditLogs(filters?: { action?: string; entityType?: string; query?: string }): AuditLog[] {
    let result = [...this.data.audit_logs];

    if (filters?.action) {
      result = result.filter(l => l.action.toLowerCase() === filters.action!.toLowerCase());
    }
    if (filters?.entityType) {
      result = result.filter(l => l.entity_type === filters.entityType);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(l => 
        l.description.toLowerCase().includes(q) ||
        l.user_name.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }

    return result;
  }

  // ===================== SITE CONTENT =====================

  public listSiteContent(): SiteContent[] {
    return this.data.site_content;
  }

  public updateSiteContent(key: string, updates: Partial<SiteContent>, adminName: string): SiteContent {
    let content = this.data.site_content.find(c => c.key === key);
    if (!content) {
      content = {
        id: `cnt-${crypto.randomUUID()}`,
        key,
        title: updates.title || key,
        content: updates.content || '',
        category: updates.category || 'general',
        is_active: updates.is_active ?? true,
        updated_at: new Date().toISOString(),
        updated_by: adminName
      };
      this.data.site_content.push(content);
    } else {
      Object.assign(content, updates, {
        updated_at: new Date().toISOString(),
        updated_by: adminName
      });
    }

    this.persist();
    return content;
  }

  // ===================== PASSWORD RESET TOKENS =====================

  public createPasswordResetToken(userId: string, email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600000 * 2; // 2 hours expiry

    this.data.password_resets.push({
      id: `rst-${crypto.randomUUID()}`,
      user_id: userId,
      email,
      token,
      expires_at: expiresAt,
      used: false,
      created_at: new Date().toISOString()
    });

    this.persist();
    return token;
  }

  public verifyAndConsumeResetToken(token: string): { valid: boolean; userId?: string; error?: string } {
    const record = this.data.password_resets.find(r => r.token === token && !r.used);
    if (!record) {
      return { valid: false, error: 'Invalid or already used password reset link.' };
    }
    if (Date.now() > record.expires_at) {
      return { valid: false, error: 'Password reset link has expired. Please request a new one.' };
    }

    record.used = true;
    this.persist();
    return { valid: true, userId: record.user_id };
  }

  // ===================== SYSTEM METRICS =====================

  public getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter(u => u.account_status === 'active').length;
    const totalEquipment = this.data.equipment.length;
    const availableEquipment = this.data.equipment.filter(e => e.status === 'available' || e.status === 'partially_available').length;
    const maintenanceEquipment = this.data.equipment.filter(e => e.status === 'maintenance').length;
    const pendingReservations = this.data.reservations.filter(r => r.status === 'pending').length;
    const approvedReservations = this.data.reservations.filter(r => r.status === 'approved').length;
    const todayReservations = this.data.reservations.filter(r => r.reservation_date === today);

    return {
      totalUsers,
      activeUsers,
      totalEquipment,
      availableEquipment,
      maintenanceEquipment,
      pendingReservations,
      approvedReservations,
      todayReservationsCount: todayReservations.length,
      todayReservations
    };
  }
}

export const db = new DatabaseManager();

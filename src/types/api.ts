// Client-Side API Data Transfer Object (DTO) Type Definitions
// These types represent sanitized payloads transmitted between the backend API and the browser.
// Sensitive server internals (such as password hashes, salts, and secret keys) are strictly excluded.

export type UserRole = 'student' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'disabled';

export interface SafeUser {
  id: string;
  full_name: string;
  student_id: string;
  email: string;
  department: string;
  course: string;
  contact_number?: string;
  role: UserRole;
  account_status: AccountStatus;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type EquipmentStatus = 
  | 'available' 
  | 'partially_available' 
  | 'reserved' 
  | 'maintenance' 
  | 'unavailable';

export interface Equipment {
  id: string;
  item_no: number;
  equipment_code: string;
  name: string;
  category: 'Chemical' | 'Glassware' | 'Equipment' | 'Other';
  description: string;
  formula?: string;
  formula_plain?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  location: string;
  block: string;
  quantity: string;
  available_quantity: number;
  total_quantity: number;
  unit: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Maintenance Required' | 'Depleted';
  image_url?: string;
  operating_instructions?: string;
  safety_information?: string;
  hazard_class?: string;
  grade?: string;
  status: EquipmentStatus;
  is_reservable: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ReservationStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled' 
  | 'completed';

export interface Reservation {
  id: string;
  user_id: string;
  equipment_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  project_name: string;
  supervisor_name?: string;
  notes?: string;
  status: ReservationStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  student_id?: string;
  user_department?: string;
  equipment_name?: string;
  equipment_code?: string;
  equipment_location?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  entity_type: 'user' | 'equipment' | 'reservation' | 'content' | 'auth' | 'system';
  entity_id?: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface SiteContent {
  id: string;
  key: string;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  updated_at: string;
  updated_by: string;
}

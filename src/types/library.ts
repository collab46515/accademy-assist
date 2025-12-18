// Library Management System Types

export type LibraryBookStatus = 'available' | 'issued' | 'reserved' | 'lost' | 'withdrawn' | 'repair' | 'processing';
export type LibraryBookType = 'circulation' | 'reference';
export type LibraryMemberType = 'student' | 'staff';
export type LibrarySourceType = 'purchase' | 'donation';
export type LibraryFineStatus = 'pending' | 'paid' | 'waived' | 'partially_paid';
export type LibraryVerificationStatus = 'found' | 'missing' | 'withdrawn' | 'pending';

export interface LibrarySettings {
  id: string;
  school_id: string;
  student_max_books: number;
  student_loan_days: number;
  student_fine_per_day: number;
  student_max_renewals: number;
  staff_max_books: number;
  staff_loan_days: number;
  staff_fine_per_day: number;
  staff_max_renewals: number;
  allow_reservations: boolean;
  grace_period_days: number;
  lost_book_processing_fee: number;
  academic_year: string | null;
  created_at: string;
  updated_at: string;
}

export interface LibraryRack {
  id: string;
  school_id: string;
  rack_code: string;
  rack_name: string;
  section: string | null;
  room: string | null;
  floor: string | null;
  capacity: number | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LibraryBookTitle {
  id: string;
  school_id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  publication_year: number | null;
  edition: string | null;
  isbn: string | null;
  language: string;
  ddc_number: string | null;
  call_number_base: string | null;
  category: string | null;
  subcategory: string | null;
  keywords: string[] | null;
  book_type: LibraryBookType;
  pages: number | null;
  binding: string | null;
  cover_image_url: string | null;
  description: string | null;
  total_copies: number;
  available_copies: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface LibraryBookCopy {
  id: string;
  school_id: string;
  title_id: string;
  accession_number: number;
  call_number: string;
  copy_number: number;
  source: LibrarySourceType;
  acquisition_date: string;
  price: number | null;
  vendor_name: string | null;
  invoice_number: string | null;
  purchase_id: string | null;
  donation_id: string | null;
  rack_id: string | null;
  shelf_number: string | null;
  status: LibraryBookStatus;
  condition: string | null;
  is_reference: boolean;
  barcode: string | null;
  rfid_tag: string | null;
  withdrawn_date: string | null;
  withdrawn_reason: string | null;
  withdrawn_approved_by: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  // Joined data
  book_title?: LibraryBookTitle;
  rack?: LibraryRack;
}

export interface LibraryMember {
  id: string;
  school_id: string;
  member_type: LibraryMemberType;
  student_id: string | null;
  admission_number: string | null;
  class_name: string | null;
  section: string | null;
  roll_number: string | null;
  staff_db_id: string | null;
  staff_id: string | null;
  department: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  parent_contact: string | null;
  library_card_number: string | null;
  card_issued_date: string | null;
  card_expiry_date: string | null;
  is_active: boolean;
  is_blocked: boolean;
  blocked_reason: string | null;
  current_borrowed: number;
  total_borrowed: number;
  total_fines_pending: number;
  created_at: string;
  updated_at: string;
}

export interface LibraryCirculation {
  id: string;
  school_id: string;
  copy_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  issued_by: string | null;
  return_date: string | null;
  returned_by: string | null;
  return_condition: string | null;
  renewal_count: number;
  last_renewed_date: string | null;
  is_overdue: boolean;
  overdue_days: number | null;
  fine_amount: number | null;
  fine_paid: boolean;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  book_copy?: LibraryBookCopy;
  member?: LibraryMember;
}

export interface LibraryReservation {
  id: string;
  school_id: string;
  title_id: string;
  member_id: string;
  reserved_date: string;
  expiry_date: string | null;
  notified_date: string | null;
  notification_sent: boolean;
  status: string;
  fulfilled_copy_id: string | null;
  fulfilled_date: string | null;
  queue_position: number | null;
  created_at: string;
  updated_at: string;
  // Joined data
  book_title?: LibraryBookTitle;
  member?: LibraryMember;
}

export interface LibraryFine {
  id: string;
  school_id: string;
  member_id: string;
  circulation_id: string | null;
  copy_id: string | null;
  fine_type: string;
  fine_amount: number;
  paid_amount: number;
  balance: number;
  fine_date: string;
  due_date: string | null;
  status: LibraryFineStatus;
  payment_date: string | null;
  payment_method: string | null;
  receipt_number: string | null;
  collected_by: string | null;
  replacement_received: boolean;
  replacement_date: string | null;
  replacement_accession_number: number | null;
  recovery_action: string | null;
  closure_date: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  member?: LibraryMember;
}

export interface LibraryPurchase {
  id: string;
  school_id: string;
  purchase_number: string;
  purchase_date: string;
  vendor_name: string;
  vendor_address: string | null;
  vendor_contact: string | null;
  vendor_gst: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  invoice_amount: number | null;
  order_number: string | null;
  order_date: string | null;
  total_books: number;
  total_amount: number;
  discount_amount: number | null;
  tax_amount: number | null;
  net_amount: number;
  payment_status: string | null;
  payment_date: string | null;
  payment_reference: string | null;
  accession_start: number | null;
  accession_end: number | null;
  remarks: string | null;
  approved_by: string | null;
  approved_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface LibraryDonation {
  id: string;
  school_id: string;
  donation_number: string;
  donation_date: string;
  donor_name: string;
  donor_type: string | null;
  donor_address: string | null;
  donor_contact: string | null;
  donor_email: string | null;
  total_books: number;
  estimated_value: number | null;
  purpose: string | null;
  occasion: string | null;
  accession_start: number | null;
  accession_end: number | null;
  acknowledgement_sent: boolean;
  acknowledgement_date: string | null;
  acknowledgement_letter_ref: string | null;
  thanked_by: string | null;
  remarks: string | null;
  received_by: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface LibraryWithdrawal {
  id: string;
  school_id: string;
  withdrawal_number: string;
  withdrawal_date: string;
  reason: string;
  approved_by: string;
  approval_date: string;
  approval_authority: string | null;
  approval_reference: string | null;
  total_books: number;
  total_value: number | null;
  disposal_method: string | null;
  disposal_date: string | null;
  disposal_amount: number | null;
  disposal_remarks: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface LibraryStockVerification {
  id: string;
  school_id: string;
  verification_number: string;
  verification_name: string;
  start_date: string;
  end_date: string | null;
  accession_range_start: number | null;
  accession_range_end: number | null;
  rack_ids: string[] | null;
  total_expected: number;
  total_found: number;
  total_missing: number;
  total_withdrawn: number;
  total_damaged: number;
  status: string;
  verified_by: string[] | null;
  supervised_by: string | null;
  approved_by: string | null;
  approval_date: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface LibraryStockVerificationItem {
  id: string;
  verification_id: string;
  copy_id: string;
  status: LibraryVerificationStatus;
  verified_date: string | null;
  verified_by: string | null;
  found_at_rack_id: string | null;
  found_at_location: string | null;
  condition_at_verification: string | null;
  remarks: string | null;
  created_at: string;
  // Joined data
  book_copy?: LibraryBookCopy;
}

// Dashboard Stats
export interface LibraryDashboardStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  totalMembers: number;
  activeMembers: number;
  pendingFines: number;
  totalFinesAmount: number;
  recentCirculations: LibraryCirculation[];
  popularBooks: { title: string; borrow_count: number }[];
}

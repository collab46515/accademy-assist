-- Library Management System - Complete Database Schema (Fixed)

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE public.library_book_status AS ENUM (
  'available', 'issued', 'reserved', 'lost', 'withdrawn', 'repair', 'processing'
);

CREATE TYPE public.library_book_type AS ENUM (
  'circulation', 'reference'
);

CREATE TYPE public.library_member_type AS ENUM (
  'student', 'staff'
);

CREATE TYPE public.library_source_type AS ENUM (
  'purchase', 'donation'
);

CREATE TYPE public.library_fine_status AS ENUM (
  'pending', 'paid', 'waived', 'partially_paid'
);

CREATE TYPE public.library_verification_status AS ENUM (
  'found', 'missing', 'withdrawn', 'pending'
);

-- ============================================
-- LIBRARY SETTINGS (Configurable Policies)
-- ============================================

CREATE TABLE public.library_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_max_books INTEGER NOT NULL DEFAULT 2,
  student_loan_days INTEGER NOT NULL DEFAULT 14,
  student_fine_per_day DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  student_max_renewals INTEGER NOT NULL DEFAULT 1,
  staff_max_books INTEGER NOT NULL DEFAULT 5,
  staff_loan_days INTEGER NOT NULL DEFAULT 30,
  staff_fine_per_day DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  staff_max_renewals INTEGER NOT NULL DEFAULT 2,
  allow_reservations BOOLEAN NOT NULL DEFAULT true,
  grace_period_days INTEGER NOT NULL DEFAULT 0,
  lost_book_processing_fee DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  academic_year VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(school_id)
);

-- ============================================
-- LIBRARY RACKS (Shelving Locations)
-- ============================================

CREATE TABLE public.library_racks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  rack_code VARCHAR(20) NOT NULL,
  rack_name VARCHAR(100) NOT NULL,
  section VARCHAR(50),
  room VARCHAR(50),
  floor VARCHAR(20),
  capacity INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(school_id, rack_code)
);

-- ============================================
-- LIBRARY BOOK TITLES (Catalogue Level)
-- ============================================

CREATE TABLE public.library_book_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(300),
  authors TEXT[] NOT NULL DEFAULT '{}',
  publisher VARCHAR(200),
  publication_year INTEGER,
  edition VARCHAR(50),
  isbn VARCHAR(20),
  language VARCHAR(50) NOT NULL DEFAULT 'English',
  ddc_number VARCHAR(20),
  call_number_base VARCHAR(50),
  category VARCHAR(100),
  subcategory VARCHAR(100),
  keywords TEXT[],
  book_type library_book_type NOT NULL DEFAULT 'circulation',
  pages INTEGER,
  binding VARCHAR(50),
  cover_image_url TEXT,
  description TEXT,
  total_copies INTEGER NOT NULL DEFAULT 0,
  available_copies INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_library_book_titles_school ON public.library_book_titles(school_id);
CREATE INDEX idx_library_book_titles_isbn ON public.library_book_titles(isbn) WHERE isbn IS NOT NULL;
CREATE INDEX idx_library_book_titles_ddc ON public.library_book_titles(ddc_number);
CREATE INDEX idx_library_book_titles_title ON public.library_book_titles(title);

-- ============================================
-- LIBRARY BOOK COPIES (Accession Level)
-- ============================================

CREATE TABLE public.library_book_copies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES public.library_book_titles(id) ON DELETE CASCADE,
  accession_number INTEGER NOT NULL,
  call_number VARCHAR(50) NOT NULL,
  copy_number INTEGER NOT NULL DEFAULT 1,
  source library_source_type NOT NULL DEFAULT 'purchase',
  acquisition_date DATE NOT NULL DEFAULT CURRENT_DATE,
  price DECIMAL(10,2),
  vendor_name VARCHAR(200),
  invoice_number VARCHAR(100),
  purchase_id UUID,
  donation_id UUID,
  rack_id UUID REFERENCES public.library_racks(id),
  shelf_number VARCHAR(20),
  status library_book_status NOT NULL DEFAULT 'processing',
  condition VARCHAR(50) DEFAULT 'Good',
  is_reference BOOLEAN NOT NULL DEFAULT false,
  barcode VARCHAR(50),
  rfid_tag VARCHAR(100),
  withdrawn_date DATE,
  withdrawn_reason TEXT,
  withdrawn_approved_by VARCHAR(200),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(school_id, accession_number)
);

CREATE INDEX idx_library_book_copies_school ON public.library_book_copies(school_id);
CREATE INDEX idx_library_book_copies_title ON public.library_book_copies(title_id);
CREATE INDEX idx_library_book_copies_status ON public.library_book_copies(status);
CREATE INDEX idx_library_book_copies_rack ON public.library_book_copies(rack_id);
CREATE INDEX idx_library_book_copies_call_number ON public.library_book_copies(call_number);
CREATE INDEX idx_library_book_copies_barcode ON public.library_book_copies(barcode) WHERE barcode IS NOT NULL;

-- ============================================
-- LIBRARY MEMBERS
-- ============================================

CREATE TABLE public.library_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  member_type library_member_type NOT NULL,
  student_id UUID REFERENCES public.students(id),
  admission_number VARCHAR(50),
  class_name VARCHAR(50),
  section VARCHAR(20),
  roll_number VARCHAR(20),
  staff_db_id UUID REFERENCES public.staff(id),
  staff_id VARCHAR(50),
  department VARCHAR(100),
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(20),
  parent_contact VARCHAR(20),
  library_card_number VARCHAR(50),
  card_issued_date DATE,
  card_expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_reason TEXT,
  current_borrowed INTEGER NOT NULL DEFAULT 0,
  total_borrowed INTEGER NOT NULL DEFAULT 0,
  total_fines_pending DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_library_members_school ON public.library_members(school_id);
CREATE INDEX idx_library_members_type ON public.library_members(member_type);
CREATE INDEX idx_library_members_student ON public.library_members(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX idx_library_members_staff ON public.library_members(staff_db_id) WHERE staff_db_id IS NOT NULL;
CREATE INDEX idx_library_members_card ON public.library_members(library_card_number);

-- ============================================
-- LIBRARY CIRCULATION
-- ============================================

CREATE TABLE public.library_circulation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  copy_id UUID NOT NULL REFERENCES public.library_book_copies(id),
  member_id UUID NOT NULL REFERENCES public.library_members(id),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  issued_by UUID REFERENCES auth.users(id),
  return_date DATE,
  returned_by UUID REFERENCES auth.users(id),
  return_condition VARCHAR(50),
  renewal_count INTEGER NOT NULL DEFAULT 0,
  last_renewed_date DATE,
  is_overdue BOOLEAN NOT NULL DEFAULT false,
  overdue_days INTEGER,
  fine_amount DECIMAL(10,2),
  fine_paid BOOLEAN DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'issued',
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_library_circulation_school ON public.library_circulation(school_id);
CREATE INDEX idx_library_circulation_copy ON public.library_circulation(copy_id);
CREATE INDEX idx_library_circulation_member ON public.library_circulation(member_id);
CREATE INDEX idx_library_circulation_status ON public.library_circulation(status);
CREATE INDEX idx_library_circulation_dates ON public.library_circulation(issue_date, due_date, return_date);

-- ============================================
-- LIBRARY RESERVATIONS
-- ============================================

CREATE TABLE public.library_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES public.library_book_titles(id),
  member_id UUID NOT NULL REFERENCES public.library_members(id),
  reserved_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  notified_date DATE,
  notification_sent BOOLEAN DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  fulfilled_copy_id UUID REFERENCES public.library_book_copies(id),
  fulfilled_date DATE,
  queue_position INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_library_reservations_school ON public.library_reservations(school_id);
CREATE INDEX idx_library_reservations_title ON public.library_reservations(title_id);
CREATE INDEX idx_library_reservations_member ON public.library_reservations(member_id);
CREATE INDEX idx_library_reservations_status ON public.library_reservations(status);

-- ============================================
-- LIBRARY FINES
-- ============================================

CREATE TABLE public.library_fines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.library_members(id),
  circulation_id UUID REFERENCES public.library_circulation(id),
  copy_id UUID REFERENCES public.library_book_copies(id),
  fine_type VARCHAR(50) NOT NULL,
  fine_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  balance DECIMAL(10,2) NOT NULL,
  fine_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status library_fine_status NOT NULL DEFAULT 'pending',
  payment_date DATE,
  payment_method VARCHAR(50),
  receipt_number VARCHAR(50),
  collected_by UUID REFERENCES auth.users(id),
  replacement_received BOOLEAN DEFAULT false,
  replacement_date DATE,
  replacement_accession_number INTEGER,
  recovery_action TEXT,
  closure_date DATE,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_library_fines_school ON public.library_fines(school_id);
CREATE INDEX idx_library_fines_member ON public.library_fines(member_id);
CREATE INDEX idx_library_fines_status ON public.library_fines(status);

-- ============================================
-- LIBRARY PURCHASES
-- ============================================

CREATE TABLE public.library_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  purchase_number VARCHAR(50) NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor_name VARCHAR(200) NOT NULL,
  vendor_address TEXT,
  vendor_contact VARCHAR(100),
  vendor_gst VARCHAR(50),
  invoice_number VARCHAR(100),
  invoice_date DATE,
  invoice_amount DECIMAL(12,2),
  order_number VARCHAR(100),
  order_date DATE,
  total_books INTEGER NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_date DATE,
  payment_reference VARCHAR(100),
  accession_start INTEGER,
  accession_end INTEGER,
  remarks TEXT,
  approved_by VARCHAR(200),
  approved_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(school_id, purchase_number)
);

CREATE INDEX idx_library_purchases_school ON public.library_purchases(school_id);
CREATE INDEX idx_library_purchases_date ON public.library_purchases(purchase_date);

-- ============================================
-- LIBRARY DONATIONS
-- ============================================

CREATE TABLE public.library_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  donation_number VARCHAR(50) NOT NULL,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  donor_name VARCHAR(200) NOT NULL,
  donor_type VARCHAR(50),
  donor_address TEXT,
  donor_contact VARCHAR(100),
  donor_email VARCHAR(200),
  total_books INTEGER NOT NULL DEFAULT 0,
  estimated_value DECIMAL(12,2),
  purpose TEXT,
  occasion VARCHAR(100),
  accession_start INTEGER,
  accession_end INTEGER,
  acknowledgement_sent BOOLEAN DEFAULT false,
  acknowledgement_date DATE,
  acknowledgement_letter_ref VARCHAR(100),
  thanked_by VARCHAR(200),
  remarks TEXT,
  received_by VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(school_id, donation_number)
);

CREATE INDEX idx_library_donations_school ON public.library_donations(school_id);
CREATE INDEX idx_library_donations_date ON public.library_donations(donation_date);

-- ============================================
-- LIBRARY WITHDRAWALS
-- ============================================

CREATE TABLE public.library_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  withdrawal_number VARCHAR(50) NOT NULL,
  withdrawal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  approved_by VARCHAR(200) NOT NULL,
  approval_date DATE NOT NULL,
  approval_authority VARCHAR(100),
  approval_reference VARCHAR(100),
  total_books INTEGER NOT NULL DEFAULT 0,
  total_value DECIMAL(12,2),
  disposal_method VARCHAR(50),
  disposal_date DATE,
  disposal_amount DECIMAL(10,2),
  disposal_remarks TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(school_id, withdrawal_number)
);

CREATE INDEX idx_library_withdrawals_school ON public.library_withdrawals(school_id);

-- ============================================
-- LIBRARY STOCK VERIFICATIONS
-- ============================================

CREATE TABLE public.library_stock_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  verification_number VARCHAR(50) NOT NULL,
  verification_name VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  accession_range_start INTEGER,
  accession_range_end INTEGER,
  rack_ids UUID[],
  total_expected INTEGER NOT NULL DEFAULT 0,
  total_found INTEGER NOT NULL DEFAULT 0,
  total_missing INTEGER NOT NULL DEFAULT 0,
  total_withdrawn INTEGER NOT NULL DEFAULT 0,
  total_damaged INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
  verified_by TEXT[],
  supervised_by VARCHAR(200),
  approved_by VARCHAR(200),
  approval_date DATE,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(school_id, verification_number)
);

CREATE INDEX idx_library_stock_verifications_school ON public.library_stock_verifications(school_id);

-- ============================================
-- LIBRARY STOCK VERIFICATION ITEMS
-- ============================================

CREATE TABLE public.library_stock_verification_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID NOT NULL REFERENCES public.library_stock_verifications(id) ON DELETE CASCADE,
  copy_id UUID NOT NULL REFERENCES public.library_book_copies(id),
  status library_verification_status NOT NULL DEFAULT 'pending',
  verified_date TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  found_at_rack_id UUID REFERENCES public.library_racks(id),
  found_at_location TEXT,
  condition_at_verification VARCHAR(50),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(verification_id, copy_id)
);

CREATE INDEX idx_library_stock_verification_items_verification ON public.library_stock_verification_items(verification_id);
CREATE INDEX idx_library_stock_verification_items_status ON public.library_stock_verification_items(status);

-- ============================================
-- LIBRARY AUDIT LOG
-- ============================================

CREATE TABLE public.library_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_library_audit_log_school ON public.library_audit_log(school_id);
CREATE INDEX idx_library_audit_log_entity ON public.library_audit_log(entity_type, entity_id);
CREATE INDEX idx_library_audit_log_date ON public.library_audit_log(performed_at);

-- ============================================
-- ACCESSION NUMBER SEQUENCE
-- ============================================

CREATE TABLE public.library_accession_sequence (
  school_id UUID PRIMARY KEY REFERENCES public.schools(id) ON DELETE CASCADE,
  last_accession_number INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_next_accession_number(p_school_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_number INTEGER;
BEGIN
  INSERT INTO public.library_accession_sequence (school_id, last_accession_number, updated_at)
  VALUES (p_school_id, 1, now())
  ON CONFLICT (school_id) DO UPDATE
  SET last_accession_number = library_accession_sequence.last_accession_number + 1,
      updated_at = now()
  RETURNING last_accession_number INTO v_next_number;
  
  RETURN v_next_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_library_title_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.library_book_titles
    SET 
      total_copies = (SELECT COUNT(*) FROM public.library_book_copies WHERE title_id = NEW.title_id AND status != 'withdrawn'),
      available_copies = (SELECT COUNT(*) FROM public.library_book_copies WHERE title_id = NEW.title_id AND status = 'available'),
      updated_at = now()
    WHERE id = NEW.title_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.library_book_titles
    SET 
      total_copies = (SELECT COUNT(*) FROM public.library_book_copies WHERE title_id = OLD.title_id AND status != 'withdrawn'),
      available_copies = (SELECT COUNT(*) FROM public.library_book_copies WHERE title_id = OLD.title_id AND status = 'available'),
      updated_at = now()
    WHERE id = OLD.title_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER trigger_update_library_title_counts
AFTER INSERT OR UPDATE OR DELETE ON public.library_book_copies
FOR EACH ROW
EXECUTE FUNCTION public.update_library_title_counts();

CREATE OR REPLACE FUNCTION public.update_library_member_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.library_members
    SET 
      current_borrowed = (SELECT COUNT(*) FROM public.library_circulation WHERE member_id = NEW.member_id AND status = 'issued'),
      total_borrowed = (SELECT COUNT(*) FROM public.library_circulation WHERE member_id = NEW.member_id),
      updated_at = now()
    WHERE id = NEW.member_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.library_members
    SET 
      current_borrowed = (SELECT COUNT(*) FROM public.library_circulation WHERE member_id = OLD.member_id AND status = 'issued'),
      total_borrowed = (SELECT COUNT(*) FROM public.library_circulation WHERE member_id = OLD.member_id),
      updated_at = now()
    WHERE id = OLD.member_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER trigger_update_library_member_stats
AFTER INSERT OR UPDATE OR DELETE ON public.library_circulation
FOR EACH ROW
EXECUTE FUNCTION public.update_library_member_stats();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.library_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_racks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_book_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_book_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_circulation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_stock_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_stock_verification_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_accession_sequence ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_library_access(p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.is_super_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = p_school_id
        AND ur.is_active = true
    );
END;
$$;

-- Policies for all tables
CREATE POLICY "library_settings_access" ON public.library_settings FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_racks_access" ON public.library_racks FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_book_titles_access" ON public.library_book_titles FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_book_copies_access" ON public.library_book_copies FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_members_access" ON public.library_members FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_circulation_access" ON public.library_circulation FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_reservations_access" ON public.library_reservations FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_fines_access" ON public.library_fines FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_purchases_access" ON public.library_purchases FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_donations_access" ON public.library_donations FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_withdrawals_access" ON public.library_withdrawals FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_stock_verifications_access" ON public.library_stock_verifications FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_audit_log_access" ON public.library_audit_log FOR ALL USING (public.has_library_access(school_id));
CREATE POLICY "library_accession_sequence_access" ON public.library_accession_sequence FOR ALL USING (public.has_library_access(school_id));

CREATE POLICY "library_stock_verification_items_access" ON public.library_stock_verification_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.library_stock_verifications sv
    WHERE sv.id = verification_id
    AND public.has_library_access(sv.school_id)
  )
);
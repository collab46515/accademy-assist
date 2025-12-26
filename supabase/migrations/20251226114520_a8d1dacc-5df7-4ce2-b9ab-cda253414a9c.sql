
-- =====================================================
-- PHASE 1: Enhanced Master Data for Transport System
-- =====================================================

-- 1. Transport Contractors (Vendor Management)
CREATE TABLE public.transport_contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  contractor_name TEXT NOT NULL,
  contact_person_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  office_address TEXT,
  gst_number TEXT,
  pan_number TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_ifsc_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Vehicle Contracts (Contract details per vehicle)
CREATE TABLE public.vehicle_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES public.transport_contractors(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  contract_number TEXT,
  contract_start_date DATE NOT NULL,
  contract_end_date DATE NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('fixed_monthly', 'per_km', 'per_trip')),
  payment_amount DECIMAL(12,2) NOT NULL,
  payment_frequency TEXT DEFAULT 'monthly',
  terms_and_conditions TEXT,
  contract_document_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated', 'renewed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Vehicle Compliance Documents
CREATE TABLE public.vehicle_compliance_docs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('rc', 'fc', 'insurance', 'poc', 'permit', 'tax_token', 'other')),
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  issuing_authority TEXT,
  -- Insurance specific fields
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_premium DECIMAL(12,2),
  -- Permit specific fields
  permit_type TEXT, -- state, national, etc.
  permit_states TEXT[], -- states covered
  document_url TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expiring_soon', 'expired', 'pending_renewal')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Vehicle Parts (Parts with warranty tracking)
CREATE TABLE public.vehicle_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  part_name TEXT NOT NULL,
  part_serial_number TEXT,
  manufacturer TEXT,
  part_category TEXT, -- engine, brake, tire, electrical, etc.
  installation_date DATE NOT NULL,
  installation_odometer INTEGER,
  -- Warranty details
  warranty_type TEXT CHECK (warranty_type IN ('time_based', 'usage_based', 'both', 'none')),
  warranty_months INTEGER,
  warranty_kms INTEGER,
  warranty_expiry_date DATE,
  -- Lifecycle tracking
  standard_lifetime_months INTEGER,
  standard_lifetime_kms INTEGER,
  expected_replacement_date DATE,
  replacement_cost DECIMAL(12,2),
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'replaced', 'damaged', 'under_warranty_claim')),
  replaced_part_id UUID REFERENCES public.vehicle_parts(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Transport Holidays
CREATE TABLE public.transport_holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  holiday_name TEXT NOT NULL,
  holiday_date DATE NOT NULL,
  holiday_type TEXT NOT NULL CHECK (holiday_type IN ('government', 'school', 'emergency', 'other')),
  affects_transport BOOLEAN DEFAULT true,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, holiday_date)
);

-- 6. Enhance Vehicles table with new fields
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS make TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS chassis_number TEXT,
ADD COLUMN IF NOT EXISTS engine_number TEXT,
ADD COLUMN IF NOT EXISTS tank_capacity_litres DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS manufacturer_mileage_kmpl DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS current_mileage_kmpl DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS current_odometer INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS virtual_fuel_litres DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS ownership_type TEXT DEFAULT 'school_owned' CHECK (ownership_type IN ('school_owned', 'contractor_owned', 'leased')),
ADD COLUMN IF NOT EXISTS contractor_id UUID REFERENCES public.transport_contractors(id),
ADD COLUMN IF NOT EXISTS gps_device_id TEXT,
ADD COLUMN IF NOT EXISTS gps_device_status TEXT DEFAULT 'not_installed',
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS retirement_date DATE;

-- 7. Enhance Drivers table with new fields
ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS employee_type TEXT DEFAULT 'driver' CHECK (employee_type IN ('driver', 'attender', 'both')),
ADD COLUMN IF NOT EXISTS aadhar_number TEXT,
ADD COLUMN IF NOT EXISTS aadhar_document_url TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS permanent_address TEXT,
ADD COLUMN IF NOT EXISTS blood_group TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS psv_badge_number TEXT,
ADD COLUMN IF NOT EXISTS psv_badge_expiry DATE,
ADD COLUMN IF NOT EXISTS hmv_permit_number TEXT,
ADD COLUMN IF NOT EXISTS hmv_permit_expiry DATE,
ADD COLUMN IF NOT EXISTS medical_fitness_date DATE,
ADD COLUMN IF NOT EXISTS medical_fitness_expiry DATE,
ADD COLUMN IF NOT EXISTS medical_certificate_url TEXT,
ADD COLUMN IF NOT EXISTS background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'cleared', 'failed', 'expired')),
ADD COLUMN IF NOT EXISTS background_check_date DATE,
ADD COLUMN IF NOT EXISTS background_check_document_url TEXT,
ADD COLUMN IF NOT EXISTS police_verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS police_verification_date DATE,
ADD COLUMN IF NOT EXISTS uniform_size TEXT,
ADD COLUMN IF NOT EXISTS id_card_issued BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS id_card_number TEXT,
ADD COLUMN IF NOT EXISTS contractor_id UUID REFERENCES public.transport_contractors(id),
ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'permanent' CHECK (employment_type IN ('permanent', 'contract', 'temporary'));

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transport_contractors_school ON public.transport_contractors(school_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_contracts_contractor ON public.vehicle_contracts(contractor_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_contracts_vehicle ON public.vehicle_contracts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_compliance_vehicle ON public.vehicle_compliance_docs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_compliance_expiry ON public.vehicle_compliance_docs(expiry_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_parts_vehicle ON public.vehicle_parts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_transport_holidays_school ON public.transport_holidays(school_id);
CREATE INDEX IF NOT EXISTS idx_transport_holidays_date ON public.transport_holidays(holiday_date);
CREATE INDEX IF NOT EXISTS idx_vehicles_contractor ON public.vehicles(contractor_id);
CREATE INDEX IF NOT EXISTS idx_drivers_contractor ON public.drivers(contractor_id);

-- 9. Enable RLS on new tables
ALTER TABLE public.transport_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_compliance_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_holidays ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies for transport_contractors
CREATE POLICY "Users can view contractors in their school" ON public.transport_contractors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = transport_contractors.school_id 
      AND user_roles.is_active = true
    )
  );

CREATE POLICY "Users can manage contractors in their school" ON public.transport_contractors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = transport_contractors.school_id 
      AND user_roles.is_active = true
    )
  );

-- 11. RLS Policies for vehicle_contracts
CREATE POLICY "Users can view contracts in their school" ON public.vehicle_contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = vehicle_contracts.school_id 
      AND user_roles.is_active = true
    )
  );

CREATE POLICY "Users can manage contracts in their school" ON public.vehicle_contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = vehicle_contracts.school_id 
      AND user_roles.is_active = true
    )
  );

-- 12. RLS Policies for vehicle_compliance_docs
CREATE POLICY "Users can view compliance docs for their vehicles" ON public.vehicle_compliance_docs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      JOIN public.user_roles ur ON ur.school_id = v.school_id
      WHERE v.id = vehicle_compliance_docs.vehicle_id
      AND ur.user_id = auth.uid()
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can manage compliance docs for their vehicles" ON public.vehicle_compliance_docs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      JOIN public.user_roles ur ON ur.school_id = v.school_id
      WHERE v.id = vehicle_compliance_docs.vehicle_id
      AND ur.user_id = auth.uid()
      AND ur.is_active = true
    )
  );

-- 13. RLS Policies for vehicle_parts
CREATE POLICY "Users can view parts for their vehicles" ON public.vehicle_parts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      JOIN public.user_roles ur ON ur.school_id = v.school_id
      WHERE v.id = vehicle_parts.vehicle_id
      AND ur.user_id = auth.uid()
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can manage parts for their vehicles" ON public.vehicle_parts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      JOIN public.user_roles ur ON ur.school_id = v.school_id
      WHERE v.id = vehicle_parts.vehicle_id
      AND ur.user_id = auth.uid()
      AND ur.is_active = true
    )
  );

-- 14. RLS Policies for transport_holidays
CREATE POLICY "Users can view holidays in their school" ON public.transport_holidays
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = transport_holidays.school_id 
      AND user_roles.is_active = true
    )
  );

CREATE POLICY "Users can manage holidays in their school" ON public.transport_holidays
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = transport_holidays.school_id 
      AND user_roles.is_active = true
    )
  );

-- 15. Update triggers for updated_at
CREATE TRIGGER update_transport_contractors_updated_at
  BEFORE UPDATE ON public.transport_contractors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_contracts_updated_at
  BEFORE UPDATE ON public.vehicle_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_compliance_docs_updated_at
  BEFORE UPDATE ON public.vehicle_compliance_docs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_parts_updated_at
  BEFORE UPDATE ON public.vehicle_parts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_holidays_updated_at
  BEFORE UPDATE ON public.transport_holidays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

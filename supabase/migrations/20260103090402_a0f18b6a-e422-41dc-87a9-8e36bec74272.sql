-- Create safety checklists table
CREATE TABLE IF NOT EXISTS public.transport_safety_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    checklist_name TEXT NOT NULL,
    checklist_type TEXT NOT NULL DEFAULT 'pre_trip',
    applies_to TEXT NOT NULL DEFAULT 'vehicle',
    is_mandatory BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create checklist completions table
CREATE TABLE IF NOT EXISTS public.transport_checklist_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    checklist_id UUID REFERENCES public.transport_safety_checklists(id) ON DELETE CASCADE,
    completed_by TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT now(),
    overall_status TEXT DEFAULT 'pass',
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create driver certifications table
CREATE TABLE IF NOT EXISTS public.driver_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    certification_type TEXT NOT NULL,
    certification_name TEXT NOT NULL,
    issuing_authority TEXT,
    certificate_number TEXT,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    notes TEXT,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create vehicle inspections table
CREATE TABLE IF NOT EXISTS public.vehicle_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    inspection_type TEXT NOT NULL DEFAULT 'daily',
    inspection_date DATE NOT NULL,
    inspector_name TEXT NOT NULL,
    inspector_type TEXT DEFAULT 'internal',
    overall_result TEXT NOT NULL DEFAULT 'pass',
    odometer_reading INTEGER,
    defects_found JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create safety training table
CREATE TABLE IF NOT EXISTS public.transport_safety_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    training_type TEXT NOT NULL DEFAULT 'induction',
    training_name TEXT NOT NULL,
    training_provider TEXT,
    training_date DATE NOT NULL,
    duration_hours DECIMAL(5,2),
    status TEXT DEFAULT 'completed',
    score DECIMAL(5,2),
    passing_score DECIMAL(5,2),
    passed BOOLEAN,
    notes TEXT,
    certificate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.transport_safety_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_checklist_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_safety_training ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transport_safety_checklists
CREATE POLICY "Users can view checklists for their school"
ON public.transport_safety_checklists FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert checklists"
ON public.transport_safety_checklists FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update checklists"
ON public.transport_safety_checklists FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete checklists"
ON public.transport_safety_checklists FOR DELETE
USING (auth.uid() IS NOT NULL);

-- RLS Policies for transport_checklist_completions
CREATE POLICY "Users can view completions"
ON public.transport_checklist_completions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert completions"
ON public.transport_checklist_completions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for driver_certifications
CREATE POLICY "Users can view certifications"
ON public.driver_certifications FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert certifications"
ON public.driver_certifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update certifications"
ON public.driver_certifications FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete certifications"
ON public.driver_certifications FOR DELETE
USING (auth.uid() IS NOT NULL);

-- RLS Policies for vehicle_inspections
CREATE POLICY "Users can view inspections"
ON public.vehicle_inspections FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert inspections"
ON public.vehicle_inspections FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update inspections"
ON public.vehicle_inspections FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete inspections"
ON public.vehicle_inspections FOR DELETE
USING (auth.uid() IS NOT NULL);

-- RLS Policies for transport_safety_training
CREATE POLICY "Users can view training"
ON public.transport_safety_training FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert training"
ON public.transport_safety_training FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update training"
ON public.transport_safety_training FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete training"
ON public.transport_safety_training FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_safety_checklists_school ON public.transport_safety_checklists(school_id);
CREATE INDEX IF NOT EXISTS idx_checklist_completions_school ON public.transport_checklist_completions(school_id);
CREATE INDEX IF NOT EXISTS idx_driver_certifications_school ON public.driver_certifications(school_id);
CREATE INDEX IF NOT EXISTS idx_driver_certifications_driver ON public.driver_certifications(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_inspections_school ON public.vehicle_inspections(school_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_inspections_vehicle ON public.vehicle_inspections(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_safety_training_school ON public.transport_safety_training(school_id);
CREATE INDEX IF NOT EXISTS idx_safety_training_driver ON public.transport_safety_training(driver_id);
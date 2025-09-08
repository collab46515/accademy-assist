-- Ensure RLS is enabled and create idempotent policies for fee-related tables

-- Helper: predicate reused across policies
-- Checks user has an active role in the same school or is super admin
-- We inline the predicate in each policy (no separate function to keep it simple)

-- 1) fee_heads
ALTER TABLE public.fee_heads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'fee_heads' AND policyname = 'Fee heads: staff select'
  ) THEN
    CREATE POLICY "Fee heads: staff select" ON public.fee_heads
    FOR SELECT USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_heads.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'fee_heads' AND policyname = 'Fee heads: staff insert'
  ) THEN
    CREATE POLICY "Fee heads: staff insert" ON public.fee_heads
    FOR INSERT WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_heads.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'fee_heads' AND policyname = 'Fee heads: staff update'
  ) THEN
    CREATE POLICY "Fee heads: staff update" ON public.fee_heads
    FOR UPDATE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_heads.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    ) WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_heads.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'fee_heads' AND policyname = 'Fee heads: staff delete'
  ) THEN
    CREATE POLICY "Fee heads: staff delete" ON public.fee_heads
    FOR DELETE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_heads.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;
END $$;

-- 2) fee_structures
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_structures' AND policyname='Fee structures: staff select'
  ) THEN
    CREATE POLICY "Fee structures: staff select" ON public.fee_structures
    FOR SELECT USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_structures.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_structures' AND policyname='Fee structures: staff insert'
  ) THEN
    CREATE POLICY "Fee structures: staff insert" ON public.fee_structures
    FOR INSERT WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_structures.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_structures' AND policyname='Fee structures: staff update'
  ) THEN
    CREATE POLICY "Fee structures: staff update" ON public.fee_structures
    FOR UPDATE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_structures.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    ) WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_structures.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_structures' AND policyname='Fee structures: staff delete'
  ) THEN
    CREATE POLICY "Fee structures: staff delete" ON public.fee_structures
    FOR DELETE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_structures.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;
END $$;

-- 3) fee_discounts
ALTER TABLE public.fee_discounts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_discounts' AND policyname='Fee discounts: staff select'
  ) THEN
    CREATE POLICY "Fee discounts: staff select" ON public.fee_discounts
    FOR SELECT USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_discounts.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_discounts' AND policyname='Fee discounts: staff insert'
  ) THEN
    CREATE POLICY "Fee discounts: staff insert" ON public.fee_discounts
    FOR INSERT WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_discounts.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_discounts' AND policyname='Fee discounts: staff update'
  ) THEN
    CREATE POLICY "Fee discounts: staff update" ON public.fee_discounts
    FOR UPDATE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_discounts.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    ) WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_discounts.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_discounts' AND policyname='Fee discounts: staff delete'
  ) THEN
    CREATE POLICY "Fee discounts: staff delete" ON public.fee_discounts
    FOR DELETE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_discounts.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;
END $$;

-- 4) fee_waivers
ALTER TABLE public.fee_waivers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_waivers' AND policyname='Fee waivers: staff select'
  ) THEN
    CREATE POLICY "Fee waivers: staff select" ON public.fee_waivers
    FOR SELECT USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_waivers.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_waivers' AND policyname='Fee waivers: staff insert'
  ) THEN
    CREATE POLICY "Fee waivers: staff insert" ON public.fee_waivers
    FOR INSERT WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_waivers.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_waivers' AND policyname='Fee waivers: staff update'
  ) THEN
    CREATE POLICY "Fee waivers: staff update" ON public.fee_waivers
    FOR UPDATE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_waivers.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    ) WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_waivers.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='fee_waivers' AND policyname='Fee waivers: staff delete'
  ) THEN
    CREATE POLICY "Fee waivers: staff delete" ON public.fee_waivers
    FOR DELETE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = fee_waivers.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;
END $$;

-- 5) student_fee_assignments
ALTER TABLE public.student_fee_assignments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='student_fee_assignments' AND policyname='Student fee assignments: staff select'
  ) THEN
    CREATE POLICY "Student fee assignments: staff select" ON public.student_fee_assignments
    FOR SELECT USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = student_fee_assignments.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='student_fee_assignments' AND policyname='Student fee assignments: staff insert'
  ) THEN
    CREATE POLICY "Student fee assignments: staff insert" ON public.student_fee_assignments
    FOR INSERT WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = student_fee_assignments.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='student_fee_assignments' AND policyname='Student fee assignments: staff update'
  ) THEN
    CREATE POLICY "Student fee assignments: staff update" ON public.student_fee_assignments
    FOR UPDATE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = student_fee_assignments.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    ) WITH CHECK (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = student_fee_assignments.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='student_fee_assignments' AND policyname='Student fee assignments: staff delete'
  ) THEN
    CREATE POLICY "Student fee assignments: staff delete" ON public.student_fee_assignments
    FOR DELETE USING (
      (EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.school_id = student_fee_assignments.school_id
          AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
          AND ur.is_active = true
      )) OR is_super_admin(auth.uid())
    );
  END IF;
END $$;
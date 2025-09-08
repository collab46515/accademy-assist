-- Make start_date and end_date nullable for installment_plans since they're not used in the UI
ALTER TABLE public.installment_plans 
ALTER COLUMN start_date DROP NOT NULL,
ALTER COLUMN end_date DROP NOT NULL;
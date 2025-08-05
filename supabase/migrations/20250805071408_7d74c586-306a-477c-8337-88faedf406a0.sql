-- Remove foreign key constraints that reference auth.users for demo purposes
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_user_id_fkey;
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;

-- Also remove from any other tables that might have this constraint
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT 
            tc.table_name, 
            tc.constraint_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND ccu.table_name = 'users'
          AND tc.table_schema = 'public'
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', rec.table_name, rec.constraint_name);
    END LOOP;
END $$;
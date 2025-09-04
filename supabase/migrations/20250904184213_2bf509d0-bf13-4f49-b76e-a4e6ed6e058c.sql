-- Update reset function to preserve minimal auth-related tables for access
CREATE OR REPLACE FUNCTION public.reset_public_data_preserve_auth()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  tables_truncated TEXT[] := '{}';
  seq RECORD;
  sequences_reset TEXT[] := '{}';
  total_tables INT := 0;
BEGIN
  -- Truncate all tables in the public schema except minimal auth-related metadata
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN (
        'schema_migrations',
        'profiles',       -- keep user profiles metadata for login UX
        'user_roles'      -- keep roles so admins retain access
      )
  LOOP
    EXECUTE format('TRUNCATE TABLE %I.%I CASCADE;', 'public', r.tablename);
    tables_truncated := array_append(tables_truncated, r.tablename);
    total_tables := total_tables + 1;
  END LOOP;

  -- Reset all sequences in public schema back to 1
  FOR seq IN
    SELECT sequence_schema, sequence_name
    FROM information_schema.sequences
    WHERE sequence_schema = 'public'
  LOOP
    EXECUTE format('ALTER SEQUENCE %I.%I RESTART WITH 1;', seq.sequence_schema, seq.sequence_name);
    sequences_reset := array_append(sequences_reset, seq.sequence_name);
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Public schema data cleared; Auth users, profiles, and roles preserved',
    'tables_truncated', tables_truncated,
    'sequences_reset', sequences_reset,
    'tables_count', total_tables
  );
END;
$$;

-- Execute the reset now
SELECT public.reset_public_data_preserve_auth();
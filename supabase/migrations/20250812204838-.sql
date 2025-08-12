-- Final cleanup of duplicates and fix any remaining issues
DO $$
DECLARE
    duplicate_record RECORD;
BEGIN
    -- Clean up remaining duplicates
    FOR duplicate_record IN
        SELECT p.email, array_agg(s.id ORDER BY s.created_at DESC) as student_ids
        FROM students s
        JOIN profiles p ON s.user_id = p.user_id  
        GROUP BY p.email
        HAVING COUNT(*) > 1
    LOOP
        -- Delete student_parents relationships for duplicates
        DELETE FROM student_parents 
        WHERE student_id = ANY(duplicate_record.student_ids[2:]);
        
        -- Delete user_roles for duplicate users
        DELETE FROM user_roles 
        WHERE user_id IN (
            SELECT s.user_id FROM students s 
            WHERE s.id = ANY(duplicate_record.student_ids[2:])
        );
        
        -- Delete duplicate students (keeping the latest one)
        DELETE FROM students 
        WHERE id = ANY(duplicate_record.student_ids[2:]);
        
        -- Delete duplicate profiles
        DELETE FROM profiles 
        WHERE user_id IN (
            SELECT s.user_id FROM students s 
            WHERE s.id = ANY(duplicate_record.student_ids[2:])
        );
        
        RAISE NOTICE 'Final cleanup: removed % duplicates for %', 
                     array_length(duplicate_record.student_ids, 1) - 1, 
                     duplicate_record.email;
    END LOOP;
END $$;
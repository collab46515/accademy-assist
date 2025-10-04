import { useRBAC } from './useRBAC';

/**
 * Centralized hook for school-specific data filtering
 * Ensures all queries respect current school context
 * 
 * Usage:
 * const { currentSchoolId, hasSchoolContext, ensureSchoolContext } = useSchoolFilter();
 * if (!hasSchoolContext) return; // Guard clause
 * const { data } = await supabase.from('students').select('*').eq('school_id', currentSchoolId);
 */
export function useSchoolFilter() {
  const { currentSchool, isSuperAdmin } = useRBAC();

  /**
   * Get the current school ID for filtering queries
   * Returns undefined if no school is selected
   */
  const currentSchoolId = currentSchool?.id;

  /**
   * Check if school context is available
   * Use this as a guard before making school-specific queries
   */
  const hasSchoolContext = !!currentSchool;

  /**
   * Ensure school context exists, throw error if not
   * Use this when school context is required
   */
  const ensureSchoolContext = () => {
    if (!currentSchool) {
      throw new Error('School context required but not available');
    }
    return currentSchool.id;
  };

  /**
   * Check if current user should see all schools' data
   * Super admins with no specific school selected can see everything
   */
  const shouldFilterBySchool = () => {
    if (!currentSchool) return false; // No school selected
    return true; // Always filter when school is selected
  };

  return {
    currentSchoolId,
    currentSchool,
    hasSchoolContext,
    ensureSchoolContext,
    shouldFilterBySchool: shouldFilterBySchool(),
    isSuperAdmin: isSuperAdmin()
  };
}

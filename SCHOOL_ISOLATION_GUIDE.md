# School Data Isolation Guide

## Overview
This application implements **strict school-based data isolation** to ensure users only see data from their assigned school. This document explains how this is enforced and how to maintain it.

## Three Layers of Protection

### 1. Row Level Security (RLS) Policies
Database-level security that CANNOT be bypassed by the application code.

**Tables with school_id column** (60+ tables):
- activities, students, attendance_records, payment_records, etc.

**RLS Policy Pattern**:
```sql
-- Example: Students table policy
CREATE POLICY "Users can view students from their school"
ON students FOR SELECT
USING (
  school_id IN (
    SELECT school_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR is_super_admin(auth.uid())
);
```

### 2. Application-Level Filtering
All queries MUST filter by `school_id` using the current school context.

**Pattern to Follow**:
```typescript
import { useSchoolFilter } from '@/hooks/useSchoolFilter';

function MyComponent() {
  const { currentSchoolId, hasSchoolContext } = useSchoolFilter();
  
  // Guard clause - don't fetch if no school selected
  if (!hasSchoolContext) return null;
  
  // Always filter by school_id
  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', currentSchoolId);
}
```

### 3. UI Context Awareness
Components should gracefully handle missing school context.

```typescript
const { hasSchoolContext, currentSchool } = useSchoolFilter();

if (!hasSchoolContext) {
  return (
    <div>
      <p>Please select a school to view this content</p>
    </div>
  );
}
```

## Implementation Checklist

### For Data Fetching Hooks
- [ ] Import `useSchoolFilter`
- [ ] Check `hasSchoolContext` before querying
- [ ] Always add `.eq('school_id', currentSchoolId)` to queries
- [ ] Handle case when school context is missing

### For Components
- [ ] Use `useSchoolFilter` to get current school
- [ ] Show appropriate UI when no school selected
- [ ] Filter all displayed data by current school
- [ ] Test with multiple schools to verify isolation

### For New Features
- [ ] Add `school_id UUID NOT NULL` column to new tables
- [ ] Create RLS policies for the table
- [ ] Add foreign key: `REFERENCES schools(id) ON DELETE CASCADE`
- [ ] Always include school filter in queries

## Common Patterns

### Pattern 1: Simple Data Fetching
```typescript
const fetchStudents = async () => {
  const { currentSchoolId, hasSchoolContext } = useSchoolFilter();
  if (!hasSchoolContext) return [];
  
  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', currentSchoolId);
  
  return data || [];
};
```

### Pattern 2: Creating Records
```typescript
const createStudent = async (studentData) => {
  const { ensureSchoolContext } = useSchoolFilter();
  const schoolId = ensureSchoolContext(); // Throws if no school
  
  const { data, error } = await supabase
    .from('students')
    .insert({
      ...studentData,
      school_id: schoolId // Always set school_id
    });
  
  return { data, error };
};
```

### Pattern 3: Updating Records
```typescript
const updateStudent = async (studentId, updates) => {
  const { currentSchoolId } = useSchoolFilter();
  
  // Double-check the record belongs to current school
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId)
    .eq('school_id', currentSchoolId) // Security check
    .select()
    .single();
  
  return { data, error };
};
```

## Super Admin Behavior

Super admins can:
- See all schools in the school switcher
- View data from ANY school when that school is selected
- BUT still respect the selected school's context

Super admins CANNOT:
- Bypass RLS policies
- See data from all schools simultaneously (must select a school)

## Testing School Isolation

1. **Create two schools with different data**
2. **Switch between schools** using the school switcher
3. **Verify data changes** completely when switching schools
4. **Check no data leaks** between schools
5. **Test with different user roles** (admin, teacher, etc.)

## RLS Policy Audit

Run this query to check which tables need attention:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## Migration Example

When adding a new feature:

```sql
-- 1. Create table with school_id
CREATE TABLE my_new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE my_new_feature ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
CREATE POLICY "Users can view their school's data"
ON my_new_feature FOR SELECT
USING (
  school_id IN (
    SELECT school_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Repeat for INSERT, UPDATE, DELETE as needed
```

## Summary

**Golden Rules**:
1. ✅ Every table with user data MUST have `school_id`
2. ✅ Every query MUST filter by `school_id`
3. ✅ Every RLS policy MUST check school access
4. ✅ Always test with multiple schools
5. ✅ Handle missing school context gracefully

Following these rules ensures **complete data isolation** between schools.

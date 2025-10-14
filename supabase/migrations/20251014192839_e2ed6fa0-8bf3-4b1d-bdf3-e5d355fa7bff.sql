-- Restore all modules with proper categories
INSERT INTO modules (id, name, description, route, icon, category, is_active, sort_order) VALUES
-- Dashboard & Core
(gen_random_uuid(), 'Dashboard', 'Main dashboard and analytics', '/dashboard', 'LayoutDashboard', 'Dashboard', true, 1),
(gen_random_uuid(), 'HOD Dashboard', 'Head of Department dashboard', '/hod/dashboard', 'Users', 'Dashboard', true, 2),

-- Admissions
(gen_random_uuid(), 'Admissions Workflow', 'Student admissions management', '/admissions', 'UserPlus', 'Admissions', true, 10),
(gen_random_uuid(), 'Enrollment Test', 'Entrance test management', '/enrollment-test', 'ClipboardCheck', 'Admissions', true, 11),
(gen_random_uuid(), 'Student Exit', 'Student exit process', '/student-exit', 'UserMinus', 'Admissions', true, 12),

-- Curriculum & Academic
(gen_random_uuid(), 'Curriculum & Lessons', 'Curriculum and lesson planning', '/curriculum', 'BookOpen', 'Curriculum', true, 20),
(gen_random_uuid(), 'Academic Management', 'Academic programs and management', '/academic', 'GraduationCap', 'Academics', true, 21),
(gen_random_uuid(), 'Timetable Management', 'Class schedules and timetables', '/timetable', 'Calendar', 'Timetable', true, 22),
(gen_random_uuid(), 'Exams & Assessment', 'Examinations and assessments', '/exams', 'FileText', 'Academics', true, 23),
(gen_random_uuid(), 'Assignments', 'Student assignments', '/assignments', 'Clipboard', 'Assignments', true, 24),
(gen_random_uuid(), 'Report Cards', 'Student report cards', '/reports', 'Award', 'Reports', true, 25),
(gen_random_uuid(), 'Gradebook', 'Grade management', '/gradebook', 'BookMarked', 'Gradebook', true, 26),

-- Student Management
(gen_random_uuid(), 'Student Directory', 'Student information management', '/students', 'Users', 'Students', true, 30),
(gen_random_uuid(), 'Attendance Tracking', 'Student attendance', '/attendance', 'CheckSquare', 'Attendance', true, 31),

-- Support Services
(gen_random_uuid(), 'Transport Management', 'Transport and bus routes', '/transport', 'Bus', 'Transport', true, 40),
(gen_random_uuid(), 'Library Services', 'Library management', '/library', 'Library', 'Library', true, 41),
(gen_random_uuid(), 'Behavior Tracking', 'Student behavior monitoring', '/behavior', 'Target', 'Behavior Tracking', true, 42),

-- Safeguarding & Welfare
(gen_random_uuid(), 'Student Welfare', 'Student welfare management', '/welfare', 'Heart', 'Safeguarding', true, 50),
(gen_random_uuid(), 'Infirmary', 'Health and medical records', '/infirmary', 'Activity', 'Infirmary', true, 51),
(gen_random_uuid(), 'Complaints', 'Complaint management', '/complaints', 'AlertCircle', 'Safeguarding', true, 52),
(gen_random_uuid(), 'Safeguarding', 'Safeguarding policies', '/safeguarding', 'Shield', 'Safeguarding', true, 53),

-- Activities & Events
(gen_random_uuid(), 'Activities & Events', 'Extracurricular activities', '/activities', 'Sparkles', 'Activities', true, 60),
(gen_random_uuid(), 'Events Management', 'School events', '/events', 'Calendar', 'Events', true, 61);

-- Add sample features for Finance module (commonly used)
INSERT INTO module_features (id, module_id, feature_name, feature_key, description, icon, sort_order, is_active)
SELECT 
  gen_random_uuid(),
  m.id,
  'Fee Collection',
  'fee_collection',
  'Collect and manage student fees',
  'DollarSign',
  1,
  true
FROM modules m WHERE m.name = 'Dashboard'
UNION ALL
SELECT 
  gen_random_uuid(),
  m.id,
  'Invoicing',
  'invoicing',
  'Generate and manage invoices',
  'FileText',
  2,
  true
FROM modules m WHERE m.name = 'Dashboard'
UNION ALL
SELECT 
  gen_random_uuid(),
  m.id,
  'Payment Tracking',
  'payment_tracking',
  'Track payments and receipts',
  'CreditCard',
  3,
  true
FROM modules m WHERE m.name = 'Dashboard';

-- Add sample features for HR module (commonly used)
INSERT INTO module_features (id, module_id, feature_name, feature_key, description, icon, sort_order, is_active)
SELECT 
  gen_random_uuid(),
  m.id,
  'Employee Management',
  'employee_management',
  'Manage employee records',
  'Users',
  1,
  true
FROM modules m WHERE m.name = 'HOD Dashboard'
UNION ALL
SELECT 
  gen_random_uuid(),
  m.id,
  'Payroll',
  'payroll',
  'Process employee payroll',
  'Wallet',
  2,
  true
FROM modules m WHERE m.name = 'HOD Dashboard'
UNION ALL
SELECT 
  gen_random_uuid(),
  m.id,
  'Leave Management',
  'leave_management',
  'Manage employee leave requests',
  'Calendar',
  3,
  true
FROM modules m WHERE m.name = 'HOD Dashboard';

-- Add features for Student Directory
INSERT INTO module_features (id, module_id, feature_name, feature_key, description, icon, sort_order, is_active)
SELECT 
  gen_random_uuid(),
  m.id,
  'Student Profiles',
  'student_profiles',
  'Comprehensive student information',
  'User',
  1,
  true
FROM modules m WHERE m.name = 'Student Directory'
UNION ALL
SELECT 
  gen_random_uuid(),
  m.id,
  'Parent Portal',
  'parent_portal',
  'Parent access to student info',
  'Users',
  2,
  true
FROM modules m WHERE m.name = 'Student Directory';

-- Add features for Attendance
INSERT INTO module_features (id, module_id, feature_name, feature_key, description, icon, sort_order, is_active)
SELECT 
  gen_random_uuid(),
  m.id,
  'Daily Attendance',
  'daily_attendance',
  'Mark daily student attendance',
  'CheckSquare',
  1,
  true
FROM modules m WHERE m.name = 'Attendance Tracking'
UNION ALL
SELECT 
  gen_random_uuid(),
  m.id,
  'Attendance Reports',
  'attendance_reports',
  'Generate attendance reports',
  'FileText',
  2,
  true
FROM modules m WHERE m.name = 'Attendance Tracking';

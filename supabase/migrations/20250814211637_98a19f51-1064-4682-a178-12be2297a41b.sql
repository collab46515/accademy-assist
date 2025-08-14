-- Assign student role to test.student@pappaya.academy
INSERT INTO user_roles (user_id, school_id, role, assigned_by)
VALUES (
  'e03b2468-20b9-488b-b191-c378ed2f231b',
  '9bc460e4-b7ff-4b12-8eac-c8a41ebfdc16',
  'student',
  'e03b2468-20b9-488b-b191-c378ed2f231b'
);

-- Assign parent role to test.parent@pappaya.academy  
INSERT INTO user_roles (user_id, school_id, role, assigned_by)
VALUES (
  'd757ef79-86a7-4cce-a69a-e50ce55fdc6d',
  '9bc460e4-b7ff-4b12-8eac-c8a41ebfdc16', 
  'parent',
  'd757ef79-86a7-4cce-a69a-e50ce55fdc6d'
);
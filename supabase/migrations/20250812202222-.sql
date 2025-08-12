-- Create mock fee structures for all year groups and school types
INSERT INTO fee_structures (
  school_id,
  name,
  description,
  academic_year,
  term,
  fee_heads,
  total_amount,
  applicable_year_groups,
  status
) VALUES
-- Primary School Fees (Year 1-6)
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Primary School Fees (Years 1-6)',
  'Complete fee structure for primary education including tuition, activities, and materials',
  '2024-2025',
  'Annual',
  '[
    {"head_name": "Tuition Fee", "amount": 5950.00, "is_mandatory": true},
    {"head_name": "Facilities Fee", "amount": 1275.00, "is_mandatory": true},
    {"head_name": "Technology Fee", "amount": 680.00, "is_mandatory": true},
    {"head_name": "Activities Fee", "amount": 425.00, "is_mandatory": false},
    {"head_name": "Examination Fee", "amount": 170.00, "is_mandatory": true}
  ]',
  8500.00,
  ARRAY['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
  'active'
),
-- Secondary School Fees (Year 7-11)
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Secondary School Fees (Years 7-11)',
  'Complete fee structure for secondary education including tuition, lab fees, and examinations',
  '2024-2025',
  'Annual',
  '[
    {"head_name": "Tuition Fee", "amount": 8750.00, "is_mandatory": true},
    {"head_name": "Facilities Fee", "amount": 1875.00, "is_mandatory": true},
    {"head_name": "Technology Fee", "amount": 1000.00, "is_mandatory": true},
    {"head_name": "Activities Fee", "amount": 625.00, "is_mandatory": false},
    {"head_name": "Examination Fee", "amount": 250.00, "is_mandatory": true}
  ]',
  12500.00,
  ARRAY['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'],
  'active'
),
-- Sixth Form Fees (Year 12-13)
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Sixth Form Fees (Years 12-13)',
  'Complete fee structure for A-Level studies including specialized subjects and university preparation',
  '2024-2025',
  'Annual',
  '[
    {"head_name": "Tuition Fee", "amount": 10500.00, "is_mandatory": true},
    {"head_name": "Facilities Fee", "amount": 2250.00, "is_mandatory": true},
    {"head_name": "Technology Fee", "amount": 1200.00, "is_mandatory": true},
    {"head_name": "Activities Fee", "amount": 750.00, "is_mandatory": false},
    {"head_name": "Examination Fee", "amount": 300.00, "is_mandatory": true}
  ]',
  15000.00,
  ARRAY['Year 12', 'Year 13'],
  'active'
),
-- Nursery/Early Years Fees
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Early Years Foundation Stage',
  'Complete fee structure for nursery and reception including meals and activities',
  '2024-2025',
  'Annual',
  '[
    {"head_name": "Tuition Fee", "amount": 5250.00, "is_mandatory": true},
    {"head_name": "Facilities Fee", "amount": 1125.00, "is_mandatory": true},
    {"head_name": "Technology Fee", "amount": 600.00, "is_mandatory": true},
    {"head_name": "Activities Fee", "amount": 375.00, "is_mandatory": false},
    {"head_name": "Meals & Snacks", "amount": 150.00, "is_mandatory": true}
  ]',
  7500.00,
  ARRAY['Nursery', 'Reception'],
  'active'
),
-- International Student Fees
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'International Student Fees (All Years)',
  'Enhanced fee structure for international students including additional support services',
  '2024-2025',
  'Annual',
  '[
    {"head_name": "Tuition Fee", "amount": 12600.00, "is_mandatory": true},
    {"head_name": "Facilities Fee", "amount": 2700.00, "is_mandatory": true},
    {"head_name": "Technology Fee", "amount": 1440.00, "is_mandatory": true},
    {"head_name": "Activities Fee", "amount": 900.00, "is_mandatory": false},
    {"head_name": "International Support", "amount": 360.00, "is_mandatory": true}
  ]',
  18000.00,
  ARRAY['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'],
  'active'
);
-- Create mock fee structures for all year groups and school types
INSERT INTO fee_structures (
  id,
  school_id,
  name,
  description,
  fee_type,
  total_amount,
  applicable_year_groups,
  academic_year,
  status,
  created_at,
  updated_at
) VALUES
-- Primary School Fees (Year 1-6)
(
  gen_random_uuid(),
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Primary School Fees (Years 1-6)',
  'Complete fee structure for primary education including tuition, activities, and materials',
  'annual',
  8500.00,
  '["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"]',
  '2024-2025',
  'active',
  NOW(),
  NOW()
),
-- Secondary School Fees (Year 7-11)
(
  gen_random_uuid(),
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Secondary School Fees (Years 7-11)',
  'Complete fee structure for secondary education including tuition, lab fees, and examinations',
  'annual',
  12500.00,
  '["Year 7", "Year 8", "Year 9", "Year 10", "Year 11"]',
  '2024-2025',
  'active',
  NOW(),
  NOW()
),
-- Sixth Form Fees (Year 12-13)
(
  gen_random_uuid(),
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Sixth Form Fees (Years 12-13)',
  'Complete fee structure for A-Level studies including specialized subjects and university preparation',
  'annual',
  15000.00,
  '["Year 12", "Year 13"]',
  '2024-2025',
  'active',
  NOW(),
  NOW()
),
-- Nursery/Early Years Fees
(
  gen_random_uuid(),
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Early Years Foundation Stage',
  'Complete fee structure for nursery and reception including meals and activities',
  'annual',
  7500.00,
  '["Nursery", "Reception"]',
  '2024-2025',
  'active',
  NOW(),
  NOW()
),
-- International Student Fees
(
  gen_random_uuid(),
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'International Student Fees (All Years)',
  'Enhanced fee structure for international students including additional support services',
  'annual',
  18000.00,
  '["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]',
  '2024-2025',
  'active',
  NOW(),
  NOW()
);

-- Create fee structure components for detailed breakdown
INSERT INTO fee_structure_components (
  id,
  fee_structure_id,
  component_name,
  amount,
  is_mandatory,
  description,
  billing_frequency
) 
SELECT
  gen_random_uuid(),
  fs.id,
  component.name,
  component.amount,
  component.mandatory,
  component.description,
  component.frequency
FROM fee_structures fs
CROSS JOIN (
  VALUES
    ('Tuition Fee', 0.70, true, 'Core teaching and learning costs', 'termly'),
    ('Facilities Fee', 0.15, true, 'Use of school facilities and maintenance', 'termly'),
    ('Technology Fee', 0.08, true, 'IT equipment and digital learning resources', 'termly'),
    ('Activities Fee', 0.05, false, 'Sports, clubs, and extracurricular activities', 'termly'),
    ('Examination Fee', 0.02, true, 'Assessment and examination costs', 'annually')
) AS component(name, percentage, mandatory, description, frequency)
WHERE fs.school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f'
ON CONFLICT DO NOTHING;

-- Update the component amounts based on the fee structure totals
UPDATE fee_structure_components 
SET amount = (
  SELECT ROUND(fs.total_amount * 
    CASE 
      WHEN fee_structure_components.component_name = 'Tuition Fee' THEN 0.70
      WHEN fee_structure_components.component_name = 'Facilities Fee' THEN 0.15
      WHEN fee_structure_components.component_name = 'Technology Fee' THEN 0.08
      WHEN fee_structure_components.component_name = 'Activities Fee' THEN 0.05
      WHEN fee_structure_components.component_name = 'Examination Fee' THEN 0.02
      ELSE 0
    END, 2)
  FROM fee_structures fs 
  WHERE fs.id = fee_structure_components.fee_structure_id
)
WHERE EXISTS (
  SELECT 1 FROM fee_structures fs 
  WHERE fs.id = fee_structure_components.fee_structure_id 
  AND fs.school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f'
);
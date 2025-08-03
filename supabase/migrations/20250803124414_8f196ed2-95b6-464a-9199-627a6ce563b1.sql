-- Insert sample enrollment applications for testing
INSERT INTO public.enrollment_applications (
  application_number,
  pathway,
  status,
  student_name,
  year_group,
  date_of_birth,
  gender,
  nationality,
  parent_name,
  parent_email,
  parent_phone,
  parent_relationship,
  home_address,
  postal_code,
  country,
  previous_school,
  current_year_group,
  emergency_contact_name,
  emergency_contact_phone,
  emergency_contact_relationship,
  medical_information,
  special_requirements,
  workflow_completion_percentage,
  priority_score,
  school_id,
  submitted_by,
  submitted_at,
  additional_data
) VALUES 
(
  'APP2024001',
  'standard',
  'submitted',
  'Emma Thompson',
  'Year 7',
  '2012-03-15',
  'Female',
  'British',
  'Sarah Thompson',
  'sarah.thompson@email.com',
  '+44 7123 456789',
  'Mother',
  '123 Oak Street, London',
  'SW1A 1AA',
  'United Kingdom',
  'Primary Academy',
  'Year 6',
  'John Thompson',
  '+44 7987 654321',
  'Father',
  'No known allergies',
  'None',
  15,
  75,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '3 days',
  '{"pathway_specific": {"immigration_status": "British Citizen"}}'::jsonb
),
(
  'APP2024002',
  'standard',
  'reviewing',
  'James Wilson',
  'Year 9',
  '2010-07-22',
  'Male',
  'British',
  'Maria Wilson',
  'maria.wilson@email.com',
  '+44 7234 567890',
  'Mother',
  '456 Elm Avenue, Manchester',
  'M1 2AB',
  'United Kingdom',
  'City Secondary School',
  'Year 8',
  'David Wilson',
  '+44 7876 543210',
  'Father',
  'Asthma - requires inhaler',
  'Extra time for exams',
  45,
  82,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '5 days',
  '{"pathway_specific": {"immigration_status": "British Citizen"}}'::jsonb
),
(
  'APP2024003',
  'sen',
  'assessment',
  'Sophie Chen',
  'Year 7',
  '2012-11-08',
  'Female',
  'Chinese',
  'Li Chen',
  'li.chen@email.com',
  '+44 7345 678901',
  'Mother',
  '789 Pine Road, Birmingham',
  'B1 3CD',
  'United Kingdom',
  'International Primary',
  'Year 6',
  'Wei Chen',
  '+44 7765 432109',
  'Father',
  'No medical issues',
  'Autism Spectrum Disorder - needs quiet environment',
  65,
  88,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '1 week',
  '{"pathway_specific": {"sen_status": "EHCP in place", "current_provision": "1:1 support"}}'::jsonb
),
(
  'APP2024004',
  'staff_child',
  'approved',
  'Oliver Johnson',
  'Year 8',
  '2011-05-14',
  'Male',
  'British',
  'Rachel Johnson',
  'rachel.johnson@school.edu',
  '+44 7456 789012',
  'Mother (Staff)',
  'School Housing, Campus',
  'ED1 4EF',
  'United Kingdom',
  'School Junior Department',
  'Year 7',
  'Michael Johnson',
  '+44 7654 321098',
  'Father',
  'No medical issues',
  'None',
  95,
  65,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '2 weeks',
  '{"pathway_specific": {"staff_id": "STAFF001", "staff_department": "Mathematics", "staff_role": "Head of Department"}}'::jsonb
),
(
  'APP2024005',
  'emergency',
  'interview',
  'Maya Patel',
  'Year 10',
  '2009-12-03',
  'Female',
  'Indian',
  'Priya Patel',
  'priya.patel@email.com',
  '+44 7567 890123',
  'Mother',
  'Temporary Housing, Local Authority',
  'TH1 5GH',
  'United Kingdom',
  'Previous School - Emergency Move',
  'Year 9',
  'Social Services',
  '+44 800 123456',
  'Social Worker',
  'Anxiety - requires support',
  'Trauma-informed approach needed',
  75,
  95,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '4 days',
  '{"pathway_specific": {"referral_source": "Local Authority", "referral_date": "2024-01-10", "referral_contact": "Sarah Davies", "referral_email": "sarah.davies@la.gov.uk", "known_risks": "Family domestic violence situation", "urgent_needs": ["uniform", "meals", "counselling"]}}'::jsonb
),
(
  'APP2024006',
  'standard',
  'decision',
  'Alexander Brown',
  'Year 7',
  '2012-04-20',
  'Male',
  'British',
  'Emma Brown',
  'emma.brown@email.com',
  '+44 7678 901234',
  'Mother',
  '321 Maple Drive, Leeds',
  'LS1 6IJ',
  'United Kingdom',
  'Preparatory School',
  'Year 6',
  'Thomas Brown',
  '+44 7543 210987',
  'Father',
  'Type 1 Diabetes - insulin required',
  'Dietary requirements',
  85,
  78,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '10 days',
  '{"pathway_specific": {"immigration_status": "British Citizen"}}'::jsonb
);

-- Insert some sample workflow steps and timeline data
INSERT INTO public.enrollment_workflow_steps (
  application_id,
  workflow_id,
  step_name,
  step_type,
  order_index,
  status,
  is_completed,
  started_at,
  completed_at
) 
SELECT 
  ea.id,
  '00000000-0000-0000-0000-000000000001',
  'Initial Review',
  'review',
  1,
  CASE 
    WHEN ea.status IN ('submitted') THEN 'draft'
    ELSE 'submitted'
  END,
  CASE 
    WHEN ea.status IN ('submitted') THEN false
    ELSE true
  END,
  ea.submitted_at,
  CASE 
    WHEN ea.status IN ('submitted') THEN NULL
    ELSE ea.submitted_at + INTERVAL '1 day'
  END
FROM enrollment_applications ea
WHERE ea.application_number LIKE 'APP2024%';

-- Add some sample documents
INSERT INTO public.enrollment_documents (
  application_id,
  document_name,
  document_type,
  file_path,
  file_size,
  mime_type,
  is_required,
  is_verified,
  uploaded_by,
  verified_by,
  uploaded_at,
  verified_at
)
SELECT 
  ea.id,
  'Birth Certificate',
  'identity',
  '/documents/' || ea.application_number || '/birth_cert.pdf',
  2048576,
  'application/pdf',
  true,
  CASE WHEN ea.status NOT IN ('submitted') THEN true ELSE false END,
  ea.submitted_by,
  CASE WHEN ea.status NOT IN ('submitted') THEN ea.submitted_by ELSE NULL END,
  ea.submitted_at,
  CASE WHEN ea.status NOT IN ('submitted') THEN ea.submitted_at + INTERVAL '1 day' ELSE NULL END
FROM enrollment_applications ea
WHERE ea.application_number LIKE 'APP2024%';

-- Add sample assessments
INSERT INTO public.enrollment_assessments (
  application_id,
  assessment_type,
  assessment_date,
  overall_score,
  subject_scores,
  status,
  scheduled_by,
  assessed_by,
  assessor_notes,
  recommendations
)
SELECT 
  ea.id,
  'CAT4 Assessment',
  CURRENT_DATE + INTERVAL '3 days',
  CASE 
    WHEN ea.status IN ('approved', 'decision') THEN 85.5
    WHEN ea.status = 'assessment' THEN NULL
    ELSE NULL
  END,
  CASE 
    WHEN ea.status IN ('approved', 'decision') THEN '{"verbal": 88, "quantitative": 82, "spatial": 87, "non_verbal": 85}'::jsonb
    ELSE '{}'::jsonb
  END,
  CASE 
    WHEN ea.status IN ('approved', 'decision') THEN 'completed'
    WHEN ea.status = 'assessment' THEN 'scheduled'
    ELSE 'not_scheduled'
  END,
  ea.submitted_by,
  CASE WHEN ea.status IN ('approved', 'decision') THEN ea.submitted_by ELSE NULL END,
  CASE 
    WHEN ea.status IN ('approved', 'decision') THEN 'Strong performance across all areas. Student demonstrates good problem-solving skills.'
    ELSE NULL
  END,
  CASE 
    WHEN ea.status IN ('approved', 'decision') THEN 'Recommend for admission. Consider placement in higher ability groups.'
    ELSE NULL
  END
FROM enrollment_applications ea
WHERE ea.application_number LIKE 'APP2024%';
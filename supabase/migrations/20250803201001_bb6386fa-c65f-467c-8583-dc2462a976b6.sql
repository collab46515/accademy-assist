-- Insert sample fee heads for testing
INSERT INTO public.fee_heads (school_id, name, description, category, amount, recurrence, applicable_classes, applicable_genders, is_active) VALUES 
('school_1', 'Tuition Fee', 'Primary tuition fee for academic instruction', 'Tuition', 1250.00, 'termly', '{}', '{}', true),
('school_1', 'School Transport', 'Daily transport to and from school', 'Transport', 150.00, 'termly', '{}', '{}', true),
('school_1', 'School Meals', 'Daily lunch and snacks', 'Meals', 200.00, 'termly', '{}', '{}', true),
('school_1', 'ICT Fee', 'Computer lab and technology access', 'ICT', 75.00, 'termly', '{}', '{}', true),
('school_1', 'Sports Fee', 'Sports facilities and equipment', 'Sports', 50.00, 'termly', '{}', '{}', true),
('school_1', 'Music Lessons', 'Individual and group music lessons', 'Music Lessons', 100.00, 'termly', '{"Year 7", "Year 8", "Year 9", "Year 10", "Year 11"}', '{}', true),
('school_1', 'Examination Fee', 'Annual examination and assessment costs', 'Examination', 85.00, 'annually', '{"Year 10", "Year 11", "Year 12", "Year 13"}', '{}', true),
('school_1', 'Library Fee', 'Library access and book rental', 'Library', 25.00, 'annually', '{}', '{}', true);

-- Insert sample fee structures for testing  
INSERT INTO public.fee_structures (school_id, name, description, academic_year, term, fee_heads, total_amount, applicable_year_groups, status) VALUES 
('school_1', 'Year 7-11 Autumn Term', 'Standard fee structure for secondary students', '2024-25', 'Autumn', '[{"fee_head_id": "1", "amount": 1250}, {"fee_head_id": "2", "amount": 150}, {"fee_head_id": "3", "amount": 200}]', 1600.00, '{"Year 7", "Year 8", "Year 9", "Year 10", "Year 11"}', 'active'),
('school_1', 'Year 12-13 Autumn Term', 'Sixth form fee structure', '2024-25', 'Autumn', '[{"fee_head_id": "1", "amount": 1500}, {"fee_head_id": "4", "amount": 75}]', 1575.00, '{"Year 12", "Year 13"}', 'active'),
('school_1', 'Spring Term 2025', 'Spring term fee structure', '2024-25', 'Spring', '[{"fee_head_id": "1", "amount": 1250}, {"fee_head_id": "2", "amount": 150}]', 1400.00, '{"Year 7", "Year 8", "Year 9", "Year 10", "Year 11"}', 'draft');
-- Fix transport route type constraint and add demo data
-- First check what route types are allowed
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'transport_routes'::regclass AND contype = 'c';

-- Add demo data with correct route types
INSERT INTO drivers (
  school_id,
  employee_id,
  first_name,
  last_name,
  email,
  phone,
  license_number,
  license_expiry,
  license_type,
  hire_date,
  status
) VALUES 
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'EMP001',
  'John',
  'Smith',
  'john.smith@demo.school.com',
  '+44 7700 900001',
  'D1234567',
  '2026-12-31',
  ARRAY['D1', 'D'],
  '2022-01-15',
  'active'
),
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'EMP002',
  'Sarah',
  'Johnson',
  'sarah.johnson@demo.school.com',
  '+44 7700 900002',
  'D2345678',
  '2025-08-15',
  ARRAY['D1', 'D'],
  '2021-09-01',
  'active'
),
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'EMP003',
  'Michael',
  'Brown',
  'michael.brown@demo.school.com',
  '+44 7700 900003',
  'D3456789',
  '2027-03-20',
  ARRAY['D1', 'D', 'C1'],
  '2020-05-10',
  'active'
);

-- Add demo vehicles
INSERT INTO vehicles (
  school_id,
  vehicle_number,
  vehicle_type,
  capacity,
  driver_id,
  status,
  registration_number,
  insurance_expiry,
  last_maintenance,
  next_maintenance,
  fuel_type,
  year_manufactured,
  make_model
) VALUES 
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'BUS001',
  'bus',
  45,
  (SELECT id FROM drivers WHERE employee_id = 'EMP001' LIMIT 1),
  'active',
  'BUS 123A',
  '2025-06-30',
  '2024-11-01',
  '2025-02-01',
  'diesel',
  2020,
  'Mercedes Sprinter'
),
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'BUS002',
  'bus',
  35,
  (SELECT id FROM drivers WHERE employee_id = 'EMP002' LIMIT 1),
  'active',
  'BUS 456B',
  '2025-09-15',
  '2024-10-15',
  '2025-01-15',
  'diesel',
  2019,
  'Ford Transit'
),
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'VAN001',
  'van',
  12,
  (SELECT id FROM drivers WHERE employee_id = 'EMP003' LIMIT 1),
  'active',
  'VAN 789C',
  '2025-12-01',
  '2024-11-20',
  '2025-02-20',
  'diesel',
  2021,
  'Volkswagen Crafter'
);

-- Add demo transport routes with correct route_type values
INSERT INTO transport_routes (
  school_id,
  route_name,
  route_code,
  vehicle_id,
  driver_id,
  route_type,
  start_time,
  end_time,
  estimated_duration,
  distance_km,
  status
) VALUES 
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'North Route',
  'R001',
  (SELECT id FROM vehicles WHERE vehicle_number = 'BUS001' LIMIT 1),
  (SELECT id FROM drivers WHERE employee_id = 'EMP001' LIMIT 1),
  'morning',
  '07:00:00',
  '08:30:00',
  90,
  25.5,
  'active'
),
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'South Route',
  'R002',
  (SELECT id FROM vehicles WHERE vehicle_number = 'BUS002' LIMIT 1),
  (SELECT id FROM drivers WHERE employee_id = 'EMP002' LIMIT 1),
  'morning',
  '07:15:00',
  '08:45:00',
  90,
  22.3,
  'active'
),
(
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'City Centre Route',
  'R003',
  (SELECT id FROM vehicles WHERE vehicle_number = 'VAN001' LIMIT 1),
  (SELECT id FROM drivers WHERE employee_id = 'EMP003' LIMIT 1),
  'afternoon',
  '15:30:00',
  '16:15:00',
  45,
  12.8,
  'active'
);
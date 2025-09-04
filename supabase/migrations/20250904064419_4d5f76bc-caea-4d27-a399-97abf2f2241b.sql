-- Transport demo data (constraint-safe)
-- Routes require route_type in ('pickup_only','drop_only','pickup_drop')
-- route_stops.pickup_time is NOT NULL, so always provide a value

-- 1) Drivers
INSERT INTO drivers (school_id, employee_id, first_name, last_name, email, phone, license_number, license_expiry, license_type, hire_date, status)
VALUES
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','EMP001','John','Smith','john.smith@demo.school.com','+44 7700 900001','D1234567','2026-12-31',ARRAY['D1','D'],'2022-01-15','active'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','EMP002','Sarah','Johnson','sarah.johnson@demo.school.com','+44 7700 900002','D2345678','2025-08-15',ARRAY['D1','D'],'2021-09-01','active'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','EMP003','Michael','Brown','michael.brown@demo.school.com','+44 7700 900003','D3456789','2027-03-20',ARRAY['D1','D','C1'],'2020-05-10','active');

-- 2) Vehicles
INSERT INTO vehicles (school_id, vehicle_number, vehicle_type, capacity, driver_id, status, registration_number, insurance_expiry, last_maintenance, next_maintenance, fuel_type, year_manufactured, make_model)
VALUES
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','BUS001','bus',45,(SELECT id FROM drivers WHERE employee_id='EMP001' LIMIT 1),'active','BUS 123A','2025-06-30','2024-11-01','2025-02-01','diesel',2020,'Mercedes Sprinter'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','BUS002','bus',35,(SELECT id FROM drivers WHERE employee_id='EMP002' LIMIT 1),'active','BUS 456B','2025-09-15','2024-10-15','2025-01-15','diesel',2019,'Ford Transit'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','VAN001','van',12,(SELECT id FROM drivers WHERE employee_id='EMP003' LIMIT 1),'active','VAN 789C','2025-12-01','2024-11-20','2025-02-20','diesel',2021,'Volkswagen Crafter');

-- 3) Routes (use allowed route_type values)
INSERT INTO transport_routes (school_id, route_name, route_code, vehicle_id, driver_id, route_type, start_time, end_time, estimated_duration, distance_km, status)
VALUES
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','North Route','R001',(SELECT id FROM vehicles WHERE vehicle_number='BUS001' LIMIT 1),(SELECT id FROM drivers WHERE employee_id='EMP001' LIMIT 1),'pickup_drop','07:00:00','08:30:00',90,25.5,'active'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','South Route','R002',(SELECT id FROM vehicles WHERE vehicle_number='BUS002' LIMIT 1),(SELECT id FROM drivers WHERE employee_id='EMP002' LIMIT 1),'pickup_only','07:15:00','08:45:00',90,22.3,'active'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f','City Centre Route','R003',(SELECT id FROM vehicles WHERE vehicle_number='VAN001' LIMIT 1),(SELECT id FROM drivers WHERE employee_id='EMP003' LIMIT 1),'drop_only','15:30:00','16:15:00',45,12.8,'active');

-- 4) Route stops (always provide pickup_time)
INSERT INTO route_stops (route_id, stop_name, stop_order, pickup_time, drop_time, location_address, distance_from_school, estimated_travel_time)
VALUES
-- R001 pickup_drop
((SELECT id FROM transport_routes WHERE route_code='R001' LIMIT 1),'Northfield Shopping Centre',1,'07:00:00','15:30:00','Northfield Way, Birmingham B31 2UE',25.5,30),
((SELECT id FROM transport_routes WHERE route_code='R001' LIMIT 1),'Longbridge Station',2,'07:15:00','15:15:00','Longbridge Lane, Birmingham B31 4ET',20.2,25),
((SELECT id FROM transport_routes WHERE route_code='R001' LIMIT 1),'Rednal High Street',3,'07:30:00','15:00:00','Rednal High Street, Birmingham B45 9UU',15.8,20),
-- R002 pickup_only (drop_time optional but we still provide a sensible value)
((SELECT id FROM transport_routes WHERE route_code='R002' LIMIT 1),'Kings Norton Green',1,'07:15:00','15:30:00','The Green, Kings Norton, Birmingham B30 3LE',22.3,25),
((SELECT id FROM transport_routes WHERE route_code='R002' LIMIT 1),'Bournville Village',2,'07:30:00','15:15:00','Oak Tree Lane, Bournville B30 1UB',18.1,20),
-- R003 drop_only (pickup_time required by schema, use route start time)
((SELECT id FROM transport_routes WHERE route_code='R003' LIMIT 1),'Birmingham New Street',1,'15:30:00','16:15:00','New Street, Birmingham B2 4QA',12.8,15),
((SELECT id FROM transport_routes WHERE route_code='R003' LIMIT 1),'Jewellery Quarter',2,'15:45:00','16:30:00','Vyse Street, Birmingham B18 6LE',10.2,12);

-- 5) Student transport assignments
INSERT INTO student_transport (school_id, student_id, route_id, stop_id, pickup_stop_id, drop_stop_id, transport_fee, fee_frequency, start_date, status, parent_phone, emergency_contact)
VALUES
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',(SELECT id FROM students WHERE student_number='STU0001' LIMIT 1),(SELECT id FROM transport_routes WHERE route_code='R001' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Northfield Shopping Centre' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Northfield Shopping Centre' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Northfield Shopping Centre' LIMIT 1),150.00,'monthly','2024-09-01','active','+44 8000000001','+44 8000000001'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',(SELECT id FROM students WHERE student_number='STU0010' LIMIT 1),(SELECT id FROM transport_routes WHERE route_code='R002' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Kings Norton Green' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Kings Norton Green' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Kings Norton Green' LIMIT 1),140.00,'monthly','2024-09-01','active','+44 8000000010','+44 8000000010'),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',(SELECT id FROM students WHERE student_number='STU0020' LIMIT 1),(SELECT id FROM transport_routes WHERE route_code='R003' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Birmingham New Street' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Birmingham New Street' LIMIT 1),(SELECT id FROM route_stops WHERE stop_name='Birmingham New Street' LIMIT 1),120.00,'monthly','2024-09-01','active','+44 8000000020','+44 8000000020');

-- 6) Transport incidents
INSERT INTO transport_incidents (school_id, vehicle_id, route_id, incident_type, incident_date, location, description, severity, reported_by, status, students_affected, parent_notified, authorities_notified, insurance_claim)
VALUES
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',(SELECT id FROM vehicles WHERE vehicle_number='BUS001' LIMIT 1),(SELECT id FROM transport_routes WHERE route_code='R001' LIMIT 1),'mechanical_issue','2024-11-15','Northfield Shopping Centre','Bus experienced engine warning light. Vehicle safely pulled over and backup transport arranged.','minor',(SELECT id FROM drivers WHERE employee_id='EMP001' LIMIT 1),'resolved',ARRAY['STU0001','STU0002','STU0003'],true,false,false),
('c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',(SELECT id FROM vehicles WHERE vehicle_number='BUS002' LIMIT 1),(SELECT id FROM transport_routes WHERE route_code='R002' LIMIT 1),'traffic_delay','2024-11-20','A38 Bristol Road','Significant traffic delays due to road works. Students arrived 15 minutes late.','minor',(SELECT id FROM drivers WHERE employee_id='EMP002' LIMIT 1),'resolved',ARRAY['STU0010','STU0011'],true,false,false);
import { supabase } from '@/integrations/supabase/client';

export interface BulkImportRow {
  // Student Information
  student_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  year_group: string;
  class_name: string;
  admission_date: string;
  student_email?: string;
  student_phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  
  // Parent 1 Information
  parent1_first_name: string;
  parent1_last_name: string;
  parent1_email: string;
  parent1_phone: string;
  parent1_relationship: string;
  parent1_occupation?: string;
  parent1_is_primary_contact: string;
  
  // Parent 2 Information (optional)
  parent2_first_name?: string;
  parent2_last_name?: string;
  parent2_email?: string;
  parent2_phone?: string;
  parent2_relationship?: string;
  parent2_occupation?: string;
  parent2_is_primary_contact?: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship?: string;
  
  // Medical Information
  medical_conditions?: string;
  allergies?: string;
  medications?: string;
  blood_group?: string;
  
  // Fee Assignment
  fee_structure_name: string;
  discount_percentage?: string;
  discount_reason?: string;
  payment_plan?: string;
  
  // Additional Information
  house?: string;
  previous_school?: string;
  special_needs?: string;
  languages_spoken?: string;
  religion?: string;
  ethnicity?: string;
}

export const generateBulkImportTemplate = (schoolCode: string): string => {
  const headers = [
    // Student Information (14 columns)
    'student_number',
    'first_name',
    'last_name',
    'date_of_birth',
    'gender',
    'year_group',
    'class_name',
    'admission_date',
    'student_email',
    'student_phone',
    'address_line1',
    'address_line2',
    'city',
    'postcode',
    'country',
    
    // Parent 1 Information (7 columns)
    'parent1_first_name',
    'parent1_last_name',
    'parent1_email',
    'parent1_phone',
    'parent1_relationship',
    'parent1_occupation',
    'parent1_is_primary_contact',
    
    // Parent 2 Information (7 columns)
    'parent2_first_name',
    'parent2_last_name',
    'parent2_email',
    'parent2_phone',
    'parent2_relationship',
    'parent2_occupation',
    'parent2_is_primary_contact',
    
    // Emergency Contact (3 columns)
    'emergency_contact_name',
    'emergency_contact_phone',
    'emergency_contact_relationship',
    
    // Medical Information (4 columns)
    'medical_conditions',
    'allergies',
    'medications',
    'blood_group',
    
    // Fee Assignment (4 columns)
    'fee_structure_name',
    'discount_percentage',
    'discount_reason',
    'payment_plan',
    
    // Additional Information (6 columns)
    'house',
    'previous_school',
    'special_needs',
    'languages_spoken',
    'religion',
    'ethnicity'
  ];

  // Example rows showing different scenarios
  const examples = [
    {
      // Example 1: New student, both parents, standard fees
      student_number: 'STU2024001',
      first_name: 'Emma',
      last_name: 'Johnson',
      date_of_birth: '2010-05-15',
      gender: 'Female',
      year_group: 'Year 7',
      class_name: '7A',
      admission_date: '2024-09-01',
      student_email: '',
      student_phone: '',
      address_line1: '123 Oak Street',
      address_line2: 'Apartment 4B',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom',
      parent1_first_name: 'Sarah',
      parent1_last_name: 'Johnson',
      parent1_email: 's.johnson@email.com',
      parent1_phone: '+44 7700 900123',
      parent1_relationship: 'Mother',
      parent1_occupation: 'Engineer',
      parent1_is_primary_contact: 'YES',
      parent2_first_name: 'Michael',
      parent2_last_name: 'Johnson',
      parent2_email: 'm.johnson@email.com',
      parent2_phone: '+44 7700 900124',
      parent2_relationship: 'Father',
      parent2_occupation: 'Doctor',
      parent2_is_primary_contact: 'NO',
      emergency_contact_name: 'Sarah Johnson',
      emergency_contact_phone: '+44 7700 900123',
      emergency_contact_relationship: 'Mother',
      medical_conditions: 'Asthma',
      allergies: 'Peanuts',
      medications: 'Inhaler as needed',
      blood_group: 'A+',
      fee_structure_name: 'Year 7 Standard Tuition',
      discount_percentage: '0',
      discount_reason: '',
      payment_plan: 'Termly',
      house: 'Phoenix',
      previous_school: 'Greenfield Primary',
      special_needs: '',
      languages_spoken: 'English',
      religion: 'Christian',
      ethnicity: 'White British'
    },
    {
      // Example 2: Student with single parent, sibling discount
      student_number: 'STU2024002',
      first_name: 'James',
      last_name: 'Smith',
      date_of_birth: '2011-08-22',
      gender: 'Male',
      year_group: 'Year 8',
      class_name: '8B',
      admission_date: '2024-09-01',
      student_email: '',
      student_phone: '',
      address_line1: '456 High Street',
      address_line2: '',
      city: 'Manchester',
      postcode: 'M1 1AA',
      country: 'United Kingdom',
      parent1_first_name: 'Rachel',
      parent1_last_name: 'Smith',
      parent1_email: 'r.smith@email.com',
      parent1_phone: '+44 7700 900456',
      parent1_relationship: 'Mother',
      parent1_occupation: 'Teacher',
      parent1_is_primary_contact: 'YES',
      parent2_first_name: '',
      parent2_last_name: '',
      parent2_email: '',
      parent2_phone: '',
      parent2_relationship: '',
      parent2_occupation: '',
      parent2_is_primary_contact: '',
      emergency_contact_name: 'Rachel Smith',
      emergency_contact_phone: '+44 7700 900456',
      emergency_contact_relationship: 'Mother',
      medical_conditions: '',
      allergies: '',
      medications: '',
      blood_group: 'O+',
      fee_structure_name: 'Year 8 Standard Tuition',
      discount_percentage: '10',
      discount_reason: 'Sibling Discount',
      payment_plan: 'Annual',
      house: 'Dragon',
      previous_school: 'St Mary\'s Primary',
      special_needs: '',
      languages_spoken: 'English, Spanish',
      religion: '',
      ethnicity: 'Mixed'
    },
    {
      // Example 3: Staff child with full discount
      student_number: 'STU2024003',
      first_name: 'Olivia',
      last_name: 'Brown',
      date_of_birth: '2012-03-10',
      gender: 'Female',
      year_group: 'Year 9',
      class_name: '9A',
      admission_date: '2024-09-01',
      student_email: '',
      student_phone: '',
      address_line1: '789 Park Lane',
      address_line2: '',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      country: 'United Kingdom',
      parent1_first_name: 'David',
      parent1_last_name: 'Brown',
      parent1_email: 'd.brown@school.edu',
      parent1_phone: '+44 7700 900789',
      parent1_relationship: 'Father',
      parent1_occupation: 'Mathematics Teacher',
      parent1_is_primary_contact: 'YES',
      parent2_first_name: 'Helen',
      parent2_last_name: 'Brown',
      parent2_email: 'h.brown@email.com',
      parent2_phone: '+44 7700 900790',
      parent2_relationship: 'Mother',
      parent2_occupation: 'Nurse',
      parent2_is_primary_contact: 'NO',
      emergency_contact_name: 'David Brown',
      emergency_contact_phone: '+44 7700 900789',
      emergency_contact_relationship: 'Father',
      medical_conditions: 'Type 1 Diabetes',
      allergies: 'Lactose Intolerant',
      medications: 'Insulin pump',
      blood_group: 'B+',
      fee_structure_name: 'Year 9 Standard Tuition',
      discount_percentage: '100',
      discount_reason: 'Staff Child',
      payment_plan: 'Exempt',
      house: 'Griffin',
      previous_school: 'Central Primary School',
      special_needs: 'Medical Care Plan',
      languages_spoken: 'English',
      religion: 'Hindu',
      ethnicity: 'Asian British'
    },
    {
      // Example 4: International student with guardians
      student_number: 'STU2024004',
      first_name: 'Li',
      last_name: 'Chen',
      date_of_birth: '2009-11-30',
      gender: 'Male',
      year_group: 'Year 10',
      class_name: '10C',
      admission_date: '2024-09-01',
      student_email: 'li.chen@email.com',
      student_phone: '+44 7700 900999',
      address_line1: '321 Victoria Road',
      address_line2: 'Guardian Address',
      city: 'London',
      postcode: 'W1 1AA',
      country: 'United Kingdom',
      parent1_first_name: 'Wei',
      parent1_last_name: 'Chen',
      parent1_email: 'w.chen@email.cn',
      parent1_phone: '+86 138 0000 0000',
      parent1_relationship: 'Father',
      parent1_occupation: 'Business Executive',
      parent1_is_primary_contact: 'YES',
      parent2_first_name: 'Mei',
      parent2_last_name: 'Chen',
      parent2_email: 'm.chen@email.cn',
      parent2_phone: '+86 138 0000 0001',
      parent2_relationship: 'Mother',
      parent2_occupation: 'Accountant',
      parent2_is_primary_contact: 'NO',
      emergency_contact_name: 'Mary Wilson (Guardian)',
      emergency_contact_phone: '+44 7700 901000',
      emergency_contact_relationship: 'Guardian',
      medical_conditions: '',
      allergies: '',
      medications: '',
      blood_group: 'AB+',
      fee_structure_name: 'Year 10 International Student',
      discount_percentage: '0',
      discount_reason: '',
      payment_plan: 'Annual',
      house: 'Phoenix',
      previous_school: 'Beijing International School',
      special_needs: 'EAL Support',
      languages_spoken: 'Mandarin, English',
      religion: 'Buddhist',
      ethnicity: 'Chinese'
    },
    {
      // Example 5: Student with scholarship
      student_number: 'STU2024005',
      first_name: 'Aisha',
      last_name: 'Patel',
      date_of_birth: '2010-07-18',
      gender: 'Female',
      year_group: 'Year 7',
      class_name: '7C',
      admission_date: '2024-09-01',
      student_email: '',
      student_phone: '',
      address_line1: '555 Green Lane',
      address_line2: '',
      city: 'Leicester',
      postcode: 'LE1 1AA',
      country: 'United Kingdom',
      parent1_first_name: 'Raj',
      parent1_last_name: 'Patel',
      parent1_email: 'r.patel@email.com',
      parent1_phone: '+44 7700 902000',
      parent1_relationship: 'Father',
      parent1_occupation: 'Pharmacist',
      parent1_is_primary_contact: 'YES',
      parent2_first_name: 'Priya',
      parent2_last_name: 'Patel',
      parent2_email: 'p.patel@email.com',
      parent2_phone: '+44 7700 902001',
      parent2_relationship: 'Mother',
      parent2_occupation: 'Software Developer',
      parent2_is_primary_contact: 'NO',
      emergency_contact_name: 'Raj Patel',
      emergency_contact_phone: '+44 7700 902000',
      emergency_contact_relationship: 'Father',
      medical_conditions: '',
      allergies: 'Penicillin',
      medications: '',
      blood_group: 'A-',
      fee_structure_name: 'Year 7 Standard Tuition',
      discount_percentage: '50',
      discount_reason: 'Academic Scholarship',
      payment_plan: 'Termly',
      house: 'Dragon',
      previous_school: 'Oakwood Academy',
      special_needs: 'Gifted and Talented',
      languages_spoken: 'English, Gujarati, Hindi',
      religion: 'Sikh',
      ethnicity: 'Asian British'
    }
  ];

  // Convert examples to CSV rows
  const rows = examples.map(row => 
    headers.map(header => {
      const value = row[header as keyof typeof row] || '';
      // Escape commas and quotes
      if (String(value).includes(',') || String(value).includes('"')) {
        return `"${String(value).replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

export const parseBulkImportCSV = (csvContent: string): BulkImportRow[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const rows: BulkImportRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    // Parse CSV properly handling quoted values
    for (let char of lines[i]) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row as BulkImportRow);
  }
  
  return rows;
};

export const processBulkImport = async (
  rows: BulkImportRow[],
  schoolId: string,
  onProgress: (progress: number, message: string) => void
) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[],
    createdStudents: [] as string[],
    createdParents: [] as string[],
    assignedFees: [] as string[]
  };

  const totalRows = rows.length;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const progress = Math.round(((i + 1) / totalRows) * 100);
    
    try {
      onProgress(progress, `Processing student ${i + 1} of ${totalRows}: ${row.first_name} ${row.last_name}`);
      
      // Step 1: Create or get year group
      const { data: yearGroupData } = await supabase
        .from('year_groups')
        .select('id')
        .eq('school_id', schoolId)
        .eq('year_name', row.year_group)
        .single();
      
      // Step 2: Create or get class
      const { data: classData } = await supabase
        .from('classes')
        .select('id')
        .eq('school_id', schoolId)
        .eq('class_name', row.class_name)
        .eq('year_group', row.year_group)
        .single();
      
      // Step 3: Create student profile
      const studentUserId = crypto.randomUUID();
      const { data: studentProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: studentUserId,
          email: row.student_email || `${row.student_number}@temp.school.edu`,
          first_name: row.first_name,
          last_name: row.last_name,
          phone: row.student_phone || null
        })
        .select()
        .single();
      
      if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);
      
      // Step 4: Create student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: studentUserId,
          school_id: schoolId,
          student_number: row.student_number,
          year_group: row.year_group,
          form_class: row.class_name,
          admission_date: row.admission_date,
          date_of_birth: row.date_of_birth,
          emergency_contact_name: row.emergency_contact_name,
          emergency_contact_phone: row.emergency_contact_phone,
          medical_notes: [row.medical_conditions, row.allergies, row.medications, row.blood_group]
            .filter(Boolean)
            .join('; '),
          safeguarding_notes: row.special_needs || null,
          is_enrolled: true
        })
        .select()
        .single();
      
      if (studentError) throw new Error(`Student creation failed: ${studentError.message}`);
      
      results.createdStudents.push(`${row.first_name} ${row.last_name} (${row.student_number})`);
      
      // Step 5: Create parent 1
      if (row.parent1_email) {
        const parent1UserId = crypto.randomUUID();
        await supabase.from('profiles').insert({
          user_id: parent1UserId,
          email: row.parent1_email,
          first_name: row.parent1_first_name,
          last_name: row.parent1_last_name,
          phone: row.parent1_phone
        });
        
        await supabase.from('user_roles').insert({
          user_id: parent1UserId,
          role: 'parent',
          school_id: schoolId
        });
        
        await supabase.from('student_parents').insert({
          student_id: student.id,
          parent_id: parent1UserId,
          relationship: row.parent1_relationship,
          is_primary: row.parent1_is_primary_contact?.toUpperCase() === 'YES'
        });
        
        results.createdParents.push(`${row.parent1_first_name} ${row.parent1_last_name}`);
      }
      
      // Step 6: Create parent 2 (if exists)
      if (row.parent2_email) {
        const parent2UserId = crypto.randomUUID();
        await supabase.from('profiles').insert({
          user_id: parent2UserId,
          email: row.parent2_email,
          first_name: row.parent2_first_name,
          last_name: row.parent2_last_name,
          phone: row.parent2_phone
        });
        
        await supabase.from('user_roles').insert({
          user_id: parent2UserId,
          role: 'parent',
          school_id: schoolId
        });
        
        await supabase.from('student_parents').insert({
          student_id: student.id,
          parent_id: parent2UserId,
          relationship: row.parent2_relationship,
          is_primary: row.parent2_is_primary_contact?.toUpperCase() === 'YES'
        });
        
        results.createdParents.push(`${row.parent2_first_name} ${row.parent2_last_name}`);
      }
      
      // Step 7: Assign fees
      if (row.fee_structure_name) {
        const { data: feeStructure } = await supabase
          .from('fee_structures')
          .select('id, total_amount')
          .eq('school_id', schoolId)
          .ilike('name', row.fee_structure_name)
          .single();
        
        if (feeStructure) {
          const discountPercent = parseFloat(row.discount_percentage || '0');
          const finalAmount = feeStructure.total_amount * (1 - discountPercent / 100);
          
          // Calculate due date (e.g., 30 days from now)
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);
          
          await supabase.from('student_fee_assignments').insert({
            student_id: student.id,
            fee_structure_id: feeStructure.id,
            school_id: schoolId,
            amount_due: finalAmount,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pending',
            year_group: row.year_group,
            class_name: row.class_name
          });
          
          results.assignedFees.push(`${row.fee_structure_name} to ${row.first_name} ${row.last_name}`);
        }
      }
      
      results.successful++;
      
    } catch (error: any) {
      results.failed++;
      results.errors.push(`Row ${i + 1} (${row.student_number}): ${error.message}`);
      console.error(`Error processing row ${i + 1}:`, error);
    }
  }
  
  return results;
};

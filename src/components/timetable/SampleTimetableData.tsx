import { supabase } from '@/integrations/supabase/client';

// Sample data for "10A" class to help with testing
export const createSampleTimetableData = async (schoolId: string) => {
  try {
    console.log('Creating sample timetable data for school:', schoolId);

    // First, ensure we have basic setup data
    // Create sample periods if they don't exist
    const { data: existingPeriods } = await supabase
      .from('school_periods')
      .select('*')
      .eq('school_id', schoolId)
      .limit(1);

    if (!existingPeriods || existingPeriods.length === 0) {
      const samplePeriods = [
        { period_name: 'Period 1', period_number: 1, start_time: '08:30', end_time: '09:20', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Break', period_number: 2, start_time: '09:20', end_time: '09:40', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Period 2', period_number: 3, start_time: '09:40', end_time: '10:30', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Period 3', period_number: 4, start_time: '10:30', end_time: '11:20', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Lunch', period_number: 5, start_time: '11:20', end_time: '12:20', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Period 4', period_number: 6, start_time: '12:20', end_time: '13:10', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Period 5', period_number: 7, start_time: '13:10', end_time: '14:00', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true },
        { period_name: 'Period 6', period_number: 8, start_time: '14:00', end_time: '14:50', days_of_week: [1,2,3,4,5], school_id: schoolId, is_active: true }
      ];

      for (const period of samplePeriods) {
        await supabase
          .from('school_periods')
          .insert(period);
      }
      console.log('Sample periods created');
    }

    // Create sample subjects if they don't exist
    const { data: existingSubjects } = await supabase
      .from('subjects')
      .select('*')
      .eq('school_id', schoolId)
      .limit(1);

    if (!existingSubjects || existingSubjects.length === 0) {
      const sampleSubjects = [
        { subject_name: 'Mathematics', subject_code: 'MATH', color_code: '#3B82F6', school_id: schoolId },
        { subject_name: 'English', subject_code: 'ENG', color_code: '#10B981', school_id: schoolId },
        { subject_name: 'Science', subject_code: 'SCI', color_code: '#F59E0B', school_id: schoolId },
        { subject_name: 'History', subject_code: 'HIST', color_code: '#EF4444', school_id: schoolId },
        { subject_name: 'Geography', subject_code: 'GEO', color_code: '#8B5CF6', school_id: schoolId },
        { subject_name: 'Art', subject_code: 'ART', color_code: '#EC4899', school_id: schoolId },
        { subject_name: 'Physical Education', subject_code: 'PE', color_code: '#06B6D4', school_id: schoolId }
      ];

      for (const subject of sampleSubjects) {
        await supabase
          .from('subjects')
          .insert(subject);
      }
      console.log('Sample subjects created');
    }

    // Create sample classrooms if they don't exist
    const { data: existingClassrooms } = await supabase
      .from('classrooms')
      .select('*')
      .eq('school_id', schoolId)
      .limit(1);

    if (!existingClassrooms || existingClassrooms.length === 0) {
      const sampleClassrooms = [
        { room_name: 'Room 101', room_type: 'classroom', capacity: 30, school_id: schoolId },
        { room_name: 'Room 102', room_type: 'classroom', capacity: 30, school_id: schoolId },
        { room_name: 'Science Lab 1', room_type: 'laboratory', capacity: 25, school_id: schoolId },
        { room_name: 'Art Studio', room_type: 'studio', capacity: 20, school_id: schoolId },
        { room_name: 'Gymnasium', room_type: 'gym', capacity: 60, school_id: schoolId },
        { room_name: 'Room 201', room_type: 'classroom', capacity: 30, school_id: schoolId },
        { room_name: 'Room 202', room_type: 'classroom', capacity: 30, school_id: schoolId }
      ];

      for (const classroom of sampleClassrooms) {
        await supabase
          .from('classrooms')
          .insert(classroom);
      }
      console.log('Sample classrooms created');
    }

    // Create sample classes if they don't exist
    const { data: existingClasses } = await supabase
      .from('classes')
      .select('*')
      .eq('school_id', schoolId)
      .eq('class_name', '10A')
      .limit(1);

    if (!existingClasses || existingClasses.length === 0) {
      const sampleClasses = [
        { class_name: '10A', year_group: 'Year 10', form_teacher: 'John Smith', max_capacity: 30, school_id: schoolId, is_active: true },
        { class_name: '10B', year_group: 'Year 10', form_teacher: 'Sarah Wilson', max_capacity: 30, school_id: schoolId, is_active: true },
        { class_name: '9A', year_group: 'Year 9', form_teacher: 'Mike Johnson', max_capacity: 28, school_id: schoolId, is_active: true },
        { class_name: '9B', year_group: 'Year 9', form_teacher: 'Emma Davis', max_capacity: 28, school_id: schoolId, is_active: true }
      ];

      for (const classData of sampleClasses) {
        await supabase
          .from('classes')
          .insert(classData);
      }
      console.log('Sample classes created');
    }

    return true;

  } catch (error) {
    console.error('Error creating sample timetable data:', error);
    return false;
  }
};

export const ensureSampleDataExists = async (schoolId: string) => {
  try {
    // Quick check if we have basic timetable data
    const { data: timetableCheck } = await supabase
      .from('timetable_entries')
      .select('id')
      .eq('school_id', schoolId)
      .limit(1);

    if (!timetableCheck || timetableCheck.length === 0) {
      console.log('No timetable data found, creating sample data...');
      return await createSampleTimetableData(schoolId);
    }
    
    return true;
  } catch (error) {
    console.error('Error checking for sample data:', error);
    return false;
  }
};
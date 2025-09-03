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
        { period_name: 'Period 1', start_time: '08:30', end_time: '09:20', is_break: false, day_order: 1 },
        { period_name: 'Break', start_time: '09:20', end_time: '09:40', is_break: true, day_order: 2 },
        { period_name: 'Period 2', start_time: '09:40', end_time: '10:30', is_break: false, day_order: 3 },
        { period_name: 'Period 3', start_time: '10:30', end_time: '11:20', is_break: false, day_order: 4 },
        { period_name: 'Lunch', start_time: '11:20', end_time: '12:20', is_break: true, day_order: 5 },
        { period_name: 'Period 4', start_time: '12:20', end_time: '13:10', is_break: false, day_order: 6 },
        { period_name: 'Period 5', start_time: '13:10', end_time: '14:00', is_break: false, day_order: 7 },
        { period_name: 'Period 6', start_time: '14:00', end_time: '14:50', is_break: false, day_order: 8 }
      ];

      for (const period of samplePeriods) {
        await supabase
          .from('school_periods')
          .insert({
            ...period,
            school_id: schoolId
          });
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
        { subject_name: 'Mathematics', subject_code: 'MATH', color_code: '#3B82F6' },
        { subject_name: 'English', subject_code: 'ENG', color_code: '#10B981' },
        { subject_name: 'Science', subject_code: 'SCI', color_code: '#F59E0B' },
        { subject_name: 'History', subject_code: 'HIST', color_code: '#EF4444' },
        { subject_name: 'Geography', subject_code: 'GEO', color_code: '#8B5CF6' },
        { subject_name: 'Art', subject_code: 'ART', color_code: '#EC4899' },
        { subject_name: 'Physical Education', subject_code: 'PE', color_code: '#06B6D4' }
      ];

      for (const subject of sampleSubjects) {
        await supabase
          .from('subjects')
          .insert({
            ...subject,
            school_id: schoolId
          });
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
        { room_name: 'Room 101', room_type: 'classroom', capacity: 30 },
        { room_name: 'Room 102', room_type: 'classroom', capacity: 30 },
        { room_name: 'Science Lab 1', room_type: 'laboratory', capacity: 25 },
        { room_name: 'Art Studio', room_type: 'studio', capacity: 20 },
        { room_name: 'Gymnasium', room_type: 'gym', capacity: 60 },
        { room_name: 'Room 201', room_type: 'classroom', capacity: 30 },
        { room_name: 'Room 202', room_type: 'classroom', capacity: 30 }
      ];

      for (const classroom of sampleClassrooms) {
        await supabase
          .from('classrooms')
          .insert({
            ...classroom,
            school_id: schoolId
          });
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
        { class_name: '10A', year_group: 'Year 10', form_teacher: 'John Smith', max_capacity: 30 },
        { class_name: '10B', year_group: 'Year 10', form_teacher: 'Sarah Wilson', max_capacity: 30 },
        { class_name: '9A', year_group: 'Year 9', form_teacher: 'Mike Johnson', max_capacity: 28 },
        { class_name: '9B', year_group: 'Year 9', form_teacher: 'Emma Davis', max_capacity: 28 }
      ];

      for (const classData of sampleClasses) {
        await supabase
          .from('classes')
          .insert({
            ...classData,
            school_id: schoolId,
            is_active: true
          });
      }
      console.log('Sample classes created');
    }

    // Now create some sample timetable entries for 10A
    const { data: periods } = await supabase
      .from('school_periods')
      .select('id, period_name')
      .eq('school_id', schoolId)
      .eq('is_break', false)
      .limit(6);

    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, subject_name')
      .eq('school_id', schoolId)
      .limit(6);

    const { data: classrooms } = await supabase
      .from('classrooms')
      .select('id, room_name')
      .eq('school_id', schoolId)
      .limit(6);

    if (periods && subjects && classrooms && periods.length > 0) {
      // Check if 10A already has timetable entries
      const { data: existingEntries } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('school_id', schoolId)
        .eq('class_id', '10A')
        .limit(1);

      if (!existingEntries || existingEntries.length === 0) {
        // Create a simple weekly timetable for 10A
        const sampleTimetableEntries = [];
        const days = [1, 2, 3, 4, 5]; // Monday to Friday
        
        for (let day = 0; day < days.length; day++) {
          for (let periodIndex = 0; periodIndex < Math.min(periods.length, 4); periodIndex++) {
            const period = periods[periodIndex];
            const subject = subjects[periodIndex % subjects.length];
            const classroom = classrooms[periodIndex % classrooms.length];
            
            sampleTimetableEntries.push({
              school_id: schoolId,
              class_id: '10A',
              period_id: period.id,
              subject_id: subject.id,
              subject_name: subject.subject_name,
              classroom_id: classroom.id,
              room_name: classroom.room_name,
              teacher_id: 'sample-teacher-id',
              teacher_name: 'Sample Teacher',
              day_of_week: days[day],
              is_active: true
            });
          }
        }

        // Insert the timetable entries
        for (const entry of sampleTimetableEntries) {
          await supabase
            .from('timetable_entries')
            .insert(entry);
        }
        
        console.log(`Created ${sampleTimetableEntries.length} sample timetable entries for 10A`);
        return true;
      } else {
        console.log('Timetable entries for 10A already exist');
        return true;
      }
    } else {
      console.log('Missing required data (periods, subjects, or classrooms) to create timetable entries');
      return false;
    }

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
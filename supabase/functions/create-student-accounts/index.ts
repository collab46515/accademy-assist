import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
  student_number: string;
  year_group: string;
  form_class?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  phone?: string;
  password?: string;
}

interface ParentData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  relationship: string;
  password?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { student_data, parent_data, school_id, application_id } = await req.json()

    // Generate unique student user ID
    const newStudentUserId = crypto.randomUUID()

    // Insert student profile
    const { error: studentProfileError } = await supabaseClient
      .from('profiles')
      .insert({
        user_id: newStudentUserId,
        email: student_data.email,
        first_name: student_data.first_name,
        last_name: student_data.last_name,
        phone: student_data.phone,
        must_change_password: true
      })

    if (studentProfileError) throw studentProfileError

    // Insert student record
    const { data: studentRecord, error: studentError } = await supabaseClient
      .from('students')
      .insert({
        user_id: newStudentUserId,
        school_id: school_id,
        student_number: student_data.student_number,
        year_group: student_data.year_group,
        form_class: student_data.form_class,
        date_of_birth: student_data.date_of_birth,
        admission_date: new Date().toISOString().split('T')[0],
        emergency_contact_name: student_data.emergency_contact_name,
        emergency_contact_phone: student_data.emergency_contact_phone,
        medical_notes: student_data.medical_notes
      })
      .select()
      .single()

    if (studentError) throw studentError

    // Create student user role
    const { error: studentRoleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: newStudentUserId,
        school_id: school_id,
        role: 'student'
      })

    if (studentRoleError) throw studentRoleError

    let newParentUserId = null

    // Create parent account if parent data provided
    if (parent_data?.email) {
      newParentUserId = crypto.randomUUID()

      // Insert parent profile
      const { error: parentProfileError } = await supabaseClient
        .from('profiles')
        .insert({
          user_id: newParentUserId,
          email: parent_data.email,
          first_name: parent_data.first_name,
          last_name: parent_data.last_name,
          phone: parent_data.phone,
          must_change_password: true
        })

      if (parentProfileError) throw parentProfileError

      // Create parent user role
      const { error: parentRoleError } = await supabaseClient
        .from('user_roles')
        .insert({
          user_id: newParentUserId,
          school_id: school_id,
          role: 'parent'
        })

      if (parentRoleError) throw parentRoleError

      // Link parent to student
      const { error: linkError } = await supabaseClient
        .from('student_parents')
        .insert({
          student_id: studentRecord.id,
          parent_id: newParentUserId,
          relationship: parent_data.relationship
        })

      if (linkError) throw linkError
    }

    // Update application status if provided
    if (application_id) {
      await supabaseClient
        .from('enrollment_applications')
        .update({
          status: 'enrolled',
          updated_at: new Date().toISOString(),
          additional_data: {
            enrollment_completed_at: new Date().toISOString(),
            student_record_id: studentRecord.id,
            student_user_id: newStudentUserId,
            parent_user_id: newParentUserId,
            credentials_generated: true
          }
        })
        .eq('id', application_id)
    }

    return new Response(
      JSON.stringify({
        success: true,
        student_record_id: studentRecord.id,
        student_user_id: newStudentUserId,
        student_email: student_data.email,
        student_temp_password: student_data.password,
        student_number: student_data.student_number,
        parent_user_id: newParentUserId,
        parent_email: parent_data?.email,
        parent_temp_password: parent_data?.password,
        enrollment_complete: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error creating student accounts:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
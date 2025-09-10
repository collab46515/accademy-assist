import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAccountsRequest {
  student_data: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    password: string;
    student_number?: string;
    year_group: string;
    form_class?: string;
    date_of_birth?: string;
    admission_date?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    medical_notes?: string;
  };
  parent_data?: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    password: string;
    relationship?: string;
  };
  school_id: string;
  application_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { student_data, parent_data, school_id, application_id }: CreateAccountsRequest = await req.json();

    console.log("Creating student accounts for:", student_data.email);

    // Create admin Supabase client for user creation
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create student auth user
    console.log("Creating student auth user...");
    const { data: studentUser, error: studentAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: student_data.email,
      password: student_data.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: student_data.first_name,
        last_name: student_data.last_name,
        role: 'student'
      }
    });

    if (studentAuthError) {
      console.error("Error creating student auth user:", studentAuthError);
      throw new Error(`Failed to create student auth user: ${studentAuthError.message}`);
    }

    console.log("Student auth user created:", studentUser.user.id);

    // Create parent auth user if provided
    let parentUser = null;
    if (parent_data && parent_data.email) {
      console.log("Creating parent auth user...");
      const { data: parentUserData, error: parentAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: parent_data.email,
        password: parent_data.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: parent_data.first_name,
          last_name: parent_data.last_name,
          role: 'parent'
        }
      });

      if (parentAuthError) {
        console.error("Error creating parent auth user:", parentAuthError);
        // Don't fail the entire process if parent creation fails
        console.warn("Continuing without parent account...");
      } else {
        parentUser = parentUserData.user;
        console.log("Parent auth user created:", parentUser.id);
      }
    }

    // Generate unique student number if not provided
    let studentNumber = student_data.student_number;
    if (!studentNumber) {
      const { count } = await supabaseAdmin
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', school_id);
      
      studentNumber = `STU${String((count || 0) + 1).padStart(4, '0')}`;
    }

    // Create or update student profile (idempotent)
    console.log("Creating profile records...");
    const { error: studentProfileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: studentUser.user.id,
        email: student_data.email,
        first_name: student_data.first_name,
        last_name: student_data.last_name,
        phone: student_data.phone,
        must_change_password: true
      }, { onConflict: 'user_id' });

    if (studentProfileError) {
      console.error("Error creating/updating student profile:", studentProfileError);
      throw new Error(`Failed to upsert student profile: ${studentProfileError.message}`);
    }

    if (parentUser) {
      const { error: parentProfileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          user_id: parentUser.id,
          email: parent_data!.email,
          first_name: parent_data!.first_name,
          last_name: parent_data!.last_name,
          phone: parent_data!.phone,
          must_change_password: true
        }, { onConflict: 'user_id' });

      if (parentProfileError) {
        console.error("Error creating/updating parent profile:", parentProfileError);
        // Continue without failing
      }
    }

    // Create student record
    console.log("Creating student record...");
    const { data: studentRecord, error: studentRecordError } = await supabaseAdmin
      .from('students')
      .insert({
        user_id: studentUser.user.id,
        school_id: school_id,
        student_number: studentNumber,
        year_group: student_data.year_group,
        form_class: student_data.form_class,
        date_of_birth: student_data.date_of_birth,
        admission_date: student_data.admission_date || new Date().toISOString().split('T')[0],
        emergency_contact_name: student_data.emergency_contact_name,
        emergency_contact_phone: student_data.emergency_contact_phone,
        medical_notes: student_data.medical_notes
      })
      .select()
      .single();

    if (studentRecordError) {
      console.error("Error creating student record:", studentRecordError);
      throw new Error(`Failed to create student record: ${studentRecordError.message}`);
    }

    // Create user roles
    console.log("Creating user roles...");
    const { error: studentRoleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: studentUser.user.id,
        school_id: school_id,
        role: 'student',
        is_active: true
      });

    if (studentRoleError) {
      console.error("Error creating student role:", studentRoleError);
    }

    if (parentUser) {
      const { error: parentRoleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: parentUser.id,
          school_id: school_id,
          role: 'parent',
          is_active: true
        });

      if (parentRoleError) {
        console.error("Error creating parent role:", parentRoleError);
      }

      // Link parent to student
      const { error: linkError } = await supabaseAdmin
        .from('student_parents')
        .insert({
          student_id: studentRecord.id,
          parent_id: parentUser.id,
          relationship: parent_data!.relationship || 'Parent'
        });

      if (linkError) {
        console.error("Error linking parent to student:", linkError);
      }
    }

    // Update the application status
    console.log("Updating application status...");
    const { error: updateError } = await supabaseAdmin
      .from('enrollment_applications')
      .update({
        status: 'enrolled',
        updated_at: new Date().toISOString(),
        additional_data: {
          enrollment_completed_at: new Date().toISOString(),
          student_record_id: studentRecord.id,
          student_user_id: studentUser.user.id,
          parent_user_id: parentUser?.id,
          credentials_generated: true
        }
      })
      .eq('id', application_id);

    if (updateError) {
      console.error("Error updating application:", updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      student_record_id: studentRecord.id,
      student_user_id: studentUser.user.id,
      student_email: student_data.email,
      student_temp_password: student_data.password,
      student_number: studentNumber,
      parent_user_id: parentUser?.id,
      parent_email: parent_data?.email,
      parent_temp_password: parent_data?.password,
      enrollment_complete: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in create-student-accounts function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
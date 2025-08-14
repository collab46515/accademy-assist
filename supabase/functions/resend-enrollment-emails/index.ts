import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting batch resend of enrollment emails...");

    // Get all enrolled applications
    const { data: enrolledApplications, error: queryError } = await supabase
      .from('enrollment_applications')
      .select(`
        id,
        application_number,
        student_name,
        year_group,
        additional_data
      `)
      .eq('status', 'enrolled')
      .not('additional_data', 'is', null);

    if (queryError) {
      throw new Error(`Database query failed: ${queryError.message}`);
    }

    if (!enrolledApplications || enrolledApplications.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No enrolled students found",
        emailsSent: 0 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${enrolledApplications.length} enrolled students`);

    const emailResults = [];
    let successCount = 0;
    let failureCount = 0;

    // Process each enrolled application
    for (const application of enrolledApplications) {
      try {
        const additionalData = application.additional_data || {};
        const pathwayData = additionalData.pathway_data || {};
        
        // Extract student data
        const studentData = {
          email: pathwayData.student_email,
          name: pathwayData.student_name || application.student_name,
          studentNumber: `STU${application.id.slice(0, 4).toUpperCase()}`,
          yearGroup: pathwayData.year_group || application.year_group,
          tempPassword: "Student123!" // Default password as per enrollment function
        };

        // Extract parent data (if available)
        let parentData = null;
        if (pathwayData.parent_email) {
          parentData = {
            email: pathwayData.parent_email,
            name: pathwayData.parent_name,
            tempPassword: "Parent123!", // Default password as per enrollment function
            relationship: pathwayData.parent_relationship || "Parent"
          };
        }

        // Skip if no student email
        if (!studentData.email) {
          console.log(`Skipping ${application.application_number}: No student email found`);
          emailResults.push({
            applicationNumber: application.application_number,
            success: false,
            error: "No student email found"
          });
          failureCount++;
          continue;
        }

        console.log(`Sending emails for ${application.application_number} (${studentData.name})`);

        // Call the send-enrollment-emails function
        const emailPayload = {
          studentData,
          parentData,
          schoolName: "Pappaya Academy"
        };

        const { data: emailResult, error: emailError } = await supabase.functions.invoke(
          'send-enrollment-emails',
          {
            body: emailPayload
          }
        );

        if (emailError) {
          console.error(`Email sending failed for ${application.application_number}:`, emailError);
          emailResults.push({
            applicationNumber: application.application_number,
            studentName: studentData.name,
            success: false,
            error: emailError.message
          });
          failureCount++;
        } else {
          console.log(`Emails sent successfully for ${application.application_number}`);
          emailResults.push({
            applicationNumber: application.application_number,
            studentName: studentData.name,
            success: true,
            emailsSent: emailResult?.emailsSent || 1
          });
          successCount++;
        }

        // Add a small delay between requests to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        console.error(`Error processing ${application.application_number}:`, error);
        emailResults.push({
          applicationNumber: application.application_number,
          success: false,
          error: error.message
        });
        failureCount++;
      }
    }

    const summary = {
      success: true,
      totalApplications: enrolledApplications.length,
      successCount,
      failureCount,
      results: emailResults
    };

    console.log("Batch email resend completed:", {
      total: enrolledApplications.length,
      successful: successCount,
      failed: failureCount
    });

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in resend-enrollment-emails function:", error);
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
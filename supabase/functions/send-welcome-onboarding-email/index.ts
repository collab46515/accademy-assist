import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  applicationId: string;
  studentName: string;
  yearGroup: string;
  parentEmail: string;
  schoolData: {
    name: string;
    reopeningDate: string;
    reportingTime: string;
    uniformBooksDetails: string;
    teacherContact: string;
    academicYear: string;
  };
  loginCredentials?: string;
  photoCount?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      applicationId, 
      studentName, 
      yearGroup, 
      parentEmail,
      schoolData,
      loginCredentials = "Will be shared via separate email",
      photoCount = "4"
    }: WelcomeEmailRequest = await req.json();

    // Fetch the template
    const { data: template, error: templateError } = await supabase
      .from("communication_templates")
      .select("*")
      .eq("template_name", "Welcome and Onboarding")
      .eq("is_active", true)
      .single();

    if (templateError || !template) {
      console.error("Template not found:", templateError);
      throw new Error("Welcome and Onboarding template not found");
    }

    // Replace placeholders in the template
    let emailContent = template.content_template
      .replace(/\{\{student_name\}\}/g, studentName)
      .replace(/\{\{year_group\}\}/g, yearGroup)
      .replace(/\{\{school_name\}\}/g, schoolData.name)
      .replace(/\{\{academic_year\}\}/g, schoolData.academicYear)
      .replace(/\{\{reopening_date\}\}/g, schoolData.reopeningDate)
      .replace(/\{\{reporting_time\}\}/g, schoolData.reportingTime)
      .replace(/\{\{uniform_books_details\}\}/g, schoolData.uniformBooksDetails)
      .replace(/\{\{teacher_contact\}\}/g, schoolData.teacherContact)
      .replace(/\{\{login_credentials\}\}/g, loginCredentials)
      .replace(/\{\{photo_count\}\}/g, photoCount);

    let emailSubject = template.subject_template
      .replace(/\{\{student_name\}\}/g, studentName)
      .replace(/\{\{school_name\}\}/g, schoolData.name);

    // Convert markdown-style formatting to HTML
    emailContent = emailContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${schoolData.name} Admissions <onboarding@resend.dev>`,
      to: [parentEmail],
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${emailContent}
        </div>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }

    // Log the communication in the database
    await supabase.from("communications").insert({
      school_id: template.school_id,
      title: emailSubject,
      content: emailContent,
      communication_type: "email",
      audience_type: "parents",
      priority: "high",
      status: "sent",
      sent_at: new Date().toISOString(),
      created_by: template.created_by,
      metadata: {
        application_id: applicationId,
        template_used: template.id,
        email_id: emailData?.id,
      },
    });

    console.log("Welcome onboarding email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome onboarding email sent successfully",
        emailId: emailData?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-onboarding-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
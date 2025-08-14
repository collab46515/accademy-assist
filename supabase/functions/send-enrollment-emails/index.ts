import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentEmailRequest {
  studentData: {
    email: string;
    name: string;
    studentNumber: string;
    yearGroup: string;
    tempPassword: string;
  };
  parentData?: {
    email: string;
    name: string;
    tempPassword: string;
    relationship: string;
  };
  schoolName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentData, parentData, schoolName }: EnrollmentEmailRequest = await req.json();

    console.log("Sending enrollment emails for student:", studentData.name);

    const emails = [];

    // Student welcome email
    const studentEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to ${schoolName}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your enrollment is complete</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${studentData.name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Congratulations! Your enrollment at ${schoolName} has been successfully processed. 
            You can now access your student portal with the login credentials below.
          </p>
          
          <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Login Credentials</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${studentData.email}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #f1f3f4; padding: 2px 6px; border-radius: 4px;">${studentData.tempPassword}</code></p>
            <p style="margin: 5px 0;"><strong>Student Number:</strong> ${studentData.studentNumber}</p>
            <p style="margin: 5px 0;"><strong>Year Group:</strong> ${studentData.yearGroup}</p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>🔒 Security Notice:</strong> You will be required to change your password upon first login for security purposes.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || '#'}" 
               style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Access Student Portal
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions or need assistance, please don't hesitate to contact our admissions office.
          </p>
          
          <p style="color: #666; margin-bottom: 0;">
            Welcome to the ${schoolName} family!<br>
            <strong>The Admissions Team</strong>
          </p>
        </div>
      </div>
    `;

    emails.push({
      from: `${schoolName} Admissions <admissions@pappaya.academy>`,
      to: [studentData.email],
      subject: `Welcome to ${schoolName} - Your Student Portal Access`,
      html: studentEmailHtml,
    });

    // Parent welcome email (if parent data provided)
    if (parentData && parentData.email) {
      const parentEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Parent Portal Access</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${schoolName}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Dear ${parentData.name},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Your child, <strong>${studentData.name}</strong>, has been successfully enrolled at ${schoolName}. 
              You now have access to the Parent Portal to monitor their academic progress.
            </p>
            
            <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Parent Portal Access</h3>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${parentData.email}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #f1f3f4; padding: 2px 6px; border-radius: 4px;">${parentData.tempPassword}</code></p>
              <p style="margin: 5px 0;"><strong>Child:</strong> ${studentData.name} (${studentData.studentNumber})</p>
              <p style="margin: 5px 0;"><strong>Year Group:</strong> ${studentData.yearGroup}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>🔒 Security Notice:</strong> You will be required to change your password upon first login for security purposes.
              </p>
            </div>
            
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #0c5460; margin-top: 0;">Through the Parent Portal, you can:</h4>
              <ul style="color: #0c5460; margin: 0;">
                <li>View your child's attendance records</li>
                <li>Monitor academic progress and grades</li>
                <li>Communicate with teachers</li>
                <li>Access school announcements</li>
                <li>Manage fee payments</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || '#'}" 
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Access Parent Portal
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any questions about using the Parent Portal, please contact our school office.
            </p>
            
            <p style="color: #666; margin-bottom: 0;">
              Thank you for choosing ${schoolName}!<br>
              <strong>The School Administration</strong>
            </p>
          </div>
        </div>
      `;

      emails.push({
        from: `${schoolName} <admissions@pappaya.academy>`,
        to: [parentData.email],
        subject: `Parent Portal Access - ${studentData.name} at ${schoolName}`,
        html: parentEmailHtml,
      });
    }

    // Send all emails
    const results = [];
    for (const email of emails) {
      try {
        const result = await resend.emails.send(email);
        results.push({ success: true, result, recipient: email.to[0] });
        console.log(`Email sent successfully to ${email.to[0]}:`, result);
      } catch (error) {
        console.error(`Failed to send email to ${email.to[0]}:`, error);
        results.push({ success: false, error: error.message, recipient: email.to[0] });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent: results.filter(r => r.success).length,
      totalEmails: results.length,
      results 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-enrollment-emails function:", error);
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
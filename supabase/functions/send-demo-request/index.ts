import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoRequestData {
  name: string;
  email: string;
  phone?: string;
  schoolName: string;
  role: string;
  studentCount?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: DemoRequestData = await req.json();

    // Format the demo request details
    const demoRequestDetails = `
      <h2>New Demo Request from Pappaya Academy Website</h2>
      
      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${formData.name}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
        ${formData.phone ? `<li><strong>Phone:</strong> ${formData.phone}</li>` : ''}
        <li><strong>Role:</strong> ${formData.role}</li>
      </ul>

      <h3>School Information:</h3>
      <ul>
        <li><strong>School Name:</strong> ${formData.schoolName}</li>
        ${formData.studentCount ? `<li><strong>Student Count:</strong> ${formData.studentCount}</li>` : ''}
      </ul>

      ${formData.preferredDate || formData.preferredTime ? `
      <h3>Preferred Schedule:</h3>
      <ul>
        ${formData.preferredDate ? `<li><strong>Preferred Date:</strong> ${formData.preferredDate}</li>` : ''}
        ${formData.preferredTime ? `<li><strong>Preferred Time:</strong> ${formData.preferredTime}</li>` : ''}
      </ul>
      ` : ''}

      ${formData.message ? `
      <h3>Additional Message:</h3>
      <p>${formData.message}</p>
      ` : ''}

      <hr>
      <p><em>This demo request was submitted through the Pappaya Academy website.</em></p>
    `;

    // Send email to the business
    const businessEmailResponse = await resend.emails.send({
      from: "Pappaya Academy <onboarding@resend.dev>",
      to: ["dominic@dexra.cloud"],
      subject: `Demo Request from ${formData.name} - ${formData.schoolName}`,
      html: demoRequestDetails,
    });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Pappaya Academy <onboarding@resend.dev>",
      to: [formData.email],
      subject: "Thank you for requesting a demo - Pappaya Academy",
      html: `
        <h1>Thank you for your demo request, ${formData.name}!</h1>
        
        <p>We have received your request for a personalized demonstration of Pappaya Academy.</p>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your requirements</li>
          <li>We'll contact you within 24 hours to schedule your demo</li>
          <li>We'll prepare a customized demonstration based on your school's needs</li>
        </ul>

        <h3>Your Request Details:</h3>
        <ul>
          <li><strong>School:</strong> ${formData.schoolName}</li>
          <li><strong>Your Role:</strong> ${formData.role}</li>
          ${formData.preferredDate ? `<li><strong>Preferred Date:</strong> ${formData.preferredDate}</li>` : ''}
          ${formData.preferredTime ? `<li><strong>Preferred Time:</strong> ${formData.preferredTime}</li>` : ''}
        </ul>

        <p>If you have any immediate questions, feel free to reply to this email.</p>
        
        <p>Best regards,<br>
        The Pappaya Academy Team</p>

        <hr>
        <p style="font-size: 12px; color: #666;">
          Pappaya Academy - Complete School Management System<br>
          Transforming education through innovative technology solutions.
        </p>
      `,
    });

    console.log("Demo request emails sent successfully:", { businessEmailResponse, userEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Demo request sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-demo-request function:", error);
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
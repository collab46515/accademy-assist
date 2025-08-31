import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequestData {
  name: string;
  email: string;
  phone?: string;
  schoolName?: string;
  role: string;
  studentCount?: string;
  enquiryType: string;
  preferredDate?: string;
  preferredTime?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactRequestData = await req.json();

    // Format the contact request details
    const contactRequestDetails = `
      <h2>New Contact Request from Doxa Academy Website</h2>
      
      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${formData.name}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
        ${formData.phone ? `<li><strong>Phone:</strong> ${formData.phone}</li>` : ''}
        <li><strong>Role:</strong> ${formData.role}</li>
        <li><strong>Enquiry Type:</strong> ${formData.enquiryType}</li>
      </ul>

      ${formData.schoolName || formData.studentCount ? `
      <h3>School Information:</h3>
      <ul>
        ${formData.schoolName ? `<li><strong>School Name:</strong> ${formData.schoolName}</li>` : ''}
        ${formData.studentCount ? `<li><strong>Student Count:</strong> ${formData.studentCount}</li>` : ''}
      </ul>
      ` : ''}

      ${formData.preferredDate || formData.preferredTime ? `
      <h3>Preferred Schedule:</h3>
      <ul>
        ${formData.preferredDate ? `<li><strong>Preferred Date:</strong> ${formData.preferredDate}</li>` : ''}
        ${formData.preferredTime ? `<li><strong>Preferred Time:</strong> ${formData.preferredTime}</li>` : ''}
      </ul>
      ` : ''}

      <h3>Message:</h3>
      <p>${formData.message}</p>

      <hr>
      <p><em>This enquiry was submitted through the Doxa Academy website.</em></p>
    `;

    // Determine subject based on enquiry type
    const getSubjectLine = (enquiryType: string, name: string, schoolName?: string) => {
      const school = schoolName ? ` - ${schoolName}` : '';
      switch (enquiryType) {
        case 'demo':
          return `Demo Request from ${name}${school}`;
        case 'support':
          return `Support Request from ${name}${school}`;
        case 'pricing':
          return `Pricing Enquiry from ${name}${school}`;
        case 'partnership':
          return `Partnership Enquiry from ${name}${school}`;
        case 'feedback':
          return `Feedback from ${name}${school}`;
        default:
          return `General Enquiry from ${name}${school}`;
      }
    };

    // Send email to the business
    const businessEmailResponse = await resend.emails.send({
      from: "Doxa Academy <onboarding@resend.dev>",
      to: ["dominic@dexra.cloud"],
      subject: getSubjectLine(formData.enquiryType, formData.name, formData.schoolName),
      html: contactRequestDetails,
    });

    // Send confirmation email to the user
    const getConfirmationMessage = (enquiryType: string) => {
      switch (enquiryType) {
        case 'demo':
          return 'We have received your demo request and will contact you within 24 hours to schedule your personalized demonstration.';
        case 'support':
          return 'We have received your support request and our technical team will respond within 24 hours.';
        case 'pricing':
          return 'We have received your pricing enquiry and will send you detailed information within 24 hours.';
        default:
          return 'We have received your enquiry and will respond within 24 hours.';
      }
    };

    const userEmailResponse = await resend.emails.send({
      from: "Doxa Academy <onboarding@resend.dev>",
      to: [formData.email],
      subject: `Thank you for contacting Doxa Academy - ${formData.enquiryType === 'demo' ? 'Demo Request' : 'Enquiry'} Received`,
      html: `
        <h1>Thank you for contacting us, ${formData.name}!</h1>
        
        <p>${getConfirmationMessage(formData.enquiryType)}</p>
        
        <h3>Your Enquiry Details:</h3>
        <ul>
          <li><strong>Enquiry Type:</strong> ${formData.enquiryType}</li>
          ${formData.schoolName ? `<li><strong>School:</strong> ${formData.schoolName}</li>` : ''}
          <li><strong>Your Role:</strong> ${formData.role}</li>
          ${formData.preferredDate ? `<li><strong>Preferred Date:</strong> ${formData.preferredDate}</li>` : ''}
          ${formData.preferredTime ? `<li><strong>Preferred Time:</strong> ${formData.preferredTime}</li>` : ''}
        </ul>

        <h3>Your Message:</h3>
        <p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007cba;">
          ${formData.message}
        </p>

        <p>If you have any immediate questions, feel free to reply to this email.</p>
        
        <p>Best regards,<br>
        The Doxa Academy Team</p>

        <hr>
        <p style="font-size: 12px; color: #666;">
          Doxa Academy - Complete School Management System<br>
          Transforming education through innovative technology solutions.
        </p>
      `,
    });

    console.log("Contact request emails sent successfully:", { businessEmailResponse, userEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Contact request sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-request function:", error);
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
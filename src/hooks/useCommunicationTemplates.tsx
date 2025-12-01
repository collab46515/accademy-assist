import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';
import { useAuth } from '@/hooks/useAuth';

const ADMISSION_INTERVIEW_TEMPLATE = {
  template_name: 'Admission Interview Invitation',
  template_type: 'email' as const,
  subject_template: 'Admission Interview Schedule for {{student_name}}',
  content_template: `Dear Sir/Madam,

Greetings from {{school_name}}.

We are pleased to inform you that the admission interview for {{student_name}} seeking admission to Class {{year_group}} is ready to be scheduled.

To make it convenient for you, you may choose either Online or Offline mode.

Kindly select your preferred option:

**Option A: Offline Interview (on Campus)**
📌 Date: {{interview_date}}
📌 Time: {{interview_time}}
📌 Venue: School Campus – {{school_address}}

**Option B: Online Interview (via Video Call)**
📌 Date: {{interview_date}}
📌 Time: {{interview_time}}
📌 Platform: Google Meet / Zoom
A link will be shared after confirmation.

**Documents Required (both modes):**
• Birth Certificate (original + copy)
• Previous Grade Report Card
• Transfer Certificate (if available)
• Aadhaar copy of Student & Parent (optional if not required)

Please reply to this message with:
• Preferred Mode: Online / Offline
• Confirmation of Date & Time
• Name of Parent Attending

If you need assistance or want to reschedule:
📞 {{contact_phone}} | ✉️ {{contact_email}}

We look forward to meeting you and welcoming your child to {{school_name}}.

Warm Regards,
Admissions Office
{{school_name}}`,
  description: 'Template for scheduling admission interviews with parents',
  default_audience_type: 'parents' as const,
  default_priority: 'high' as const,
  is_active: true,
};

const WELCOME_ONBOARDING_TEMPLATE = {
  template_name: 'Welcome and Onboarding',
  template_type: 'email' as const,
  subject_template: 'Welcome to {{school_name}} - {{student_name}}',
  content_template: `Dear Parent/Guardian,

We are delighted to welcome {{student_name}} to the {{school_name}} Family!

Your admission to Class {{year_group}} for the academic year {{academic_year}} is now successfully confirmed.

To ensure a smooth onboarding, please note the following details:

📍 School Reopening Date: {{reopening_date}}
📍 Reporting Time: {{reporting_time}}
📍 Uniform & Books Issue: {{uniform_books_details}}
📍 Class Teacher Contact: {{teacher_contact}}
📍 School App / Communication Platform Login Credentials: {{login_credentials}}

**Documents to be submitted (if pending):**
□ Transfer Certificate
□ Medical Report
□ Passport-size Photos – {{photo_count}} copies

We are excited to partner with you in nurturing your child's growth — academically, emotionally and spiritually.

Thank you for choosing {{school_name}}.

Warm Regards,
Admissions & Onboarding Team
{{school_name}}`,
  description: 'Welcome email for newly admitted students with onboarding information',
  default_audience_type: 'parents' as const,
  default_priority: 'high' as const,
  is_active: true,
};

export function useCommunicationTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentSchool } = useRBAC();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentSchool?.id) {
      fetchTemplates();
    }
  }, [currentSchool?.id]);

  const fetchTemplates = async () => {
    if (!currentSchool?.id) return;

    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
    }
  };

  const ensureTemplatesExist = async () => {
    if (!currentSchool?.id || !currentUser?.id) {
      toast({
        title: "Error",
        description: "School and user information required",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      // Check if templates already exist
      const { data: existing } = await supabase
        .from('communication_templates')
        .select('template_name')
        .eq('school_id', currentSchool.id)
        .in('template_name', [
          'Admission Interview Invitation',
          'Welcome and Onboarding',
        ]);

      const existingNames = existing?.map(t => t.template_name) || [];

      // Insert missing templates
      const templatesToInsert = [];
      
      if (!existingNames.includes('Admission Interview Invitation')) {
        templatesToInsert.push({
          ...ADMISSION_INTERVIEW_TEMPLATE,
          school_id: currentSchool.id,
          created_by: currentUser.id,
        });
      }

      if (!existingNames.includes('Welcome and Onboarding')) {
        templatesToInsert.push({
          ...WELCOME_ONBOARDING_TEMPLATE,
          school_id: currentSchool.id,
          created_by: currentUser.id,
        });
      }

      if (templatesToInsert.length > 0) {
        const { error } = await supabase
          .from('communication_templates')
          .insert(templatesToInsert);

        if (error) throw error;

        toast({
          title: "Success",
          description: `${templatesToInsert.length} admission template(s) created`,
        });

        await fetchTemplates();
      }

      return true;
    } catch (error: any) {
      console.error('Error ensuring templates:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendInterviewEmail = async (data: {
    applicationId: string;
    studentName: string;
    yearGroup: string;
    interviewDate: string;
    interviewTime: string;
    parentEmail: string;
  }) => {
    if (!currentSchool) return;

    try {
      // Fetch full school data with contact details
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', currentSchool.id)
        .single();

      if (schoolError) throw schoolError;

      const { data: result, error } = await supabase.functions.invoke(
        'send-admission-interview-email',
        {
          body: {
            ...data,
            schoolData: {
              name: currentSchool.name,
              address: schoolData?.address || '',
              contactPhone: schoolData?.contact_phone || '',
              contactEmail: schoolData?.contact_email || '',
            },
          },
        }
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Interview invitation email sent successfully",
      });

      return result;
    } catch (error: any) {
      console.error('Error sending interview email:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendWelcomeEmail = async (data: {
    applicationId: string;
    studentName: string;
    yearGroup: string;
    parentEmail: string;
    schoolData: {
      reopeningDate: string;
      reportingTime: string;
      uniformBooksDetails: string;
      teacherContact: string;
      academicYear: string;
    };
  }) => {
    if (!currentSchool) return;

    try {
      const { data: result, error } = await supabase.functions.invoke(
        'send-welcome-onboarding-email',
        {
          body: {
            ...data,
            schoolData: {
              name: currentSchool.name,
              ...data.schoolData,
            },
          },
        }
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Welcome onboarding email sent successfully",
      });

      return result;
    } catch (error: any) {
      console.error('Error sending welcome email:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    templates,
    loading,
    ensureTemplatesExist,
    sendInterviewEmail,
    sendWelcomeEmail,
    fetchTemplates,
  };
}
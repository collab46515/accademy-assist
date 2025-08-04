import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Calendar, AlertTriangle, Eye, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const safeguardingSchema = z.object({
  concern_type: z.enum(["bullying", "domestic_violence", "emotional_abuse", "neglect", "online_safety", "other", "physical_abuse", "radicalisation", "self_harm", "sexual_abuse"]),
  risk_level: z.enum(["low", "medium", "high", "critical"]),
  student_name: z.string().min(1, "Student name is required"),
  concern_details: z.string().min(10, "Please provide detailed concern information"),
  incident_date: z.string().optional(),
  location: z.string().optional(),
  witnesses: z.string().optional(),
  immediate_action_taken: z.string().optional(),
  reporter_name: z.string().min(1, "Reporter name is required"),
  reporter_relationship: z.string().min(1, "Relationship to student is required"),
  reporter_contact: z.string().optional(),
  parents_informed: z.boolean().default(false),
  parent_notification_details: z.string().optional(),
  police_involved: z.boolean().default(false),
  police_reference: z.string().optional(),
  social_services_involved: z.boolean().default(false),
  social_services_reference: z.string().optional(),
  agencies_contacted: z.string().optional(),
  confidential: z.boolean().default(true),
});

type SafeguardingForm = z.infer<typeof safeguardingSchema>;

interface SafeguardingFormProps {
  onSubmit?: () => void;
}

export const SafeguardingForm: React.FC<SafeguardingFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const form = useForm<SafeguardingForm>({
    resolver: zodResolver(safeguardingSchema),
    defaultValues: {
      risk_level: "medium",
      parents_informed: false,
      police_involved: false,
      social_services_involved: false,
      confidential: true,
    },
  });

  const handleSubmit = async (data: SafeguardingForm) => {
    try {
      const witnessesArray = data.witnesses ? data.witnesses.split(',').map(w => w.trim()).filter(w => w.length > 0) : [];
      const agenciesArray = data.agencies_contacted ? data.agencies_contacted.split(',').map(a => a.trim()).filter(a => a.length > 0) : [];

      const { error } = await supabase
        .from('safeguarding_concerns')
        .insert([{
          concern_type: data.concern_type,
          risk_level: data.risk_level,
          concern_details: data.concern_details,
          incident_date: data.incident_date ? new Date(data.incident_date).toISOString().split('T')[0] : null,
          location: data.location || null,
          witnesses: witnessesArray.length > 0 ? witnessesArray : null,
          immediate_action_taken: data.immediate_action_taken || null,
          parents_informed: data.parents_informed,
          parent_notification_details: data.parent_notification_details || null,
          police_involved: data.police_involved,
          police_reference: data.police_reference || null,
          social_services_involved: data.social_services_involved,
          social_services_reference: data.social_services_reference || null,
          agencies_contacted: agenciesArray.length > 0 ? agenciesArray : null,
          school_id: '550e8400-e29b-41d4-a716-446655440000', // Default school ID
          student_id: null, // Will be linked to student record separately
          reported_by: null, // Will be set to auth.uid() in RLS policies
          status: 'open',
        }]);

      if (error) throw error;

      toast({
        title: "Safeguarding Concern Reported",
        description: "The concern has been logged and assigned to the Designated Safeguarding Lead.",
      });

      form.reset();
      onSubmit?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit safeguarding concern",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-700">Report Safeguarding Concern</CardTitle>
        </div>
        <CardDescription>
          <strong className="text-red-600">CONFIDENTIAL:</strong> This form is for reporting safeguarding concerns about a child's welfare.
          All information will be treated with the utmost confidentiality and handled by trained safeguarding professionals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Alert Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-800">Important Notice:</p>
                  <p className="text-red-700">
                    If a child is in immediate danger, call emergency services (999) immediately. 
                    This form should not be used for emergency situations.
                  </p>
                </div>
              </div>
            </div>

            {/* Concern Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Concern Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="concern_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Concern *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select concern type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="physical_abuse">Physical Abuse</SelectItem>
                          <SelectItem value="emotional_abuse">Emotional Abuse</SelectItem>
                          <SelectItem value="sexual_abuse">Sexual Abuse</SelectItem>
                          <SelectItem value="neglect">Neglect</SelectItem>
                          <SelectItem value="bullying">Bullying</SelectItem>
                          <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                          <SelectItem value="online_safety">Online Safety</SelectItem>
                          <SelectItem value="self_harm">Self Harm</SelectItem>
                          <SelectItem value="radicalisation">Radicalisation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="risk_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="critical">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-red-200 text-red-900">Critical</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="student_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of the student" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concern_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description of Concern *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide as much detail as possible about the concern, including what you observed, heard, or were told. Include dates, times, and any relevant context."
                        rows={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="incident_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where did this occur?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="witnesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Witnesses</FormLabel>
                    <FormControl>
                      <Input placeholder="Names of any witnesses (separate with commas)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="immediate_action_taken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immediate Action Taken</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe any immediate actions taken to ensure the child's safety"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reporter Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Reporter Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reporter_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reporter_relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Student *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="parent">Parent/Guardian</SelectItem>
                          <SelectItem value="support_staff">Support Staff</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="social_worker">Social Worker</SelectItem>
                          <SelectItem value="external_professional">External Professional</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reporter_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number or email for follow-up" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                External Agencies & Notifications
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="parents_informed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Parents/Guardians have been informed</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="police_involved"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Police have been contacted</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="social_services_involved"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Social Services have been contacted</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agencies_contacted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Agencies Contacted</FormLabel>
                    <FormControl>
                      <Input placeholder="List any other agencies contacted (separate with commas)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <FormField
                control={form.control}
                name="confidential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I understand this information will be handled confidentially by safeguarding professionals
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Information will only be shared with relevant personnel on a need-to-know basis to protect the child
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                Submit Safeguarding Concern
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
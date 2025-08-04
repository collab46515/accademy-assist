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
import { FileText, User, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const complaintSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  complaint_type: z.enum(["academic", "behavioral", "bullying", "discrimination", "facilities", "other", "staff_conduct"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  complainant_name: z.string().min(1, "Complainant name is required"),
  complainant_email: z.string().email("Valid email is required").optional().or(z.literal("")),
  complainant_phone: z.string().optional(),
  complainant_relationship: z.string().min(1, "Relationship is required"),
  student_involved: z.string().optional(),
  incident_date: z.string().optional(),
  location: z.string().optional(),
  desired_outcome: z.string().optional(),
  anonymous: z.boolean().default(false),
});

type ComplaintForm = z.infer<typeof complaintSchema>;

interface ComplaintFormProps {
  onSubmit?: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const form = useForm<ComplaintForm>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      priority: "medium",
      anonymous: false,
    },
  });

  const handleSubmit = async (data: ComplaintForm) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .insert([{
          title: data.title,
          description: data.description,
          complaint_type: data.complaint_type,
          priority: data.priority,
          complainant_name: data.complainant_name,
          complainant_email: data.complainant_email || null,
          complainant_phone: data.complainant_phone || null,
          complainant_relationship: data.complainant_relationship,
          student_involved: data.student_involved || null,
          incident_date: data.incident_date ? new Date(data.incident_date).toISOString().split('T')[0] : null,
          location: data.location || null,
          desired_outcome: data.desired_outcome || null,
          anonymous: data.anonymous,
          school_id: '550e8400-e29b-41d4-a716-446655440000', // Default school ID
          submitted_by: null, // Will be set to auth.uid() in RLS policies
        }]);

      if (error) throw error;

      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been successfully submitted and will be reviewed.",
      });

      form.reset();
      onSubmit?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit complaint",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Submit a Complaint</CardTitle>
        </div>
        <CardDescription>
          Please provide as much detail as possible to help us address your concern effectively
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Complaint Details
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief summary of the issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complaint_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select complaint type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="bullying">Bullying</SelectItem>
                          <SelectItem value="discrimination">Discrimination</SelectItem>
                          <SelectItem value="facilities">Facilities</SelectItem>
                          <SelectItem value="staff_conduct">Staff Conduct</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority *</FormLabel>
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
                          <SelectItem value="urgent">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-red-200 text-red-900">Urgent</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a detailed description of the complaint including dates, people involved, and any relevant circumstances"
                        rows={4}
                        {...field} 
                      />
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
                      <Input placeholder="Where did this incident occur?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Complainant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="complainant_name"
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
                  name="complainant_relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to School *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="staff">Staff Member</SelectItem>
                          <SelectItem value="visitor">Visitor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="complainant_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complainant_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Additional Information
              </h3>
              
              <FormField
                control={form.control}
                name="student_involved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Involved (if applicable)</FormLabel>
                    <FormControl>
                      <Input placeholder="Student name or ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desired_outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Outcome</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What would you like to see happen as a result of this complaint?"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anonymous"
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
                        Submit this complaint anonymously
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Your personal information will not be shared with those investigating the complaint
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Submit Complaint
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
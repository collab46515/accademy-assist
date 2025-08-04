import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ThermometerIcon, HeartIcon, ActivityIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const medicalVisitSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  studentName: z.string().min(1, "Student name is required"),
  visitDate: z.date({
    required_error: "Visit date is required",
  }),
  visitTime: z.string().min(1, "Visit time is required"),
  visitType: z.enum([
    "routine_checkup",
    "illness", 
    "injury",
    "medication_administration",
    "emergency",
    "follow_up"
  ]),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  symptoms: z.string().optional(),
  
  // Vital Signs
  temperature: z.string().optional(),
  bloodPressure: z.string().optional(),
  pulse: z.string().optional(),
  respiratoryRate: z.string().optional(),
  
  // Treatment
  treatmentGiven: z.string().optional(),
  medicationsAdministered: z.string().optional(),
  recommendations: z.string().optional(),
  
  // Follow-up
  followUpRequired: z.boolean().default(false),
  followUpDate: z.date().optional(),
  
  // Parent Notification
  parentNotified: z.boolean().default(false),
  parentNotificationMethod: z.string().optional(),
});

type MedicalVisitFormData = z.infer<typeof medicalVisitSchema>;

interface MedicalVisitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const visitTypeOptions = [
  { value: "routine_checkup", label: "Routine Checkup" },
  { value: "illness", label: "Illness" },
  { value: "injury", label: "Injury" },
  { value: "medication_administration", label: "Medication Administration" },
  { value: "emergency", label: "Emergency" },
  { value: "follow_up", label: "Follow-up Visit" },
];

// Mock students - in real app, this would come from the database
const mockStudents = [
  { id: "1", name: "John Smith", class: "Year 7A" },
  { id: "2", name: "Sarah Johnson", class: "Year 8B" },
  { id: "3", name: "Mike Wilson", class: "Year 9C" },
  { id: "4", name: "Emma Davis", class: "Year 10A" },
  { id: "5", name: "Tom Brown", class: "Year 11B" },
];

export function MedicalVisitForm({ open, onOpenChange }: MedicalVisitFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MedicalVisitFormData>({
    resolver: zodResolver(medicalVisitSchema),
    defaultValues: {
      visitDate: new Date(),
      visitTime: new Date().toTimeString().slice(0, 5),
      followUpRequired: false,
      parentNotified: false,
    },
  });

  const onSubmit = async (data: MedicalVisitFormData) => {
    setIsSubmitting(true);
    try {
      // Here we would save to the database
      console.log("Medical Visit Data:", data);
      
      toast({
        title: "Medical Visit Recorded",
        description: `Visit for ${data.studentName} has been successfully recorded.`,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record medical visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStudent = form.watch("studentId");
  const followUpRequired = form.watch("followUpRequired");
  const parentNotified = form.watch("parentNotified");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Medical Visit</DialogTitle>
          <DialogDescription>
            Record a new medical visit for a student
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Student Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Student Information</h3>
                
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        const student = mockStudents.find(s => s.id === value);
                        if (student) {
                          form.setValue("studentName", student.name);
                        }
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} - {student.class}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Visit Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visit Details</h3>
                
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Visit Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {visitTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Symptoms & Complaint */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Symptoms & Complaint</h3>
              
              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaint</FormLabel>
                    <FormControl>
                      <Input placeholder="Main reason for visit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe symptoms in detail"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Vital Signs
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <ThermometerIcon className="h-4 w-4" />
                        Temperature (°C)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="36.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input placeholder="120/80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pulse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <HeartIcon className="h-4 w-4" />
                        Pulse (bpm)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="72" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="respiratoryRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Respiratory Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="16" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Treatment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Treatment & Care</h3>
              
              <FormField
                control={form.control}
                name="treatmentGiven"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Given</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe treatment provided"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicationsAdministered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medications Administered</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List medications, dosages, and times"
                        className="min-h-[60px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendations</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Care instructions and recommendations"
                        className="min-h-[60px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Follow-up & Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Follow-up</h3>
                
                <FormField
                  control={form.control}
                  name="followUpRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Follow-up required</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {followUpRequired && (
                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Follow-up Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parent Notification</h3>
                
                <FormField
                  control={form.control}
                  name="parentNotified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Parent/Guardian notified</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {parentNotified && (
                  <FormField
                    control={form.control}
                    name="parentNotificationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How were they notified?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="in-person">In Person</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Recording..." : "Record Visit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
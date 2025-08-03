import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Heart, AlertTriangle, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';

export function MedicalSENSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form } = formHook;

  const isSENPathway = pathway === 'sen';
  const isEmergencyPathway = pathway === 'emergency';

  if (isEmergencyPathway) {
    return <SafeguardingSection />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Medical & SEN Information</h3>
      </div>

      {/* Medical Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Medical Information</h4>
        <FormField
          control={form.control}
          name="medical_information"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Conditions & Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe any medical conditions, allergies, medications, or special requirements"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Include allergies, ongoing medical conditions, medications, dietary requirements, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="special_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional support needs or accommodations required"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* SEN Information */}
      {isSENPathway && <SENSpecificSection />}

      {/* Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">School Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="house_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>House Preference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Newton, Darwin, Curie" {...field} />
                </FormControl>
                <FormDescription>
                  Optional - house system preference if applicable
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="form_class_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Form Class Preference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 7A, 7B, 7C" {...field} />
                </FormControl>
                <FormDescription>
                  Optional - form class preference if known
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Additional Notes */}
      <FormField
        control={form.control}
        name="academic_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any additional information about the student's academic background, interests, or other relevant details"
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function SENSpecificSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="font-medium text-foreground flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Special Educational Needs (SEN)
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sen_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEN Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SEN status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EHCP">EHCP (Education, Health & Care Plan)</SelectItem>
                  <SelectItem value="SEN Support">SEN Support</SelectItem>
                  <SelectItem value="None">No SEN Support</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ehcp_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EHCP Number</FormLabel>
              <FormControl>
                <Input placeholder="If applicable" {...field} />
              </FormControl>
              <FormDescription>
                Only if student has an EHCP
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ehcp_expiry_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EHCP Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
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
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="current_sen_provision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current SEN Provision</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe current support, interventions, and provision at previous school"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="mobility_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobility Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any mobility aids, accessibility needs, or physical requirements"
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
          name="communication_needs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Needs</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Speech, language, hearing, or communication support needs"
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
          name="learning_support_needs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Support Needs</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Specific learning difficulties, cognitive support needs"
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
          name="behaviour_support_needs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Behaviour Support Needs</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Emotional, social, or behavioural support strategies"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h5 className="font-medium text-sm">Professional Contacts</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="senco_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SENCO Name</FormLabel>
                <FormControl>
                  <Input placeholder="Previous school SENCO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senco_contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SENCO Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="senco@school.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senco_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SENCO Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="01xxx xxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="educational_psychologist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Educational Psychologist</FormLabel>
              <FormControl>
                <Input placeholder="Name and contact details if involved" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function SafeguardingSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Safeguarding Information</h3>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Confidential Information</h4>
            <p className="text-sm text-amber-700 mt-1">
              This information is strictly confidential and will only be shared with relevant safeguarding personnel.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Safeguarding History</h4>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="safeguarding_has_been_in_care"
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
                    Student has been in care (looked after child)
                  </FormLabel>
                  <FormDescription>
                    Previously or currently in local authority care
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safeguarding_subject_to_child_protection_plan"
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
                    Subject to Child Protection Plan
                  </FormLabel>
                  <FormDescription>
                    Currently or recently subject to a Child Protection Plan
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safeguarding_referral_document"
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
                    Safeguarding referral document available
                  </FormLabel>
                  <FormDescription>
                    Official safeguarding documentation to be provided
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <UrgentNeedsSection />
    </div>
  );
}

function UrgentNeedsSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="font-medium text-foreground">Urgent Needs Assessment</h4>
      <p className="text-sm text-muted-foreground">
        Please indicate any immediate support needs for the student:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="urgent_needs_uniform"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Uniform required</FormLabel>
                <FormDescription>
                  Student needs school uniform provision
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgent_needs_meals"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Free school meals</FormLabel>
                <FormDescription>
                  Student requires meal provision
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgent_needs_device"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Digital device</FormLabel>
                <FormDescription>
                  Laptop/tablet for learning required
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgent_needs_transport"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Transport support</FormLabel>
                <FormDescription>
                  Travel assistance to school needed
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgent_needs_counselling"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Counselling/mental health support</FormLabel>
                <FormDescription>
                  Immediate emotional or psychological support required
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
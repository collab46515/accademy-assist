import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, User, Mail, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';

const yearGroups = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

export function StudentDetailsSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form } = formHook;

  // Different field names for emergency pathway
  const isEmergencyPathway = pathway === 'emergency';
  const firstNameField = isEmergencyPathway ? 'student_first_name' : 'student_name';
  const lastNameField = isEmergencyPathway ? 'student_last_name' : undefined;
  const dobField = isEmergencyPathway ? 'student_dob' : 'date_of_birth';
  const genderField = isEmergencyPathway ? 'student_gender' : 'gender';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Student Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Name - Different handling for emergency pathway */}
        {isEmergencyPathway ? (
          <>
            <FormField
              control={form.control}
              name="student_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <FormField
            control={form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Student Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name={dobField as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth *</FormLabel>
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Student's date of birth
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name={genderField as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genderOptions.map((option) => (
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

        {/* Year Group - Not shown for internal progression */}
        {pathway !== 'internal_progression' && (
          <FormField
            control={form.control}
            name="year_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Group *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearGroups.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Nationality - Not for emergency pathway */}
        {!isEmergencyPathway && (
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., British, American" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Student Email - For older students */}
        {!isEmergencyPathway && (
          <FormField
            control={form.control}
            name="student_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Student Email
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="student@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  Optional - for Year 7+ students
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Student Phone - For older students */}
        {!isEmergencyPathway && (
          <FormField
            control={form.control}
            name="student_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Student Phone
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="07xxx xxxxxx" {...field} />
                </FormControl>
                <FormDescription>
                  Optional - for Year 9+ students
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Previous School - Standard and SEN pathways */}
      {(pathway === 'standard' || pathway === 'sen') && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Previous Education</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="previous_school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous School</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of previous school" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_year_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Year Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Current year group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {yearGroups.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
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
      )}

      {/* Emergency pathway specific fields */}
      {isEmergencyPathway && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="student_immigration_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Immigration Status</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., British Citizen, EU Settled Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_visa_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visa Status</FormLabel>
                  <FormControl>
                    <Input placeholder="If applicable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="student_known_risks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Known Risks</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., self-harm, neglect, CSE - Please provide brief details"
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This information helps us ensure appropriate support and safeguarding measures
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
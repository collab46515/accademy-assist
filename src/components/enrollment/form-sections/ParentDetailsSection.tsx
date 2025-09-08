import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Users } from 'lucide-react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';

const relationshipOptions = [
  { value: 'Parent', label: 'Parent' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Step-parent', label: 'Step-parent' },
  { value: 'Grandparent', label: 'Grandparent' },
  { value: 'Other', label: 'Other relative' },
];

export function ParentDetailsSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form } = formHook;

  // Different field handling for staff child pathway
  const isStaffChild = pathway === 'staff_child';
  const isEmergency = pathway === 'emergency';

  if (isStaffChild) {
    return <StaffInformationSection />;
  }

  if (isEmergency) {
    return <ReferralInformationSection />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="parent_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Parent/Guardian Name *
              </FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship to Student</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relationshipOptions.map((option) => (
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

        <FormField
          control={form.control}
          name="parent_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email Address *
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="parent@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone Number *
              </FormLabel>
               <FormControl>
                 <Input type="tel" placeholder="+91 98765 43210" {...field} />
               </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_aadhaar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhaar Card Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1234 5678 9012" 
                  maxLength={14}
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                12-digit Aadhaar number (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_pan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN Card Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ABCDE1234F" 
                  maxLength={10}
                  style={{ textTransform: 'uppercase' }}
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                10-character PAN number (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Address Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="home_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Home Address *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Full address including street, city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                 <FormItem>
                   <FormLabel>PIN Code *</FormLabel>
                   <FormControl>
                     <Input placeholder="110001" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                 <FormControl>
                   <Input placeholder="India" {...field} />
                 </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <EmergencyContactSection />
    </div>
  );
}

function StaffInformationSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Staff Member Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="staff_member_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff Member Name *</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staff_member_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff ID *</FormLabel>
              <FormControl>
                <Input placeholder="Employee ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staff_member_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="staff@school.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staff_member_department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mathematics, Administration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staff_member_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role/Position *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Teacher, Administrator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationship_to_staff"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship to Student</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Stepchild">Stepchild</SelectItem>
                  <SelectItem value="Adopted child">Adopted child</SelectItem>
                  <SelectItem value="Guardian">Guardian</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <EmergencyContactSection />
    </div>
  );
}

function ReferralInformationSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Referral Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="referral_source_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Source Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Social Worker">Social Worker</SelectItem>
                  <SelectItem value="LA">Local Authority</SelectItem>
                  <SelectItem value="DSL">Designated Safeguarding Lead</SelectItem>
                  <SelectItem value="Charity">Charity</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral_source_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Source Name *</FormLabel>
              <FormControl>
                <Input placeholder="Name of referring person/organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral_source_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="referrer@organization.gov.uk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral_source_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone *</FormLabel>
               <FormControl>
                 <Input type="tel" placeholder="+91 11 xxxx xxxx" {...field} />
               </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function EmergencyContactSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form } = formHook;

  const isStaffChild = pathway === 'staff_child';

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Emergency Contact</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="emergency_contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact Name *</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergency_contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Phone *</FormLabel>
               <FormControl>
                 <Input type="tel" placeholder="+91 98765 43210" {...field} />
               </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isStaffChild && (
          <FormField
            control={form.control}
            name="emergency_contact_relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Aunt, Family Friend" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
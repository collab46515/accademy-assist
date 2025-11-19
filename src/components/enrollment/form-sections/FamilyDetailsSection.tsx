import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';

export function FamilyDetailsSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Family Details</h2>
        <p className="text-muted-foreground">
          Please provide complete information about the family members.
        </p>
      </div>

      {/* Father's Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Father's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name *</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mr.</span>
                    <Input placeholder="Enter Father's Name" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Profession *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Father's Occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Mobile No *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Father's Mobile No" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Email Id *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter Father's Email Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_monthly_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Monthly Income *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Father's Monthly Income" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Employed *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Organization Employed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Mother's Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mother's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mother_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name *</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mrs.</span>
                    <Input placeholder="Enter Mother's Name" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Profession *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mother's Occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Mobile No *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mother's Mobile No" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Email Id *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter Mother's Email Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_monthly_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Monthly Income *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mother's Monthly Income" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Employed *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Organization Employed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Guardian's Details (Optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guardian's Information (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guardian_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Guardian's Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guardian_profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Guardian's Occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guardian_mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Mobile No</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Guardian's Mobile No" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guardian_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Email Id</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter Guardian's Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guardian_monthly_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Monthly Income</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Guardian's Monthly Income" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guardian_organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Employed</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Organization Employed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sibling Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sibling Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="has_sibling_in_school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Does the child have any other sibling(s) studying in Anand Niketan *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sibling_information"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Information of your brother(s) & sister(s) (If studying in school)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter sibling details if any" rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

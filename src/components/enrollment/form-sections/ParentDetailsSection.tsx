import React from 'react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export function ParentDetailsSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Family Details</h2>
        <p className="text-muted-foreground">
          Information about parents and guardians
        </p>
      </div>

      {/* Father Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Father's Details</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Father's Name" {...field} />
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
                  <Input placeholder="Enter Father's Email Id" type="email" {...field} />
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

      <Separator />

      {/* Mother Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mother's Details</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mother_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mother's Name" {...field} />
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
                  <Input placeholder="Enter Mother's Email Id" type="email" {...field} />
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

      <Separator />

      {/* Guardian Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guardian's Details (Optional)</h3>
        <div className="grid gap-6 md:grid-cols-2">
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
                  <Input placeholder="Enter Guardian's Email" type="email" {...field} />
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

      <Separator />

      {/* Sibling Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sibling Information</h3>
        <div className="grid gap-6">
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
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
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
              <FormItem>
                <FormLabel>Information of your brother(s) & sister(s) (If studying in school)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sibling details" {...field} />
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

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';

export function MedicalSENSection() {
  const { formHook, pathway } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Medical & Special Educational Needs</h2>
        <p className="text-muted-foreground">
          Please provide any relevant medical information and special educational needs.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="medical_information"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Information</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe any medical conditions, allergies, medications, or other health-related information we should be aware of"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
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
                  placeholder="Please describe any special requirements, accommodations, or support needed"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {pathway === 'sen' && (
          <>
            <h3 className="text-lg font-semibold">Special Educational Needs Information</h3>
            
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
                      <SelectItem value="EHCP">EHCP (Education, Health and Care Plan)</SelectItem>
                      <SelectItem value="SEN Support">SEN Support</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_sen_provision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current SEN Provision</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any current special educational provisions or support"
                      className="min-h-[100px]"
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
                      placeholder="Describe any specific learning support requirements"
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
                      placeholder="Describe any communication support requirements"
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
              name="mobility_requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobility Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any mobility or physical access requirements"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Assessment & Support</h3>
          
          <FormField
            control={form.control}
            name="assessment_required"
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
                    Assessment Required
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Check if the student needs to take an assessment as part of the admission process
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
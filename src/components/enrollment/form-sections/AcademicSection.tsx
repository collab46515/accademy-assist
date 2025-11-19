import React from 'react';
import { useEnrollmentContext } from '../EnrollmentFormWrapper';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AcademicSection() {
  const { formHook } = useEnrollmentContext();
  const { form } = formHook;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Academic & Language Choice</h2>
        <p className="text-muted-foreground">
          Previous education and subject preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="class_last_studied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class last Studied *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school_last_studied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of School Last Studied</FormLabel>
              <FormControl>
                <Input placeholder="Enter School" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="class_seeking_admission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class for which admission is sought *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_school_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location of School last studied (Mention District & State)</FormLabel>
              <FormControl>
                <Input placeholder="Enter District & State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language_studied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose the language studied in past year *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Odia">Odia</SelectItem>
                  <SelectItem value="Sanskrit">Sanskrit</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_syllabus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Studied Syllabus</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Syllabus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="State Board">State Board</SelectItem>
                  <SelectItem value="IB">IB</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="group_first_choice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Preference - First Choice (Only for Class XI)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Group I">Group I - English, Maths, Physics, Chemistry, Biology</SelectItem>
                  <SelectItem value="Group II">Group II - English, Computer Science, Physics, Chemistry, Biology</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="group_second_choice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Preference - Second Choice (Only for Class XI)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Group I">Group I - English, Maths, Physics, Chemistry, Biology</SelectItem>
                  <SelectItem value="Group II">Group II - English, Computer Science, Physics, Chemistry, Biology</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                *Note: If any of the above groups has less than 15 candidates, then the second option of the student will be considered.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

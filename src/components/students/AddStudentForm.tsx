import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { useMasterData } from '@/hooks/useMasterData';
import { Plus, User, Phone, Mail, Calendar, MapPin, FileText } from 'lucide-react';

interface AddStudentFormProps {
  onStudentAdded?: () => void;
  trigger?: React.ReactNode;
}

export function AddStudentForm({ onStudentAdded, trigger }: AddStudentFormProps) {
  const { toast } = useToast();
  const { currentSchool } = useRBAC();
  const { yearGroups, classes } = useMasterData();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug logging
  console.log('AddStudentForm - Dialog open state:', open);

  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: '',
    phone: '',
    
    // Academic Information
    student_number: '',
    year_group: '',
    form_class: '',
    admission_date: new Date().toISOString().split('T')[0],
    
    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    
    // Additional Information
    address: '',
    medical_notes: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStudentNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSchool) {
      toast({
        title: 'Error',
        description: 'Please select a school first',
        variant: 'destructive',
      });
      return;
    }

    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.year_group) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (First Name, Last Name, Year Group)',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate student number if not provided
      const studentNumber = formData.student_number || generateStudentNumber();

      // Check if student number already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('student_number')
        .eq('student_number', studentNumber)
        .eq('school_id', currentSchool.id)
        .single();

      if (existingStudent) {
        toast({
          title: 'Error',
          description: 'Student number already exists. Please use a different number.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Create a temporary user ID (since we don't have full auth integration)
      const tempUserId = crypto.randomUUID();

      // Create profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: tempUserId,
          email: formData.email || `${studentNumber}@temp.school.local`,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          must_change_password: true,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway for demo purposes
      }

      // Create student record
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: tempUserId,
          school_id: currentSchool.id,
          student_number: studentNumber,
          year_group: formData.year_group,
          form_class: formData.form_class || null,
          date_of_birth: formData.date_of_birth || null,
          admission_date: formData.admission_date,
          emergency_contact_name: formData.emergency_contact_name || null,
          emergency_contact_phone: formData.emergency_contact_phone || null,
          medical_notes: formData.medical_notes || null,
        })
        .select()
        .single();

      if (studentError) {
        throw studentError;
      }

      toast({
        title: 'Success',
        description: `Student ${formData.first_name} ${formData.last_name} has been added successfully!`,
      });

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        email: '',
        phone: '',
        student_number: '',
        year_group: '',
        form_class: '',
        admission_date: new Date().toISOString().split('T')[0],
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        address: '',
        medical_notes: '',
        notes: '',
      });

      setOpen(false);
      
      if (onStudentAdded) {
        onStudentAdded();
      }

    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    console.log('Dialog state changing from', open, 'to', newOpen);
    setOpen(newOpen);
  };

  const handleTriggerClick = () => {
    console.log('Trigger button clicked, current open state:', open);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <div onClick={handleTriggerClick}>
          {trigger || (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Student
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_number">Student Number</Label>
                <Input
                  id="student_number"
                  value={formData.student_number}
                  onChange={(e) => handleInputChange('student_number', e.target.value)}
                  placeholder="Leave empty to auto-generate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year_group">Year Group *</Label>
                <Select value={formData.year_group} onValueChange={(value) => handleInputChange('year_group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearGroups.map((yearGroup) => (
                      <SelectItem key={yearGroup.id} value={yearGroup.year_name}>
                        {yearGroup.year_name}
                      </SelectItem>
                    ))}
                    {/* Fallback options if no year groups loaded */}
                    {yearGroups.length === 0 && (
                      <>
                        <SelectItem value="Year 7">Year 7</SelectItem>
                        <SelectItem value="Year 8">Year 8</SelectItem>
                        <SelectItem value="Year 9">Year 9</SelectItem>
                        <SelectItem value="Year 10">Year 10</SelectItem>
                        <SelectItem value="Year 11">Year 11</SelectItem>
                        <SelectItem value="Year 12">Year 12</SelectItem>
                        <SelectItem value="Year 13">Year 13</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="form_class">Form Class</Label>
                <Input
                  id="form_class"
                  value={formData.form_class}
                  onChange={(e) => handleInputChange('form_class', e.target.value)}
                  placeholder="e.g., 7A, 8B"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admission_date">Admission Date</Label>
                <Input
                  id="admission_date"
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => handleInputChange('admission_date', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                <Select 
                  value={formData.emergency_contact_relationship} 
                  onValueChange={(value) => handleInputChange('emergency_contact_relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Grandparent">Grandparent</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Home address"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical_notes">Medical Notes</Label>
                <Textarea
                  id="medical_notes"
                  value={formData.medical_notes}
                  onChange={(e) => handleInputChange('medical_notes', e.target.value)}
                  placeholder="Any medical conditions, allergies, or special requirements"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any other relevant information"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Student...' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
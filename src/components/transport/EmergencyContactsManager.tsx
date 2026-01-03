import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Phone, User, Shield, Search } from 'lucide-react';
import { useTransportNotifications } from '@/hooks/useTransportNotifications';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudentWithProfile {
  id: string;
  student_number: string;
  year_group: string;
  first_name: string | null;
  last_name: string | null;
}

export const EmergencyContactsManager = () => {
  const { currentSchool } = useRBAC();
  const schoolId = currentSchool?.id || null;
  const { emergencyContacts, loading, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useTransportNotifications(schoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentWithProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    contact_name: '',
    relationship: 'Parent',
    phone_primary: '',
    phone_secondary: '',
    email: '',
    is_authorized_pickup: false,
    priority_order: 1,
    notes: '',
    is_active: true
  });

  useEffect(() => {
    if (schoolId) {
      fetchStudents();
    }
  }, [schoolId]);

  const fetchStudents = async () => {
    if (!schoolId) return;
    setLoadingStudents(true);
    try {
      // Use any type to avoid TS2589 type recursion with deeply nested Supabase generated types
      const client = supabase as any;
      
      const { data: studentsData, error: studentsError } = await client
        .from('students')
        .select('id, student_number, year_group, user_id')
        .eq('school_id', schoolId)
        .eq('is_enrolled', true)
        .order('year_group');
      
      if (studentsError) throw studentsError;
      
      // Get user_ids to fetch profiles
      const userIds = (studentsData || [])
        .map((s: any) => s.user_id)
        .filter((id: string | null): id is string => id !== null);
      
      let profilesMap: Record<string, { first_name: string | null; last_name: string | null }> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await client
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);
        
        profilesMap = (profilesData || []).reduce((acc: any, p: any) => {
          acc[p.id] = { first_name: p.first_name, last_name: p.last_name };
          return acc;
        }, {} as Record<string, { first_name: string | null; last_name: string | null }>);
      }
      
      // Combine students with profiles
      const studentsWithProfiles: StudentWithProfile[] = (studentsData || []).map((s: any) => ({
        id: s.id,
        student_number: s.student_number,
        year_group: s.year_group,
        first_name: s.user_id ? profilesMap[s.user_id]?.first_name || null : null,
        last_name: s.user_id ? profilesMap[s.user_id]?.last_name || null : null
      }));
      
      setStudents(studentsWithProfiles);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 'Unknown Student';
    return `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.student_number;
  };

  const handleSubmit = async () => {
    if (!schoolId) return;
    
    // Validation
    if (!formData.student_id) {
      toast.error('Please select a student');
      return;
    }
    if (!formData.contact_name.trim()) {
      toast.error('Please enter contact name');
      return;
    }
    if (!formData.phone_primary.trim()) {
      toast.error('Please enter primary phone number');
      return;
    }
    
    try {
      if (editingContact) {
        await updateEmergencyContact(editingContact.id, formData);
        toast.success('Contact updated successfully');
      } else {
        await addEmergencyContact({ ...formData, school_id: schoolId });
        toast.success('Contact added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Error saving contact:', err);
      toast.error(`Failed to save contact: ${err.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setFormData({
      student_id: contact.student_id,
      contact_name: contact.contact_name,
      relationship: contact.relationship,
      phone_primary: contact.phone_primary,
      phone_secondary: contact.phone_secondary || '',
      email: contact.email || '',
      is_authorized_pickup: contact.is_authorized_pickup,
      priority_order: contact.priority_order,
      notes: contact.notes || '',
      is_active: contact.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingContact(null);
    setFormData({
      student_id: '',
      contact_name: '',
      relationship: 'Parent',
      phone_primary: '',
      phone_secondary: '',
      email: '',
      is_authorized_pickup: false,
      priority_order: 1,
      notes: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Emergency Contacts</h3>
          <p className="text-sm text-muted-foreground">Manage emergency contacts and authorized pickup persons</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingContact ? 'Edit Contact' : 'Add Emergency Contact'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Student *</Label>
                  <Select 
                    value={formData.student_id} 
                    onValueChange={(v) => setFormData({ ...formData, student_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingStudents ? (
                        <SelectItem value="_loading" disabled>Loading students...</SelectItem>
                      ) : students.length === 0 ? (
                        <SelectItem value="_empty" disabled>No students found</SelectItem>
                      ) : (
                        students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.first_name || student.last_name 
                              ? `${student.first_name || ''} ${student.last_name || ''}`.trim()
                              : student.student_number} ({student.year_group})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Contact Name *</Label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select value={formData.relationship} onValueChange={(v) => setFormData({ ...formData, relationship: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Guardian">Guardian</SelectItem>
                        <SelectItem value="Grandparent">Grandparent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Relative">Relative</SelectItem>
                        <SelectItem value="Family Friend">Family Friend</SelectItem>
                        <SelectItem value="Nanny">Nanny/Caretaker</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={formData.priority_order.toString()} onValueChange={(v) => setFormData({ ...formData, priority_order: parseInt(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Primary</SelectItem>
                        <SelectItem value="2">2 - Secondary</SelectItem>
                        <SelectItem value="3">3 - Tertiary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Phone *</Label>
                    <Input
                      value={formData.phone_primary}
                      onChange={(e) => setFormData({ ...formData, phone_primary: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Phone</Label>
                    <Input
                      value={formData.phone_secondary}
                      onChange={(e) => setFormData({ ...formData, phone_secondary: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_authorized_pickup}
                      onCheckedChange={(v) => setFormData({ ...formData, is_authorized_pickup: v })}
                    />
                    <span className="text-sm">Authorized for Pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                    />
                    <span className="text-sm">Active</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>
                    {editingContact ? 'Update' : 'Add'} Contact
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {emergencyContacts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No emergency contacts added yet</p>
            <p className="text-sm mt-1">Add contacts for each student using transport</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {emergencyContacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{contact.contact_name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    </div>
                  </div>
                  <Badge variant={contact.priority_order === 1 ? 'default' : 'outline'}>
                    #{contact.priority_order}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.phone_primary}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{contact.email}</span>
                    </div>
                  )}
                </div>

                {contact.is_authorized_pickup && (
                  <Badge variant="secondary" className="gap-1 mb-3">
                    <Shield className="h-3 w-3" />
                    Authorized Pickup
                  </Badge>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(contact)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive"
                    onClick={() => deleteEmergencyContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

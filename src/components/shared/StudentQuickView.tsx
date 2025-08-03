import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student } from '@/hooks/useStudentData';
import { Eye, Phone, Mail, Calendar, AlertTriangle, Heart } from 'lucide-react';

interface StudentQuickViewProps {
  student: Student;
  trigger?: React.ReactNode;
}

export function StudentQuickView({ student, trigger }: StudentQuickViewProps) {
  const [open, setOpen] = useState(false);

  const initials = `${student.profiles?.first_name?.[0] || ''}${student.profiles?.last_name?.[0] || ''}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.profiles?.avatar_url} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">
                {student.profiles?.first_name} {student.profiles?.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                Student ID: {student.student_number}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Year Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{student.year_group}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Form Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm">{student.form_class || 'Not assigned'}</span>
                </CardContent>
              </Card>
            </div>

            {student.date_of_birth && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm">{new Date(student.date_of_birth).toLocaleDateString()}</span>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Enrollment data will be available when database is ready</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm">{student.profiles?.email}</span>
                </CardContent>
              </Card>

              {student.profiles?.phone && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm">{student.profiles.phone}</span>
                  </CardContent>
                </Card>
              )}

              {student.emergency_contact_name && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{student.emergency_contact_name}</div>
                      {student.emergency_contact_phone && (
                        <div className="text-sm text-muted-foreground">{student.emergency_contact_phone}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {student.medical_notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Medical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{student.medical_notes}</p>
                </CardContent>
              </Card>
            )}

            {student.safeguarding_notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Safeguarding Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{student.safeguarding_notes}</p>
                </CardContent>
              </Card>
            )}

            {!student.medical_notes && !student.safeguarding_notes && (
              <p className="text-sm text-muted-foreground">No notes available</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
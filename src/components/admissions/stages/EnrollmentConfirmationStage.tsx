import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentConfirmationStageProps {
  applicationId: string;
  applicationData?: any;
  onMoveToNext: () => void;
}

export function EnrollmentConfirmationStage({ applicationId, applicationData, onMoveToNext }: EnrollmentConfirmationStageProps) {
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [formClass, setFormClass] = useState('');
  const [house, setHouse] = useState('');
  const { toast } = useToast();

  const handleConfirmEnrollment = async () => {
    if (!studentId || !startDate || !formClass || !house) {
      toast({
        title: "Missing information",
        description: "Please fill in all enrollment details",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Store in notes or additional_data as JSON
      const enrollmentData = {
        student_id: studentId,
        start_date: startDate,
        form_class: formClass,
        house: house,
        confirmed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          additional_data: enrollmentData
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Enrollment confirmed",
        description: "Student enrollment details saved successfully",
      });

      onMoveToNext();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Enrollment Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Student ID</label>
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g., STU-2024-001"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Form Class</label>
            <Input
              value={formClass}
              onChange={(e) => setFormClass(e.target.value)}
              placeholder="e.g., 7A"
            />
          </div>
          <div>
            <label className="text-sm font-medium">House</label>
            <Input
              value={house}
              onChange={(e) => setHouse(e.target.value)}
              placeholder="e.g., Churchill House"
            />
          </div>
          <Button onClick={handleConfirmEnrollment} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Enrollment & Move to Welcome
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
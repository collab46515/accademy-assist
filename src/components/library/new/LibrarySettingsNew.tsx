import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Settings, GraduationCap, Briefcase, BookOpen } from "lucide-react";
import { useLibraryData } from "@/hooks/useLibraryData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LibrarySettingsNew() {
  const { settings, fetchSettings } = useLibraryData();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    student_max_books: 2,
    student_loan_days: 14,
    student_fine_per_day: 1,
    student_max_renewals: 1,
    staff_max_books: 5,
    staff_loan_days: 30,
    staff_fine_per_day: 0,
    staff_max_renewals: 2,
    allow_reservations: true,
    grace_period_days: 0,
    lost_book_processing_fee: 50,
    academic_year: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        student_max_books: settings.student_max_books,
        student_loan_days: settings.student_loan_days,
        student_fine_per_day: settings.student_fine_per_day,
        student_max_renewals: settings.student_max_renewals,
        staff_max_books: settings.staff_max_books,
        staff_loan_days: settings.staff_loan_days,
        staff_fine_per_day: settings.staff_fine_per_day,
        staff_max_renewals: settings.staff_max_renewals,
        allow_reservations: settings.allow_reservations,
        grace_period_days: settings.grace_period_days,
        lost_book_processing_fee: settings.lost_book_processing_fee,
        academic_year: settings.academic_year || ""
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('library_settings')
        .update({
          student_max_books: formData.student_max_books,
          student_loan_days: formData.student_loan_days,
          student_fine_per_day: formData.student_fine_per_day,
          student_max_renewals: formData.student_max_renewals,
          staff_max_books: formData.staff_max_books,
          staff_loan_days: formData.staff_loan_days,
          staff_fine_per_day: formData.staff_fine_per_day,
          staff_max_renewals: formData.staff_max_renewals,
          allow_reservations: formData.allow_reservations,
          grace_period_days: formData.grace_period_days,
          lost_book_processing_fee: formData.lost_book_processing_fee,
          academic_year: formData.academic_year || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;
      
      toast.success('Settings saved successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Library Settings
          </CardTitle>
          <CardDescription>Configure library policies and rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5" />
              General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  placeholder="e.g., 2024-25"
                />
              </div>
              <div>
                <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  min="0"
                  value={formData.grace_period_days}
                  onChange={(e) => setFormData({ ...formData, grace_period_days: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground mt-1">Days after due date before fine applies</p>
              </div>
              <div>
                <Label htmlFor="lostFee">Lost Book Processing Fee (₹)</Label>
                <Input
                  id="lostFee"
                  type="number"
                  min="0"
                  value={formData.lost_book_processing_fee}
                  onChange={(e) => setFormData({ ...formData, lost_book_processing_fee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="allowReservations"
                  checked={formData.allow_reservations}
                  onCheckedChange={(checked) => setFormData({ ...formData, allow_reservations: checked })}
                />
                <Label htmlFor="allowReservations">Allow Book Reservations</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Student Policy */}
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5" />
              Student Borrowing Policy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="studentMaxBooks">Max Books</Label>
                <Input
                  id="studentMaxBooks"
                  type="number"
                  min="1"
                  value={formData.student_max_books}
                  onChange={(e) => setFormData({ ...formData, student_max_books: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="studentLoanDays">Loan Period (Days)</Label>
                <Input
                  id="studentLoanDays"
                  type="number"
                  min="1"
                  value={formData.student_loan_days}
                  onChange={(e) => setFormData({ ...formData, student_loan_days: parseInt(e.target.value) || 14 })}
                />
              </div>
              <div>
                <Label htmlFor="studentFine">Fine per Day (₹)</Label>
                <Input
                  id="studentFine"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.student_fine_per_day}
                  onChange={(e) => setFormData({ ...formData, student_fine_per_day: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="studentRenewals">Max Renewals</Label>
                <Input
                  id="studentRenewals"
                  type="number"
                  min="0"
                  value={formData.student_max_renewals}
                  onChange={(e) => setFormData({ ...formData, student_max_renewals: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Staff Policy */}
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5" />
              Staff Borrowing Policy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="staffMaxBooks">Max Books</Label>
                <Input
                  id="staffMaxBooks"
                  type="number"
                  min="1"
                  value={formData.staff_max_books}
                  onChange={(e) => setFormData({ ...formData, staff_max_books: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="staffLoanDays">Loan Period (Days)</Label>
                <Input
                  id="staffLoanDays"
                  type="number"
                  min="1"
                  value={formData.staff_loan_days}
                  onChange={(e) => setFormData({ ...formData, staff_loan_days: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div>
                <Label htmlFor="staffFine">Fine per Day (₹)</Label>
                <Input
                  id="staffFine"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.staff_fine_per_day}
                  onChange={(e) => setFormData({ ...formData, staff_fine_per_day: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground mt-1">Set to 0 for no fine</p>
              </div>
              <div>
                <Label htmlFor="staffRenewals">Max Renewals</Label>
                <Input
                  id="staffRenewals"
                  type="number"
                  min="0"
                  value={formData.staff_max_renewals}
                  onChange={(e) => setFormData({ ...formData, staff_max_renewals: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

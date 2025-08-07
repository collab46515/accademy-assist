import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Users, School } from "lucide-react";

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleDemoModal({ isOpen, onClose }: ScheduleDemoModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolName: "",
    role: "",
    studentCount: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://iosceukdfokpptvqfirp.supabase.co/functions/v1/send-demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2NldWtkZm9rcHB0dnFmaXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTU0NTAsImV4cCI6MjA2OTc5MTQ1MH0.WPkORWUMRfMEAVlkl6--r8rZ85YFXeJlXFkKya1PLuI`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Demo Request Sent!",
          description: "We'll contact you within 24 hours to schedule your personalized demo.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          schoolName: "",
          role: "",
          studentCount: "",
          preferredDate: "",
          preferredTime: "",
          message: ""
        });
        onClose();
      } else {
        throw new Error('Failed to send demo request');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send demo request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-6 w-6 text-primary" />
            Schedule Your Demo
          </DialogTitle>
          <DialogDescription className="text-base">
            Get a personalized demonstration of Pappaya Academy's features and see how it can transform your school management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Contact Information
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@school.edu"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+44 1234 567890"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headteacher">Head Teacher</SelectItem>
                    <SelectItem value="deputy">Deputy Head</SelectItem>
                    <SelectItem value="administrator">School Administrator</SelectItem>
                    <SelectItem value="it-manager">IT Manager</SelectItem>
                    <SelectItem value="office-manager">Office Manager</SelectItem>
                    <SelectItem value="business-manager">Business Manager</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              School Information
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange("schoolName", e.target.value)}
                  placeholder="Your school name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentCount">Number of Students</Label>
                <Select value={formData.studentCount} onValueChange={(value) => handleInputChange("studentCount", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100">Under 100</SelectItem>
                    <SelectItem value="100-300">100 - 300</SelectItem>
                    <SelectItem value="300-500">300 - 500</SelectItem>
                    <SelectItem value="500-1000">500 - 1,000</SelectItem>
                    <SelectItem value="1000-2000">1,000 - 2,000</SelectItem>
                    <SelectItem value="over-2000">Over 2,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Preferred Schedule
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-10">9:00 - 10:00 AM</SelectItem>
                    <SelectItem value="10-11">10:00 - 11:00 AM</SelectItem>
                    <SelectItem value="11-12">11:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="2-3">2:00 - 3:00 PM</SelectItem>
                    <SelectItem value="3-4">3:00 - 4:00 PM</SelectItem>
                    <SelectItem value="4-5">4:00 - 5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your specific requirements or questions..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90"
            >
              {isSubmitting ? "Sending..." : "Schedule Demo"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="text-sm text-muted-foreground text-center pt-4 border-t">
          We'll contact you within 24 hours to confirm your demo appointment.
        </div>
      </DialogContent>
    </Dialog>
  );
}
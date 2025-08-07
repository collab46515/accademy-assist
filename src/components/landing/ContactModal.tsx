import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Users, School } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolName: "",
    role: "",
    studentCount: "",
    enquiryType: "",
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
      const response = await fetch('https://iosceukdfokpptvqfirp.supabase.co/functions/v1/send-contact-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2NldWtkZm9rcHB0dnFmaXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTU0NTAsImV4cCI6MjA2OTc5MTQ1MH0.WPkORWUMRfMEAVlkl6--r8rZ85YFXeJlXFkKya1PLuI`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll respond to your enquiry within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          schoolName: "",
          role: "",
          studentCount: "",
          enquiryType: "",
          preferredDate: "",
          preferredTime: "",
          message: ""
        });
        onClose();
      } else {
        throw new Error('Failed to send contact request');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
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
            Contact Us
          </DialogTitle>
          <DialogDescription className="text-base">
            Get in touch with our team for demos, support, or general enquiries. We'll respond within 24 hours.
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
                <Label htmlFor="role">Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="headteacher">Head Teacher</SelectItem>
                    <SelectItem value="deputy">Deputy Head</SelectItem>
                    <SelectItem value="administrator">School Administrator</SelectItem>
                    <SelectItem value="it-manager">IT Manager</SelectItem>
                    <SelectItem value="office-manager">Office Manager</SelectItem>
                    <SelectItem value="business-manager">Business Manager</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enquiryType">Enquiry Type *</Label>
                <Select value={formData.enquiryType} onValueChange={(value) => handleInputChange("enquiryType", value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select enquiry type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="demo">Request a Demo</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="pricing">Pricing Information</SelectItem>
                    <SelectItem value="general">General Enquiry</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              School Information (Optional)
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange("schoolName", e.target.value)}
                  placeholder="Your school name (if applicable)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentCount">Number of Students</Label>
                <Select value={formData.studentCount} onValueChange={(value) => handleInputChange("studentCount", value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select student count" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
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

          {/* Scheduling - Only show for demo requests */}
          {formData.enquiryType === "demo" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Preferred Schedule (Optional)
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
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
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
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Please provide details about your enquiry..."
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="text-sm text-muted-foreground text-center pt-4 border-t">
          We'll respond to your enquiry within 24 hours.
        </div>
      </DialogContent>
    </Dialog>
  );
}
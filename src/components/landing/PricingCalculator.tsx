import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CheckCircle, 
  Star, 
  Rocket,
  Settings,
  Headset,
  Calculator,
  Lightbulb,
  UserPlus,
  MessageSquare
} from "lucide-react";

interface ProModule {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export function PricingCalculator() {
  const [admissions, setAdmissions] = useState(300);
  const [proModules, setProModules] = useState<ProModule[]>([
    { id: "biometric", name: "Biometric Integration", price: 10, selected: false },
    { id: "whatsapp", name: "WhatsApp Integration", price: 10, selected: false },
    { id: "ai-timetable", name: "AI Timetable Generator", price: 5, selected: false },
    { id: "ai-lesson", name: "AI Powered Lesson Planner", price: 5, selected: false },
    { id: "ai-grading", name: "AI Grading Assistant", price: 5, selected: false },
    { id: "ai-report", name: "AI Generated Student Report", price: 5, selected: false },
    { id: "performance", name: "Advanced Performance & Training", price: 15, selected: false },
    { id: "knowledge", name: "Visual Knowledge Base", price: 8, selected: false },
    { id: "bus-qr", name: "Bus Attendance by QR", price: 12, selected: false },
    { id: "library", name: "Library Services", price: 10, selected: false },
    { id: "hostel", name: "Hostel Management", price: 12, selected: false },
    { id: "welfare", name: "Student Welfare", price: 8, selected: false },
    { id: "behavior", name: "Behavior Tracking", price: 8, selected: false },
    { id: "recruitment", name: "Recruitment & Hiring Process Management", price: 15, selected: false },
    { id: "bus-teacher", name: "Bus & Teacher Integration", price: 10, selected: false },
  ]);

  const BASE_COST = 18000;
  const ADDITIONAL_STUDENT_COST = 60;
  const BASE_ADMISSIONS = 300;
  const GST_RATE = 0.18;

  const [pricing, setPricing] = useState({
    core: BASE_COST,
    additional: 0,
    proModules: 0,
    subtotal: BASE_COST,
    gst: BASE_COST * GST_RATE,
    total: BASE_COST * (1 + GST_RATE),
  });

  useEffect(() => {
    calculatePrice();
  }, [admissions, proModules]);

  const calculatePrice = () => {
    const additionalStudents = Math.max(0, admissions - BASE_ADMISSIONS);
    const additionalCost = additionalStudents * ADDITIONAL_STUDENT_COST;
    const coreCost = BASE_COST + additionalCost;
    
    const proModulesCost = proModules
      .filter(m => m.selected)
      .reduce((sum, m) => sum + (m.price * admissions), 0);
    
    const subtotal = coreCost + proModulesCost;
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;

    setPricing({
      core: coreCost,
      additional: additionalCost,
      proModules: proModulesCost,
      subtotal,
      gst,
      total,
    });
  };

  const toggleModule = (id: string) => {
    setProModules(prev => 
      prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m)
    );
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const coreModules = [
    "Admission Management",
    "Inventory Management", 
    "Accounting Management",
    "Bulk SMS & Email Facility",
    "Timetable Management",
    "Employee Time Sheet Management",
    "Student/Teacher/Staff Attendance",
    "Assignment & Homework Management",
    "Notice Board & Communication",
    "Customized Report System",
    "Mobile App for Students/Parents/School Admin/Employee",
    "Transport Management",
    "Exams & Assessment",
    "Activities & Events"
  ];

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 text-lg px-6 py-2">
            😊 Flexible Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Design Your Affordable Pricing Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Welcome to DoxaERP, the flexible and scalable ERP solution designed to meet the diverse needs of educational institutions. 
            Our pricing plans are tailored to suit educational institutions of all sizes, empowering them to streamline their operations, 
            enhance efficiency, and drive growth.
          </p>
        </div>

        {/* Features Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-2">Scalable</h3>
            <p className="text-muted-foreground">Grow with your institution</p>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-lg">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Customizable</h3>
            <p className="text-muted-foreground">Tailored to your needs</p>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center shadow-lg">
              <Headset className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Support</h3>
            <p className="text-muted-foreground">Dedicated assistance</p>
          </div>
        </div>

        {/* Main Pricing Card */}
        <Card className="max-w-5xl mx-auto border-t-4 border-t-primary shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground text-center py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} />
            <div className="relative z-10">
              <CardTitle className="text-4xl mb-4 font-extrabold">
                LOW RENEWAL - PAY PER ADMISSION PLAN
              </CardTitle>
              <p className="text-xl opacity-95">Flexible pricing that grows with your institution</p>
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-12">
            {/* Admissions Input */}
            <div className="mb-12 p-8 bg-gradient-to-br from-muted/50 to-muted rounded-2xl border-2 border-primary/20 shadow-lg">
              <label className="block text-center mb-6 text-2xl font-bold text-primary flex items-center justify-center gap-3">
                <Users className="w-8 h-8" />
                Number of Admissions per Year
              </label>
              <div className="flex items-center justify-center gap-4">
                <Users className="w-6 h-6 text-primary" />
                <Input
                  type="number"
                  min="0"
                  value={admissions}
                  onChange={(e) => setAdmissions(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-64 text-center text-2xl font-bold border-2 border-primary/30 focus:border-primary shadow-lg h-16"
                />
              </div>
            </div>

            {/* Core Modules */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-primary/30">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Core Modules (Included)</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreModules.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-card border-l-4 border-l-primary rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium">{module}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Modules */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-secondary/30">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary">Pro Modules (Select as per your requirements)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {proModules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => toggleModule(module.id)}
                    className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 ${
                      module.selected
                        ? "border-secondary bg-secondary/10 shadow-secondary/20"
                        : "border-border bg-card hover:border-secondary/50 hover:bg-secondary/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={module.selected}
                      onChange={() => {}}
                      className="w-6 h-6 accent-secondary cursor-pointer"
                    />
                    <span className="flex-1 font-medium">{module.name}</span>
                    <Badge className="bg-gradient-to-r from-secondary to-accent text-white font-bold text-sm px-3 py-1">
                      ₹{module.price}/student
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                  <Calculator className="w-8 h-8" />
                  Pricing Summary
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/30">
                      <span className="font-medium">Core Modules:</span>
                      <span className="font-bold text-xl">{formatCurrency(pricing.core)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/30">
                      <span className="font-medium">Additional Students:</span>
                      <span className="font-bold text-xl">{formatCurrency(pricing.additional)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/30">
                      <span className="font-medium">Selected Pro Modules:</span>
                      <span className="font-bold text-xl">{formatCurrency(pricing.proModules)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/30">
                      <span className="font-medium">GST (18%):</span>
                      <span className="font-bold text-xl">{formatCurrency(pricing.gst)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t-2 border-white/50">
                  <span className="text-2xl font-bold">Total Annual Cost:</span>
                  <span className="text-4xl font-extrabold">{formatCurrency(pricing.total)}</span>
                </div>
              </div>
            </div>

            {/* Example Section */}
            <div className="mt-8 p-8 bg-gradient-to-r from-accent to-accent/70 text-white rounded-2xl shadow-lg">
              <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Lightbulb className="w-7 h-7" />
                Example Calculation:
              </h4>
              <div className="space-y-2 text-lg">
                <p>• Number of admissions: 350</p>
                <p>• Core module cost: ₹18,000 + (50 × ₹60) = ₹18,000 + ₹3,000 = ₹21,000</p>
                <p>• Selected pro module: WhatsApp Integration (₹10 per student) = 350 × ₹10 = ₹3,500</p>
                <p>• Total cost: ₹21,000 + ₹3,500 = ₹24,500 + GST</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-lg px-10 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <UserPlus className="mr-3 w-6 h-6" />
                SIGN UP NOW
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-lg px-10 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <MessageSquare className="mr-3 w-6 h-6" />
                GET INSTANT QUOTE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Clock, 
  Shield, 
  Sparkles,
  Award,
  BookOpen,
  Calendar
} from "lucide-react";

interface CallToActionSectionProps {
  onGetStarted: () => void;
  onScheduleDemo: () => void;
}

export function CallToActionSection({ onGetStarted, onScheduleDemo }: CallToActionSectionProps) {
  const benefits = [
    {
      icon: Clock,
      title: "Save 10+ Hours Weekly",
      description: "Automate administrative tasks and focus on what matters most - education."
    },
    {
      icon: Users,
      title: "Streamline Communication",
      description: "Connect teachers, parents, and students through one unified platform."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "GDPR compliant with enterprise-grade security for all your data."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Comprehensive solution designed for educational excellence."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-primary/5 bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Transform Your School Today
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to revolutionize your
              <span className="text-primary block">school management?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join hundreds of schools already using Doxa Academy to streamline operations, 
              improve communication, and enhance the educational experience for everyone.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


          {/* Call to Action */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={onScheduleDemo}
                className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/5"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                30-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Setup support included
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
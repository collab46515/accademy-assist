import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlayCircle, Star, GraduationCap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-primary border-primary/20">
                <Star className="h-3 w-3 mr-1" />
                Complete School Management Solution
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                AI-Powered Education
                <span className="text-primary block">Revolutionizing Schools</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Experience the future of education with our AI Classroom Suite featuring real-time student analytics, 
                adaptive teaching assistance, and intelligent classroom management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => window.open('/ai-classroom/session/demo-session-1', '_blank')}
                className="text-lg px-8"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Try AI Classroom Demo
              </Button>
            </div>

          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm border border-primary/10">
              <div className="h-full w-full bg-background rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <img src="/lovable-uploads/5908f914-4b1a-4234-abb8-009537c792ee.png" alt="DOXA Logo" className="h-96 w-auto mx-auto" />
                  <h3 className="text-xl font-semibold">Pappaya Academy</h3>
                  <p className="text-muted-foreground">Complete School Management System</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-background border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium">AI Classroom Live</div>
              <div className="text-xs text-muted-foreground">Real-time student analytics</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium">Smart Teaching</div>
              <div className="text-xs text-muted-foreground">Adaptive AI assistance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
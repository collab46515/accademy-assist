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
                Transform Your
                <span className="text-primary block">Educational Institution</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Streamline every aspect of school management with our comprehensive, AI-powered platform. 
                From admissions to graduation, we've got you covered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-2xl font-bold text-primary">12+</div>
                <div className="text-sm text-muted-foreground">Core Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Schools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm border border-primary/10">
              <div className="h-full w-full bg-background rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <img src="/lovable-uploads/0a977b5c-549a-4597-a296-a9e51592864a.png" alt="Pappaya Academy Logo" className="h-96 w-auto mx-auto" />
                  <h3 className="text-xl font-semibold">Pappaya Academy</h3>
                  <p className="text-muted-foreground">Complete School Management System</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-background border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium">Live Updates</div>
              <div className="text-xs text-muted-foreground">Real-time notifications</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium">AI Insights</div>
              <div className="text-xs text-muted-foreground">Predictive analytics</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
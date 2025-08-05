import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

interface Module {
  name: string;
  icon: any;
  description: string;
  features: string[];
  color: string;
}

interface ModuleShowcaseProps {
  modules: Module[];
}

export function ModuleShowcase({ modules }: ModuleShowcaseProps) {
  return (
    <section className="py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/20">
            Complete Module Suite
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            Comprehensive School
            <span className="text-primary block">Management Modules</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every module is designed to work seamlessly together, providing a unified experience 
            for administrators, teachers, students, and parents.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-7 w-7 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl mb-3">{module.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {module.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Key Features
                  </h4>
                  {module.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Module Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Showcase */}
        <div className="mt-24">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Seamlessly Integrated Ecosystem
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  All modules share data in real-time, providing a unified view of your institution. 
                  Changes in one module automatically update related information across the system.
                </p>
                
                <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto mt-8">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Data Integration</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">Real-time</div>
                    <div className="text-sm text-muted-foreground">Updates</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">Unified</div>
                    <div className="text-sm text-muted-foreground">Experience</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
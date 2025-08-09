import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, PlayCircle } from "lucide-react";

interface Module {
  name: string;
  icon: any;
  description: string;
  features: string[];
  color: string;
  highlight?: boolean;
  featured?: boolean;
  demoUrl?: string;
}

interface FeaturesGridProps {
  modules: Module[];
}

export function FeaturesGrid({ modules }: FeaturesGridProps) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/20">
            Comprehensive Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            AI-Powered School
            <span className="text-primary block">Management Suite</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionary AI features leading the future of education, plus comprehensive 
            management modules for complete school operations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.slice(0, 6).map((module, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md relative ${
                module.highlight && module.featured ? 'border-2 border-emerald-200 shadow-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 ring-2 ring-emerald-100' : 
                module.highlight ? 'border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : ''
              }`}
            >
              {module.highlight && module.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white animate-pulse">
                    🌟 BREAKTHROUGH AI
                  </Badge>
                </div>
              )}
              {module.highlight && !module.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    ⭐ AI Powered
                  </Badge>
                </div>
              )}
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{module.name}</CardTitle>
                  <CardDescription className="text-base">{module.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {module.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  className={`w-full transition-colors ${
                    module.highlight && module.featured
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700' 
                      : module.highlight 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700' 
                      : 'group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}
                  onClick={() => module.demoUrl && window.open(module.demoUrl, '_blank')}
                >
                  {module.featured ? (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Try Live Demo
                    </>
                  ) : module.highlight ? 'Try AI Feature' : 'Learn More'}
                  {!module.featured && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All {modules.length} Modules
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
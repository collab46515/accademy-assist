import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnrollmentForm } from '@/components/enrollment/EnrollmentForm';
import { PathwayType, pathwayConfig } from '@/lib/enrollment-schemas';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Users, UserCheck, AlertTriangle, Upload, RefreshCw, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApplicationFormsProps {
  onBackToDashboard: () => void;
}

export function ApplicationForms({ onBackToDashboard }: ApplicationFormsProps) {
  const navigate = useNavigate();
  const [selectedPathway, setSelectedPathway] = useState<PathwayType | null>(null);
  const [applicationId, setApplicationId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const pathwayIcons = {
    standard: FileText,
    sen: UserCheck,
    staff_child: Users,
    emergency: AlertTriangle,
    bulk_import: Upload,
    internal_progression: RefreshCw,
  };

  const pathwayColors = {
    standard: "bg-blue-50 border-blue-200 text-blue-800",
    sen: "bg-purple-50 border-purple-200 text-purple-800",
    staff_child: "bg-green-50 border-green-200 text-green-800",
    emergency: "bg-red-50 border-red-200 text-red-800",
    bulk_import: "bg-orange-50 border-orange-200 text-orange-800",
    internal_progression: "bg-teal-50 border-teal-200 text-teal-800",
  };

  const handlePathwaySelect = (pathway: PathwayType) => {
    setSelectedPathway(pathway);
    setApplicationId(undefined);
  };

  const handleBackToSelection = () => {
    setSelectedPathway(null);
    setApplicationId(undefined);
  };

  const handleApplicationSubmit = async (data: any) => {
    try {
      toast({
        title: "Application Submitted",
        description: "The application has been successfully submitted for review.",
      });
      
      // Optionally redirect back to dashboard or show success page
      setTimeout(() => {
        onBackToDashboard();
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting the application. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (selectedPathway) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSelection}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Pathways</span>
                </Button>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center space-x-3">
                  {React.createElement(pathwayIcons[selectedPathway], {
                    className: "h-5 w-5 text-muted-foreground"
                  })}
                  <div>
                    <h1 className="text-lg font-semibold">{pathwayConfig[selectedPathway].name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {pathwayConfig[selectedPathway].description}
                    </p>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={pathwayColors[selectedPathway]}>
                {selectedPathway.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <EnrollmentForm 
            pathway={selectedPathway} 
            applicationId={applicationId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admissions & Enrollment</h1>
              <p className="text-muted-foreground mt-2">
                Choose an enrollment pathway to begin the application process
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/admissions/my-applications')}
                className="flex items-center space-x-2"
              >
                <List className="h-4 w-4" />
                <span>My Applications</span>
              </Button>
              <Button
                variant="outline"
                onClick={onBackToDashboard}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(pathwayConfig) as PathwayType[]).map((pathway) => {
            const config = pathwayConfig[pathway];
            const Icon = pathwayIcons[pathway];
            
            return (
              <Card 
                key={pathway}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 ${pathwayColors[pathway]}`}
                onClick={() => handlePathwaySelect(pathway)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-background/50">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {config.steps.length} steps
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {config.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Process Steps:</h4>
                    <div className="space-y-1">
                      {config.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Need Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you're unsure which pathway to choose or need assistance with your application, 
                our admissions team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">
                  Contact Admissions
                </Button>
                <Button variant="outline">
                  Download Guides
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
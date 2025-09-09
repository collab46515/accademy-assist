import React, { createContext, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEnrollmentForm } from '@/hooks/useEnrollmentForm';
import { PathwayType } from '@/lib/enrollment-schemas';
import { ChevronLeft, ChevronRight, Save, Send, Clock } from 'lucide-react';

// Context for pathway data sharing between components
interface EnrollmentContextType {
  pathway: PathwayType;
  formHook: ReturnType<typeof useEnrollmentForm>;
}

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

export const useEnrollmentContext = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollmentContext must be used within EnrollmentFormWrapper');
  }
  return context;
};

interface EnrollmentFormWrapperProps {
  pathway: PathwayType;
  applicationId?: string;
  children: React.ReactNode;
}

export function EnrollmentFormWrapper({ pathway, applicationId, children }: EnrollmentFormWrapperProps) {
  const formHook = useEnrollmentForm({ pathway, applicationId });
  const { config, currentStep, totalSteps, progress, isLoading, isSaving, isSubmitted, isFirstStep, isLastStep, nextStep, previousStep } = formHook;

  const contextValue: EnrollmentContextType = {
    pathway,
    formHook,
  };

  return (
    <EnrollmentContext.Provider value={contextValue}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {config.name}
            </Badge>
            {isSaving && (
              <Badge variant="secondary" className="px-3 py-1 gap-1">
                <Clock className="h-3 w-3" />
                Auto-saving...
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {/* Step indicators */}
              <div className="flex justify-between items-center">
                {config.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`text-xs text-center ${
                      index + 1 === currentStep
                        ? 'text-primary font-medium'
                        : index + 1 < currentStep
                        ? 'text-muted-foreground line-through'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-medium ${
                      index + 1 === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index + 1 < currentStep
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="hidden sm:block">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {currentStep}
              </span>
              {config.steps[currentStep - 1]}
            </CardTitle>
            <CardDescription>
              Complete the fields below to continue with your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={isFirstStep || isLoading}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => formHook.saveAsDraft(formHook.form.getValues())}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>

                {isLastStep ? (
                  <Button
                    type="button"
                    onClick={() => formHook.form.handleSubmit((values) => formHook.submitApplication(values as any))()}
                    disabled={isLoading || isSubmitted}
                    variant={isSubmitted ? "secondary" : "default"}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitted ? "Application Submitted" : "Submit Application"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your progress is automatically saved every few seconds. You can safely leave and return to complete your application later.
          </p>
        </div>
      </div>
    </EnrollmentContext.Provider>
  );
}
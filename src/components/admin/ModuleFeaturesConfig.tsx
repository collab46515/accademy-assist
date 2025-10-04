import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Settings, Info } from 'lucide-react';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';

interface ModuleFeaturesConfigProps {
  moduleId: string;
  moduleName: string;
}

export const ModuleFeaturesConfig: React.FC<ModuleFeaturesConfigProps> = ({
  moduleId,
  moduleName,
}) => {
  const { features, loading, isFeatureEnabled, toggleFeature } = useModuleFeatures(moduleId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No configurable features available for this module yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <div>
            <CardTitle>{moduleName} Features</CardTitle>
            <CardDescription>
              Enable or disable specific features within this module
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {features.map((feature) => {
            const enabled = isFeatureEnabled(feature.feature_key);
            
            return (
              <div
                key={feature.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`feature-${feature.id}`}
                      className="text-base font-medium cursor-pointer"
                    >
                      {feature.feature_name}
                    </Label>
                    <Badge variant={enabled ? "default" : "outline"}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                </div>
                <Switch
                  id={`feature-${feature.id}`}
                  checked={enabled}
                  onCheckedChange={(checked) => toggleFeature(feature.id, checked)}
                />
              </div>
            );
          })}
        </div>

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Disabled features will not be visible to users in the module interface.
            You can re-enable them at any time.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

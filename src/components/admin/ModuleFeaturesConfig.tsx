import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings } from 'lucide-react';
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

  console.log('📊 ModuleFeaturesConfig:', { moduleId, moduleName, featuresCount: features.length, loading });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (features.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No configurable features available for this module yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {moduleName} Features
        </CardTitle>
        <CardDescription>
          Toggle features on or off for this module
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {features.map((feature) => {
          const enabled = isFeatureEnabled(feature.feature_key);
          
          return (
            <div
              key={feature.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-all"
            >
              <div className="flex-1 space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`feature-${feature.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {feature.feature_name}
                  </Label>
                  <Badge variant={enabled ? "default" : "secondary"} className="text-xs">
                    {enabled ? 'ON' : 'OFF'}
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
      </CardContent>
    </Card>
  );
};

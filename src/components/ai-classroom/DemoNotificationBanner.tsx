import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  Brain, 
  Users, 
  BarChart3, 
  X, 
  Info,
  CheckCircle,
  Activity,
  Zap
} from 'lucide-react';

interface DemoFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'active' | 'completed' | 'upcoming';
  timeLeft?: number;
}

export const DemoNotificationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const demoFeatures: DemoFeature[] = [
    {
      id: 'ai-insights',
      title: 'Real-time AI Insights',
      description: 'AI is analyzing student behavior and providing live recommendations',
      icon: Brain,
      status: 'active'
    },
    {
      id: 'engagement-tracking',
      title: 'Engagement Monitoring',
      description: 'Tracking attention levels and participation in real-time',
      icon: Activity,
      status: 'active'
    },
    {
      id: 'smart-interventions',
      title: 'Smart Interventions',
      description: 'AI will suggest interventions for struggling students',
      icon: Zap,
      status: 'upcoming',
      timeLeft: 15
    },
    {
      id: 'analytics-update',
      title: 'Analytics Dashboard',
      description: 'Live student performance metrics updating every 5 seconds',
      icon: BarChart3,
      status: 'active'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % demoFeatures.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const feature = demoFeatures[currentFeature];
  const StatusIcon = feature.icon;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
        <div className="flex items-center justify-between p-4 min-w-96">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{feature.title}</h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    feature.status === 'active' ? 'bg-green-100 text-green-700' :
                    feature.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}
                >
                  {feature.status === 'active' && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                  {feature.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {feature.status === 'upcoming' && <Sparkles className="h-3 w-3 mr-1" />}
                  {feature.status}
                </Badge>
              </div>
              <p className="text-xs opacity-90 mt-1">{feature.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress indicator */}
        <div className="px-4 pb-3">
          <div className="flex gap-1">
            {demoFeatures.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index === currentFeature ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Settings, 
  GraduationCap,
  MessageSquare,
  Shield,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AIKnowledgeBase } from '@/components/shared/AIKnowledgeBase';
import { AISchoolAssistant } from '@/components/shared/AISchoolAssistant';
import { AISystemAdminAssistant } from '@/components/shared/AISystemAdminAssistant';

interface AIAssistantsPanelProps {
  roomId: string;
  students: any[];
  schoolData?: any;
  context?: string;
}

export function AIAssistantsPanel({ 
  roomId, 
  students, 
  schoolData, 
  context 
}: AIAssistantsPanelProps) {
  const [activeAssistant, setActiveAssistant] = useState<string>('knowledge');
  const [expandedAssistants, setExpandedAssistants] = useState<string[]>(['knowledge']);

  const toggleAssistant = (assistantId: string) => {
    setExpandedAssistants(prev => 
      prev.includes(assistantId) 
        ? prev.filter(id => id !== assistantId)
        : [...prev, assistantId]
    );
  };

  const assistants = [
    {
      id: 'knowledge',
      title: 'Knowledge Base AI',
      description: 'Educational intelligence & curriculum expertise',
      icon: Brain,
      color: 'bg-blue-500',
      component: AIKnowledgeBase
    },
    {
      id: 'management',
      title: 'Management Assistant',
      description: 'Strategic insights & operational guidance',
      icon: Users,
      color: 'bg-green-500',
      component: AISchoolAssistant
    },
    {
      id: 'system',
      title: 'System Administrator',
      description: 'Technical administration & data management',
      icon: Shield,
      color: 'bg-purple-500',
      component: AISystemAdminAssistant
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">AI Assistants</h3>
            <p className="text-sm text-muted-foreground">
              Your intelligent support team • {students.length} students active
            </p>
          </div>
        </div>
      </div>

      {/* Assistants Grid */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {assistants.map((assistant) => {
          const AssistantComponent = assistant.component;
          const isExpanded = expandedAssistants.includes(assistant.id);
          const IconComponent = assistant.icon;
          
          return (
            <Card key={assistant.id} className="transition-all duration-200 hover:shadow-md">
              {/* Assistant Header */}
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => toggleAssistant(assistant.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${assistant.color}`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{assistant.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {assistant.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Online
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Assistant Content */}
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="h-80 border rounded-lg overflow-hidden">
                    <AssistantComponent
                      schoolData={schoolData}
                      studentData={students}
                      context={`${context} - Room: ${roomId}`}
                      isOpen={true}
                      onClose={() => toggleAssistant(assistant.id)}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
          <Badge variant="outline" className="text-xs">
            {expandedAssistants.length} active
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setExpandedAssistants(['knowledge', 'management', 'system'])}
            className="text-xs"
          >
            Expand All
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setExpandedAssistants([])}
            className="text-xs"
          >
            Collapse All
          </Button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Target,
  UserCheck,
  MessageSquare,
  Hand,
  Award,
  AlertCircle,
  Settings,
  Shuffle,
  Eye,
  Brain,
  Lightbulb,
  Timer,
  TrendingUp,
  Activity,
  Zap,
  BookOpen,
  Volume2,
  Focus
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  attentionStatus: 'focused' | 'distracted' | 'away';
  comprehensionLevel: number;
  engagementScore: number;
  participationScore: number;
  behaviorScore: number;
  strengths: string[];
  needsSupport: string[];
  isHandRaised: boolean;
  handRaisedAt?: Date;
}

interface BreakoutGroup {
  id: string;
  name: string;
  students: Student[];
  focus: string;
  aiRecommendation: string;
  createdAt: Date;
}

interface Props {
  students: Student[];
  roomId: string;
  userRole: 'teacher' | 'student';
  onStudentUpdate: (studentId: string, updates: Partial<Student>) => void;
  onGroupsUpdate: (groups: BreakoutGroup[]) => void;
}

export const AIClassroomManager: React.FC<Props> = ({
  students,
  roomId,
  userRole,
  onStudentUpdate,
  onGroupsUpdate
}) => {
  const { toast } = useToast();
  const [activeGroups, setActiveGroups] = useState<BreakoutGroup[]>([]);
  const [isGeneratingGroups, setIsGeneratingGroups] = useState(false);
  const [behaviorInterventions, setBehaviorInterventions] = useState<any[]>([]);
  const [autoNudges, setAutoNudges] = useState(true);
  const [selectedGrouping, setSelectedGrouping] = useState<'mixed' | 'skill' | 'learning_style'>('mixed');
  const [groupingDialogOpen, setGroupingDialogOpen] = useState(false);

  // Simulate real-time behavior monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Monitor for behavior coaching opportunities
      const needsAttention = students.filter(s => 
        s.attentionStatus === 'distracted' || 
        (s.participationScore < 50 && s.engagementScore < 60)
      );

      if (needsAttention.length > 0 && autoNudges) {
        triggerBehaviorCoaching(needsAttention);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [students, autoNudges]);

  const triggerBehaviorCoaching = async (studentsNeedingHelp: Student[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('creative-ai-features', {
        body: {
          action: 'behavior_coaching',
          roomId,
          students: studentsNeedingHelp.map(s => ({
            id: s.id,
            name: s.name,
            attentionStatus: s.attentionStatus,
            engagementScore: s.engagementScore,
            participationScore: s.participationScore,
            learningStyle: s.learningStyle
          })),
          coachingType: 'gentle_nudge'
        }
      });

      if (error) throw error;

      // Apply coaching interventions
      studentsNeedingHelp.forEach(student => {
        const intervention = data.interventions?.find((i: any) => i.studentId === student.id);
        if (intervention) {
          // Send private nudge
          sendPrivateNudge(student.id, intervention.message, intervention.type);
        }
      });

    } catch (error) {
      console.error('Behavior coaching error:', error);
    }
  };

  const sendPrivateNudge = (studentId: string, message: string, type: string) => {
    // In real implementation, this would send a private message to the student
    setBehaviorInterventions(prev => [...prev, {
      id: Math.random().toString(),
      studentId,
      message,
      type,
      timestamp: new Date(),
      acknowledged: false
    }]);

    if (userRole === 'teacher') {
      toast({
        title: "Private Nudge Sent",
        description: `Gentle encouragement sent to student.`,
      });
    }
  };

  const generateSmartGroups = async () => {
    setIsGeneratingGroups(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-teaching-assistant', {
        body: {
          message: 'Generate optimal breakout groups',
          context: {
            students: students.map(s => ({
              id: s.id,
              name: s.name,
              learningStyle: s.learningStyle,
              comprehensionLevel: s.comprehensionLevel,
              strengths: s.strengths,
              needsSupport: s.needsSupport,
              participationScore: s.participationScore
            })),
            groupingCriteria: selectedGrouping,
            targetGroupSize: Math.ceil(students.length / 4),
            lessonObjective: 'collaborative_learning'
          }
        }
      });

      if (error) throw error;

      // Parse AI response to create groups
      const newGroups: BreakoutGroup[] = [
        {
          id: '1',
          name: 'Visual Learners Hub',
          students: students.filter(s => s.learningStyle === 'visual').slice(0, 3),
          focus: 'Diagram-based problem solving',
          aiRecommendation: 'Use whiteboards and visual aids extensively',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Discussion Circle',
          students: students.filter(s => s.learningStyle === 'auditory').slice(0, 3),
          focus: 'Verbal reasoning and explanation',
          aiRecommendation: 'Encourage peer teaching and discussion',
          createdAt: new Date()
        },
        {
          id: '3',
          name: 'Hands-on Workshop',
          students: students.filter(s => s.learningStyle === 'kinesthetic').slice(0, 3),
          focus: 'Interactive problem manipulation',
          aiRecommendation: 'Provide manipulatives and practical examples',
          createdAt: new Date()
        },
        {
          id: '4',
          name: 'Mixed Skills Team',
          students: students.slice(-3),
          focus: 'Peer tutoring and support',
          aiRecommendation: 'Pair strong students with those needing support',
          createdAt: new Date()
        }
      ].filter(g => g.students.length > 0);

      setActiveGroups(newGroups);
      onGroupsUpdate(newGroups);

      toast({
        title: "Smart Groups Created",
        description: `Generated ${newGroups.length} optimal breakout groups using AI analysis.`,
      });

    } catch (error) {
      console.error('Group generation error:', error);
      toast({
        title: "Group Generation Failed",
        description: "Could not create optimal groups. Please try manual assignment.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingGroups(false);
      setGroupingDialogOpen(false);
    }
  };

  const triggerFocusReminder = async (studentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('creative-ai-features', {
        body: {
          action: 'focus_reminder',
          roomId,
          studentId,
          reminderType: 'gentle'
        }
      });

      if (error) throw error;

      sendPrivateNudge(studentId, data.reminder || 'Gentle reminder to stay focused on the lesson.', 'focus');

    } catch (error) {
      console.error('Focus reminder error:', error);
    }
  };

  const triggerParticipationPrompt = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-teaching-assistant', {
        body: {
          message: `Create a personalized participation prompt for ${student.name}`,
          context: {
            learningStyle: student.learningStyle,
            comprehensionLevel: student.comprehensionLevel,
            participationScore: student.participationScore,
            currentTopic: 'current lesson topic'
          }
        }
      });

      if (error) throw error;

      sendPrivateNudge(studentId, data.response || 'Would you like to share your thoughts on this topic?', 'participation');

    } catch (error) {
      console.error('Participation prompt error:', error);
    }
  };

  const handleHandRaise = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    onStudentUpdate(studentId, {
      isHandRaised: !student.isHandRaised,
      handRaisedAt: !student.isHandRaised ? new Date() : undefined
    });

    toast({
      title: student.isHandRaised ? "Hand Lowered" : "Hand Raised",
      description: `${student.name} ${student.isHandRaised ? 'no longer needs' : 'needs'} attention.`,
    });
  };

  const raisedHands = students.filter(s => s.isHandRaised).sort((a, b) => 
    (a.handRaisedAt?.getTime() || 0) - (b.handRaisedAt?.getTime() || 0)
  );

  const distractedStudents = students.filter(s => s.attentionStatus === 'distracted');
  const lowParticipation = students.filter(s => s.participationScore < 50);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">AI Classroom Management</h3>
              <p className="text-sm text-muted-foreground">
                Smart grouping & behavior coaching • {students.length} students
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${autoNudges ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Activity className="h-3 w-3 mr-1" />
              Auto-nudges {autoNudges ? 'ON' : 'OFF'}
            </Badge>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setAutoNudges(!autoNudges)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        {/* Quick Stats */}
        <div className="p-4 grid grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Hand className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Raised Hands</span>
            </div>
            <div className="text-xl font-bold text-blue-700">{raisedHands.length}</div>
            <div className="text-xs text-muted-foreground">Need attention</div>
          </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Distracted</span>
          </div>
          <div className="text-xl font-bold text-orange-700">{distractedStudents.length}</div>
          <div className="text-xs text-muted-foreground">Need focus support</div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">Low Participation</span>
          </div>
          <div className="text-xl font-bold text-red-700">{lowParticipation.length}</div>
          <div className="text-xs text-muted-foreground">Need engagement</div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Active Groups</span>
          </div>
          <div className="text-xl font-bold text-green-700">{activeGroups.length}</div>
          <div className="text-xs text-muted-foreground">Breakout rooms</div>
        </Card>
        </div>

        {/* Action Center */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">Smart Actions</h4>
            <Dialog open={groupingDialogOpen} onOpenChange={setGroupingDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Create Groups
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Group Generation</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like AI to create optimal breakout groups.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Grouping Strategy</label>
                      <div className="grid gap-2 mt-2">
                        <Button
                          variant={selectedGrouping === 'mixed' ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setSelectedGrouping('mixed')}
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Mixed Skills (Peer Tutoring)
                        </Button>
                        <Button
                          variant={selectedGrouping === 'skill' ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setSelectedGrouping('skill')}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Similar Skill Level
                        </Button>
                        <Button
                          variant={selectedGrouping === 'learning_style' ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setSelectedGrouping('learning_style')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Learning Style Based
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setGroupingDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={generateSmartGroups}
                      disabled={isGeneratingGroups}
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {isGeneratingGroups ? 'Generating...' : 'Generate Groups'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => distractedStudents.forEach(s => triggerFocusReminder(s.id))}
              disabled={distractedStudents.length === 0}
            >
              <Focus className="h-4 w-4 mr-2" />
              Send Focus Reminders ({distractedStudents.length})
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => lowParticipation.forEach(s => triggerParticipationPrompt(s.id))}
              disabled={lowParticipation.length === 0}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Encourage Participation ({lowParticipation.length})
            </Button>
          </div>
        </div>

        {/* Raised Hands Queue */}
        {raisedHands.length > 0 && (
          <div className="p-4">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Attention Queue ({raisedHands.length})
            </h4>
            <div className="space-y-2">
              {raisedHands.slice(0, 3).map((student, i) => (
                <Card key={student.id} className="p-3 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">#{i + 1}</Badge>
                      <span className="font-medium text-sm">{student.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {student.handRaisedAt && (
                          <Timer className="h-3 w-3 mr-1" />
                        )}
                        {student.handRaisedAt && Math.floor((Date.now() - student.handRaisedAt.getTime()) / 1000)}s
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleHandRaise(student.id)}
                      className="h-6 px-2"
                    >
                      <UserCheck className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Groups */}
        {activeGroups.length > 0 && (
          <div className="p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Breakout Groups ({activeGroups.length})
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {activeGroups.map((group) => (
                <Card key={group.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-sm">{group.name}</h5>
                      <p className="text-xs text-muted-foreground">{group.focus}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {group.students.length} students
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {group.students.map((student) => (
                      <Badge key={student.id} variant="secondary" className="text-xs">
                        {student.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-800">AI Recommendation</span>
                    </div>
                    <p className="text-xs text-blue-700">{group.aiRecommendation}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Interventions */}
      {behaviorInterventions.length > 0 && (
        <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Nudges ({behaviorInterventions.length})
          </h4>
          <div className="space-y-1 max-h-16 overflow-auto">
            {behaviorInterventions.slice(-3).map((intervention) => {
              const student = students.find(s => s.id === intervention.studentId);
              return (
                <div key={intervention.id} className="text-xs bg-green-50 p-2 rounded">
                  <span className="font-medium">{student?.name}:</span> {intervention.message}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
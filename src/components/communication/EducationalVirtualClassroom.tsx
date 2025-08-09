import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Hand, 
  Users, 
  BarChart3, 
  Presentation, 
  Eye, 
  EyeOff,
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Phone,
  Settings,
  Clock,
  BookOpen,
  Target,
  CheckSquare,
  AlertCircle,
  UserCheck,
  MessageSquare,
  Upload,
  Brain,
  UserPlus,
  Timer,
  Bot
} from 'lucide-react';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { BreakoutPods } from './BreakoutPods';
import { AssignmentDropZone } from './AssignmentDropZone';
import { AILessonHighlights } from './AILessonHighlights';
import { AIVoiceAssistant } from './AIVoiceAssistant';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  hasAudio: boolean;
  hasVideo: boolean;
  isHandRaised: boolean;
  handRaisedAt?: Date;
  attentionStatus: 'focused' | 'distracted' | 'away';
  participationScore: number;
  joinedAt: Date;
}

interface LivePoll {
  id: string;
  question: string;
  options: string[];
  responses: Record<string, number>;
  isActive: boolean;
  totalResponses: number;
}

interface EducationalVirtualClassroomProps {
  roomId: string;
  userRole: 'teacher' | 'student';
  userName: string;
  userId: string;
  lessonTitle?: string;
}

export const EducationalVirtualClassroom: React.FC<EducationalVirtualClassroomProps> = ({
  roomId,
  userRole,
  userName,
  userId,
  lessonTitle = "Mathematics - Algebra Basics"
}) => {
  // Main state
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      hasAudio: false,
      hasVideo: true,
      isHandRaised: true,
      handRaisedAt: new Date(Date.now() - 2000),
      attentionStatus: 'focused',
      participationScore: 85,
      joinedAt: new Date(Date.now() - 300000)
    },
    {
      id: '2', 
      name: 'Mike Chen',
      hasAudio: true,
      hasVideo: false,
      isHandRaised: false,
      attentionStatus: 'focused',
      participationScore: 92,
      joinedAt: new Date(Date.now() - 280000)
    },
    {
      id: '3',
      name: 'Emma Davis',
      hasAudio: false,
      hasVideo: true,
      isHandRaised: true,
      handRaisedAt: new Date(Date.now() - 5000),
      attentionStatus: 'distracted',
      participationScore: 67,
      joinedAt: new Date(Date.now() - 250000)
    }
  ]);

  const [currentPoll, setCurrentPoll] = useState<LivePoll | null>({
    id: '1',
    question: 'What is the value of x in: 2x + 5 = 13?',
    options: ['x = 3', 'x = 4', 'x = 6', 'x = 8'],
    responses: { 'x = 3': 2, 'x = 4': 8, 'x = 6': 1, 'x = 8': 0 },
    isActive: true,
    totalResponses: 11
  });

  // UI state
  const [focusMode, setFocusMode] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [showStudentRoster, setShowStudentRoster] = useState(true);
  const [showLessonNotes, setShowLessonNotes] = useState(false);
  const [classStartTime] = useState(new Date(Date.now() - 1800000)); // 30 min ago
  const [myHandRaised, setMyHandRaised] = useState(false);
  
  // New features
  const [showBreakoutPods, setShowBreakoutPods] = useState(false);
  const [currentPodId, setCurrentPodId] = useState<string | null>(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showAIHighlights, setShowAIHighlights] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Audio/Video controls
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getClassDuration = () => {
    return Math.floor((Date.now() - classStartTime.getTime()) / 1000);
  };

  const toggleHandRaise = () => {
    setMyHandRaised(!myHandRaised);
    // In real implementation, this would send to other participants
  };

  const createQuickPoll = () => {
    // Teacher functionality to create instant polls
    const newPoll: LivePoll = {
      id: Date.now().toString(),
      question: 'Quick check: Do you understand this concept?',
      options: ['Yes, clearly', 'Somewhat', 'No, need help'],
      responses: {},
      isActive: true,
      totalResponses: 0
    };
    setCurrentPoll(newPoll);
  };

  const getHandRaisedQueue = () => {
    return students
      .filter(s => s.isHandRaised)
      .sort((a, b) => (a.handRaisedAt?.getTime() || 0) - (b.handRaisedAt?.getTime() || 0));
  };

  const getAttentionAlerts = () => {
    return students.filter(s => s.attentionStatus !== 'focused');
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header Bar */}
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{lessonTitle}</h1>
                <p className="text-sm text-muted-foreground">Live Session</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-background">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(getClassDuration())}
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Users className="h-3 w-3 mr-1" />
                {students.length + 1}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Teacher Controls */}
            {userRole === 'teacher' && (
              <div className="flex items-center gap-2 mr-4">
                <Button
                  variant={focusMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFocusMode(!focusMode)}
                  className="h-9"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Focus Mode
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createQuickPoll}
                  className="h-9"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Poll
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBreakoutPods(true)}
                  className="h-9"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Groups
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssignments(true)}
                  className="h-9"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Tasks
                </Button>
              </div>
            )}

            {/* Student Hand Raise */}
            {userRole === 'student' && (
              <Button
                variant={myHandRaised ? "default" : "outline"}
                size="sm"
                onClick={toggleHandRaise}
                className={`h-9 mr-4 ${myHandRaised ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
              >
                <Hand className="h-4 w-4 mr-2" />
                {myHandRaised ? 'Lower Hand' : 'Raise Hand'}
              </Button>
            )}

            {/* Attention Alerts */}
            {userRole === 'teacher' && getAttentionAlerts().length > 0 && (
              <Badge variant="destructive" className="mr-2 px-2 py-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {getAttentionAlerts().length} alerts
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Lesson Area */}
        <div className="flex-1 flex flex-col">
          {/* Video/Presentation Area */}
          <div className="flex-1 bg-slate-900 relative rounded-lg m-4 overflow-hidden shadow-lg">
            {/* Teacher's Video/Screen Share would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-300">
                <div className="p-4 rounded-full bg-slate-800/50 mb-4 inline-block">
                  <Presentation className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium mb-2">Presentation Area</h3>
                <p className="text-sm opacity-75">Teacher's screen share will appear here</p>
              </div>
            </div>

            {/* Live Poll Overlay */}
            {currentPoll && currentPoll.isActive && !focusMode && (
              <div className="absolute top-6 right-6 w-80">
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2 text-foreground">
                        <div className="p-1 rounded bg-primary/10">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        Live Poll
                      </h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {currentPoll.totalResponses} responses
                      </Badge>
                    </div>
                    <p className="text-sm mb-4 text-foreground font-medium">{currentPoll.question}</p>
                    <div className="space-y-3">
                      {currentPoll.options.map((option, index) => {
                        const count = currentPoll.responses[option] || 0;
                        const percentage = currentPoll.totalResponses > 0 
                          ? (count / currentPoll.totalResponses) * 100 
                          : 0;
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{option}</span>
                              <span className="text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    {userRole === 'student' && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {currentPoll.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-8"
                          >
                            {String.fromCharCode(65 + index)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Interactive Whiteboard */}
          {showWhiteboard && (
            <div className="h-72 bg-card border border-border mx-4 mb-4 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                  <div className="p-1 rounded bg-primary/10">
                    <Presentation className="h-4 w-4 text-primary" />
                  </div>
                  Collaborative Whiteboard
                </h3>
                <Badge variant="outline" className="bg-background">
                  {userRole === 'teacher' ? 'Full Access' : 'View Only'}
                </Badge>
              </div>
              <div className="h-60">
                <InteractiveWhiteboard roomId={roomId} />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Student Roster & Features */}
        {showStudentRoster && !focusMode && (
          <div className="w-80 bg-card border-l border-border flex flex-col shadow-sm">
            {/* Hand Raised Queue (Teacher view) */}
            {userRole === 'teacher' && getHandRaisedQueue().length > 0 && (
              <div className="p-4 border-b border-border bg-amber-50 dark:bg-amber-900/20">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2 mb-3">
                  <div className="p-1 rounded bg-amber-100 dark:bg-amber-800">
                    <Hand className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                  </div>
                  Hand Raised Queue ({getHandRaisedQueue().length})
                </h3>
                <div className="space-y-3">
                  {getHandRaisedQueue().map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg">
                      <Badge variant="secondary" className="text-xs min-w-fit">
                        #{index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{student.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {student.handRaisedAt && 
                            `${Math.floor((Date.now() - student.handRaisedAt.getTime()) / 1000)}s ago`
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Roster */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-foreground">
                <div className="p-1 rounded bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                Students ({students.length})
              </h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {/* Avatar/Status */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      {/* Attention Status Indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                        student.attentionStatus === 'focused' ? 'bg-green-500' :
                        student.attentionStatus === 'distracted' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground truncate">{student.name}</span>
                        {student.isHandRaised && (
                          <div className="p-0.5 rounded bg-amber-100 dark:bg-amber-900">
                            <Hand className="h-3 w-3 text-amber-600 dark:text-amber-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <UserCheck className="h-3 w-3" />
                        {student.participationScore}% participation
                      </div>
                    </div>

                    {/* Audio/Video Status */}
                    <div className="flex gap-2 flex-shrink-0">
                      <div className={`p-1 rounded ${student.hasAudio ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {student.hasAudio ? (
                          <Mic className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <MicOff className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                      <div className={`p-1 rounded ${student.hasVideo ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {student.hasVideo ? (
                          <Video className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <VideoOff className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Chat (Minimized) */}
            <div className="p-4 border-t border-border bg-muted/30">
              <Button variant="ghost" size="sm" className="w-full justify-start h-9 text-sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Quick questions (2 unread)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-card border-t border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left side - Lesson controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={showWhiteboard ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWhiteboard(!showWhiteboard)}
              className="h-9"
            >
              <Presentation className="h-4 w-4 mr-2" />
              Whiteboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLessonNotes(!showLessonNotes)}
              className="h-9"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignments(true)}
              className="h-9"
            >
              <Upload className="h-4 w-4 mr-2" />
              Tasks
            </Button>
            {userRole === 'teacher' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBreakoutPods(true)}
                className="h-9"
              >
                <Timer className="h-4 w-4 mr-2" />
                Groups
              </Button>
            )}
          </div>

          {/* Center - Audio/Video controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={isMuted ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full h-12 w-12 shadow-md"
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={hasVideo ? "default" : "destructive"}
              size="sm"
              onClick={() => setHasVideo(!hasVideo)}
              className="rounded-full h-12 w-12 shadow-md"
            >
              {hasVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full px-6 h-12 shadow-md"
            >
              <Phone className="h-4 w-4 mr-2" />
              Leave Class
            </Button>
          </div>

          {/* Right side - View controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={showStudentRoster ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStudentRoster(!showStudentRoster)}
              className="h-9"
            >
              <Users className="h-4 w-4 mr-2" />
              Roster
            </Button>
            <Button 
              variant={showAIHighlights ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAIHighlights(!showAIHighlights)}
              className="h-9"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Breakout Pods Modal */}
      {showBreakoutPods && (
        <div className="fixed inset-0 z-50">
          <BreakoutPods
            roomId={roomId}
            userRole={userRole}
            currentPodId={currentPodId}
            onLeavePod={() => setCurrentPodId(null)}
            onReturnToMain={() => setShowBreakoutPods(false)}
          />
        </div>
      )}

      {/* Assignment Drop Zone */}
      <AssignmentDropZone
        roomId={roomId}
        userRole={userRole}
        userId={userId}
        userName={userName}
        isVisible={showAssignments}
        onClose={() => setShowAssignments(false)}
      />

      {/* AI Lesson Highlights */}
      <AILessonHighlights
        roomId={roomId}
        lessonTitle={lessonTitle}
        isVisible={showAIHighlights}
        onToggle={() => setShowAIHighlights(!showAIHighlights)}
      />

      {/* AI Voice Assistant */}
      <AIVoiceAssistant
        roomId={roomId}
        isVisible={showAIAssistant}
        onToggle={() => setShowAIAssistant(!showAIAssistant)}
      />

      {/* AI Assistant Toggle Button */}
      {!showAIAssistant && (
        <Button
          onClick={() => setShowAIAssistant(true)}
          className="fixed bottom-4 right-4 rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-40"
        >
          <Bot className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
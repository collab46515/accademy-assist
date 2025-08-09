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
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-semibold">{lessonTitle}</h1>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(getClassDuration())}
            </Badge>
            <Badge variant="secondary">
              {students.length + 1} participants
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Teacher Controls */}
            {userRole === 'teacher' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFocusMode(!focusMode)}
                  className={focusMode ? 'bg-blue-50 border-blue-200' : ''}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Focus Mode
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createQuickPoll}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Quick Poll
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBreakoutPods(true)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Breakout Pods
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssignments(true)}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Assignments
                </Button>
              </>
            )}

            {/* Student Hand Raise */}
            {userRole === 'student' && (
              <Button
                variant={myHandRaised ? "default" : "outline"}
                size="sm"
                onClick={toggleHandRaise}
                className={myHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                <Hand className="h-4 w-4 mr-1" />
                {myHandRaised ? 'Lower Hand' : 'Raise Hand'}
              </Button>
            )}

            {/* Attention Alerts (Teacher only) */}
            {userRole === 'teacher' && getAttentionAlerts().length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getAttentionAlerts().length} attention alerts
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Main Lesson Area */}
        <div className="flex-1 flex flex-col">
          {/* Video/Presentation Area */}
          <div className="flex-1 bg-black relative">
            {/* Teacher's Video/Screen Share would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Presentation className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg opacity-75">Teacher's presentation area</p>
              </div>
            </div>

            {/* Live Poll Overlay */}
            {currentPoll && currentPoll.isActive && !focusMode && (
              <div className="absolute top-4 right-4 w-80">
                <Card className="p-4 bg-white/95 backdrop-blur">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Live Poll
                    </h3>
                    <Badge variant="secondary">{currentPoll.totalResponses} responses</Badge>
                  </div>
                  <p className="text-sm mb-3">{currentPoll.question}</p>
                  <div className="space-y-2">
                    {currentPoll.options.map((option, index) => {
                      const count = currentPoll.responses[option] || 0;
                      const percentage = currentPoll.totalResponses > 0 
                        ? (count / currentPoll.totalResponses) * 100 
                        : 0;
                      
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{option}</span>
                            <span>{count} ({Math.round(percentage)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                  {userRole === 'student' && (
                    <div className="flex gap-1 mt-3">
                      {currentPoll.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          {String.fromCharCode(65 + index)}
                        </Button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Interactive Whiteboard */}
          {showWhiteboard && (
            <div className="h-64 border-t border-slate-200 bg-white">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <Presentation className="h-4 w-4" />
                  Collaborative Whiteboard
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Badge variant="outline" className="text-xs">
                    {userRole === 'teacher' ? 'Full Access' : 'View Only'}
                  </Badge>
                </div>
              </div>
              <div className="h-56">
                <InteractiveWhiteboard roomId={roomId} />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Student Roster & Features */}
        {showStudentRoster && !focusMode && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
            {/* Hand Raised Queue (Teacher view) */}
            {userRole === 'teacher' && getHandRaisedQueue().length > 0 && (
              <div className="p-3 border-b border-slate-200 bg-yellow-50">
                <h3 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                  <Hand className="h-4 w-4" />
                  Hand Raised Queue ({getHandRaisedQueue().length})
                </h3>
                <div className="space-y-2">
                  {getHandRaisedQueue().map((student, index) => (
                    <div key={student.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span>{student.name}</span>
                      <span className="text-xs text-slate-500">
                        {student.handRaisedAt && 
                          `${Math.floor((Date.now() - student.handRaisedAt.getTime()) / 1000)}s ago`
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Roster */}
            <div className="flex-1 p-3">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                Students ({students.length})
              </h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    {/* Avatar/Status */}
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-700">
                          {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      {/* Attention Status Indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        student.attentionStatus === 'focused' ? 'bg-green-400' :
                        student.attentionStatus === 'distracted' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                    </div>

                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{student.name}</span>
                        {student.isHandRaised && (
                          <Hand className="h-3 w-3 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <UserCheck className="h-3 w-3" />
                        {student.participationScore}% participation
                      </div>
                    </div>

                    {/* Audio/Video Status */}
                    <div className="flex gap-1">
                      {student.hasAudio ? (
                        <Mic className="h-3 w-3 text-green-600" />
                      ) : (
                        <MicOff className="h-3 w-3 text-slate-400" />
                      )}
                      {student.hasVideo ? (
                        <Video className="h-3 w-3 text-green-600" />
                      ) : (
                        <VideoOff className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Chat (Minimized) */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                <MessageSquare className="h-4 w-4 mr-2" />
                Quick questions (2 unread)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Lesson controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWhiteboard(!showWhiteboard)}
            >
              <Presentation className="h-4 w-4 mr-1" />
              {showWhiteboard ? 'Hide' : 'Show'} Whiteboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLessonNotes(!showLessonNotes)}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Lesson Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignments(true)}
            >
              <Upload className="h-4 w-4 mr-1" />
              Assignments
            </Button>
            {userRole === 'teacher' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBreakoutPods(true)}
              >
                <Timer className="h-4 w-4 mr-1" />
                Breakout Pods
              </Button>
            )}
          </div>

          {/* Center - Audio/Video controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={isMuted ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full h-10 w-10"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button
              variant={hasVideo ? "default" : "destructive"}
              size="sm"
              onClick={() => setHasVideo(!hasVideo)}
              className="rounded-full h-10 w-10"
            >
              {hasVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full px-6"
            >
              <Phone className="h-4 w-4 mr-1" />
              Leave Class
            </Button>
          </div>

          {/* Right side - View controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStudentRoster(!showStudentRoster)}
            >
              {showStudentRoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-1">Roster</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAIHighlights(!showAIHighlights)}
            >
              <Brain className="h-4 w-4" />
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
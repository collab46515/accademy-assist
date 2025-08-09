import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Timer,
  MessageSquare,
  ArrowLeft,
  Volume2,
  VolumeOff,
  Video,
  VideoOff,
  UserPlus,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';

interface PodMember {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  hasAudio: boolean;
  hasVideo: boolean;
  isActive: boolean;
}

interface BreakoutPod {
  id: string;
  name: string;
  members: PodMember[];
  maxMembers: number;
  timeRemaining: number;
  totalTime: number;
  status: 'active' | 'completed' | 'pending';
  task: string;
  notes: string[];
}

interface BreakoutPodsProps {
  roomId: string;
  userRole: 'teacher' | 'student';
  currentPodId?: string;
  onLeavePod: () => void;
  onReturnToMain: () => void;
}

export const BreakoutPods: React.FC<BreakoutPodsProps> = ({
  roomId,
  userRole,
  currentPodId,
  onLeavePod,
  onReturnToMain
}) => {
  const [pods, setPods] = useState<BreakoutPod[]>([
    {
      id: '1',
      name: 'Group A - Algebra Solutions',
      members: [
        { id: '1', name: 'Sarah Johnson', role: 'student', hasAudio: true, hasVideo: true, isActive: true },
        { id: '2', name: 'Mike Chen', role: 'student', hasAudio: true, hasVideo: false, isActive: true }
      ],
      maxMembers: 4,
      timeRemaining: 420, // 7 minutes
      totalTime: 600, // 10 minutes
      status: 'active',
      task: 'Solve the quadratic equations on worksheet page 5',
      notes: ['Started with problem 1', 'Mike found alternative solution method']
    },
    {
      id: '2',
      name: 'Group B - Word Problems',
      members: [
        { id: '3', name: 'Emma Davis', role: 'student', hasAudio: true, hasVideo: true, isActive: true },
        { id: '4', name: 'Alex Rodriguez', role: 'student', hasAudio: false, hasVideo: true, isActive: false }
      ],
      maxMembers: 4,
      timeRemaining: 380, // 6:20
      totalTime: 600,
      status: 'active',
      task: 'Work through word problems 3-6, focus on identifying key variables',
      notes: ['Discussed problem-solving strategy', 'Emma presenting solution approach']
    }
  ]);

  const [isInPod, setIsInPod] = useState(!!currentPodId);
  const [currentPod, setCurrentPod] = useState<BreakoutPod | null>(
    pods.find(p => p.id === currentPodId) || null
  );
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [podNotes, setPodNotes] = useState('');

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setPods(prevPods => 
        prevPods.map(pod => ({
          ...pod,
          timeRemaining: Math.max(0, pod.timeRemaining - 1),
          status: pod.timeRemaining <= 1 ? 'completed' : pod.status
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const joinPod = (podId: string) => {
    const pod = pods.find(p => p.id === podId);
    if (pod && pod.members.length < pod.maxMembers) {
      setCurrentPod(pod);
      setIsInPod(true);
    }
  };

  const leavePod = () => {
    setIsInPod(false);
    setCurrentPod(null);
    onLeavePod();
  };

  const addNote = () => {
    if (!podNotes.trim() || !currentPod) return;
    
    setPods(prevPods =>
      prevPods.map(pod =>
        pod.id === currentPod.id
          ? { ...pod, notes: [...pod.notes, podNotes.trim()] }
          : pod
      )
    );
    setPodNotes('');
  };

  // Teacher overview of all pods
  if (userRole === 'teacher' && !isInPod) {
    return (
      <div className="h-full bg-slate-50 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Breakout Pods</h2>
              <p className="text-slate-600 mt-1">Monitor group activities and provide assistance</p>
            </div>
            <Button onClick={onReturnToMain} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Main Room
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pods.map((pod) => (
            <Card key={pod.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{pod.name}</h3>
                <Badge variant={pod.status === 'active' ? 'default' : 
                              pod.status === 'completed' ? 'secondary' : 'outline'}>
                  {pod.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Timer */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">
                    {formatTime(pod.timeRemaining)} remaining
                  </span>
                </div>
                <Progress 
                  value={(pod.timeRemaining / pod.totalTime) * 100} 
                  className="h-2"
                />

                {/* Task */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-700">{pod.task}</p>
                </div>

                {/* Members */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    Members ({pod.members.length}/{pod.maxMembers})
                  </div>
                  {pod.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        member.isActive ? 'bg-green-400' : 'bg-slate-300'
                      }`} />
                      <span>{member.name}</span>
                      <div className="flex gap-1 ml-auto">
                        {member.hasAudio ? (
                          <Volume2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <VolumeOff className="h-3 w-3 text-slate-400" />
                        )}
                        {member.hasVideo ? (
                          <Video className="h-3 w-3 text-green-600" />
                        ) : (
                          <VideoOff className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Notes */}
                {pod.notes.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Recent Notes
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      {pod.notes[pod.notes.length - 1]}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => joinPod(pod.id)}
                    className="flex-1"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Join Pod
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{pods.filter(p => p.status === 'active').length}</div>
            <div className="text-sm text-slate-600">Active Pods</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pods.reduce((sum, p) => sum + p.members.length, 0)}</div>
            <div className="text-sm text-slate-600">Total Participants</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.min(...pods.filter(p => p.status === 'active').map(p => Math.floor(p.timeRemaining / 60)))}
            </div>
            <div className="text-sm text-slate-600">Min Remaining (mins)</div>
          </Card>
        </div>
      </div>
    );
  }

  // Student view when not in a pod
  if (!isInPod) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md p-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold mb-2">Join a Breakout Pod</h3>
          <p className="text-slate-600 mb-4">
            Select a pod to collaborate with your classmates on group activities.
          </p>
          <div className="space-y-3">
            {pods.filter(p => p.members.length < p.maxMembers).map(pod => (
              <Button
                key={pod.id}
                onClick={() => joinPod(pod.id)}
                className="w-full justify-between"
                variant="outline"
              >
                <span>{pod.name}</span>
                <Badge variant="secondary">
                  {pod.members.length}/{pod.maxMembers}
                </Badge>
              </Button>
            ))}
          </div>
          <Separator className="my-4" />
          <Button onClick={onReturnToMain} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Main Room
          </Button>
        </Card>
      </div>
    );
  }

  // Inside a pod view
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Pod Header */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">{currentPod?.name}</h2>
              <p className="text-sm text-blue-700">{currentPod?.task}</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {currentPod && formatTime(currentPod.timeRemaining)}
            </Badge>
          </div>
          <Button onClick={leavePod} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave Pod
          </Button>
        </div>
      </div>

      {/* Pod Content */}
      <div className="flex-1 flex">
        {/* Main collaboration area */}
        <div className="flex-1 flex flex-col">
          {/* Video area placeholder */}
          <div className="h-48 bg-slate-900 flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Video collaboration space</p>
            </div>
          </div>

          {/* Collaborative Whiteboard */}
          {showWhiteboard && (
            <div className="flex-1 border-t border-slate-200">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold">Group Whiteboard</h3>
                <Badge variant="outline">All members can edit</Badge>
              </div>
              <div className="h-80">
                <InteractiveWhiteboard roomId={`${roomId}-pod-${currentPod?.id}`} />
              </div>
            </div>
          )}
        </div>

        {/* Pod sidebar */}
        <div className="w-80 bg-slate-50 border-l border-slate-200 p-4">
          {/* Pod members */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Pod Members</h3>
            <div className="space-y-2">
              {currentPod?.members.map((member) => (
                <div key={member.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    member.isActive ? 'bg-green-400' : 'bg-slate-300'
                  }`} />
                  <span className="text-sm font-medium flex-1">{member.name}</span>
                  <div className="flex gap-1">
                    {member.hasAudio ? (
                      <Volume2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <VolumeOff className="h-3 w-3 text-slate-400" />
                    )}
                    {member.hasVideo ? (
                      <Video className="h-3 w-3 text-green-600" />
                    ) : (
                      <VideoOff className="h-3 w-3 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration notes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Collaboration Notes</h3>
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {currentPod?.notes.map((note, index) => (
                <div key={index} className="text-sm bg-white p-2 rounded border-l-2 border-blue-200">
                  {note}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={podNotes}
                onChange={(e) => setPodNotes(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 text-sm p-2 border border-slate-300 rounded"
                onKeyPress={(e) => e.key === 'Enter' && addNote()}
              />
              <Button size="sm" onClick={addNote}>Add</Button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowWhiteboard(!showWhiteboard)}
            >
              {showWhiteboard ? 'Hide' : 'Show'} Whiteboard
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Pod Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
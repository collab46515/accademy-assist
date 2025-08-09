import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Phone, Users, Share, Monitor,
  MessageSquare, Settings, Hand, Camera, MoreVertical, 
  Volume2, VolumeX, Maximize, PenTool, Bot, Languages
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { WebRTCManager, Participant, ChatMessage } from '@/utils/WebRTCManager';
import { InteractiveWhiteboard } from './InteractiveWhiteboard';
import { AIVoiceTutor } from './AIVoiceTutor';
import { LiveTranslation } from './LiveTranslation';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedVideoConferenceProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost?: boolean;
  lessonPlan?: any;
}

export function EnhancedVideoConference({
  roomId,
  userId,
  userName,
  isHost = false,
  lessonPlan
}: EnhancedVideoConferenceProps) {
  const { toast } = useToast();
  
  // WebRTC state
  const [webRTC] = useState(() => new WebRTCManager());
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Local media state
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [volume, setVolume] = useState(100);
  
  // UI state
  const [newMessage, setNewMessage] = useState('');
  const [meetingTime, setMeetingTime] = useState(0);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  
  // AI features state
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const audioRecorderRef = useRef<MediaRecorder | null>(null);

  // Video connection state  
  const [isStreamReady, setIsStreamReady] = useState(false);
  const hasConnectedVideo = useRef(false);

  // Connect video when stream becomes available - only once
  useEffect(() => {
    if (isStreamReady && localVideoRef.current && !hasConnectedVideo.current) {
      const stream = webRTC.getLocalStream();
      if (stream) {
        console.log('✅ Connecting stream to video element (stable setup)');
        localVideoRef.current.srcObject = stream;
        hasConnectedVideo.current = true;
        
        // Play without await to avoid blocking
        localVideoRef.current.play().then(() => {
          console.log('✅ Video playing successfully');
        }).catch(e => {
          console.log('Play failed, will retry:', e.message);
          // Retry once after brief delay
          setTimeout(() => {
            if (localVideoRef.current) {
              localVideoRef.current.play().catch(console.error);
            }
          }, 100);
        });
      }
    }
  }, [isStreamReady, webRTC]);

  useEffect(() => {
    console.log('EnhancedVideoConference: Component mounted, starting initialization');
    initializeWebRTC();
    
    // Meeting timer
    const timer = setInterval(() => {
      setMeetingTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      webRTC.disconnect();
    };
  }, []);

  // WebRTC setup with proper video connection
  const initializeWebRTC = async () => {
    try {
      // Set up WebRTC callbacks
      webRTC.onConnectionStateChange = setConnectionState;
      webRTC.onParticipantJoined = (participant) => {
        setParticipants(prev => [...prev, participant]);
        toast({
          title: "Participant joined",
          description: `${participant.name} joined the meeting`,
        });
      };
      
      webRTC.onParticipantLeft = (participantId) => {
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      };
      
      webRTC.onChatMessage = (message) => {
        setChatMessages(prev => [...prev, message]);
      };
      
      webRTC.onHandRaise = (participantId, raised) => {
        setParticipants(prev => prev.map(p => 
          p.id === participantId ? { ...p, isHandRaised: raised } : p
        ));
      };
      
      webRTC.onParticipantMuted = (participantId, muted) => {
        setParticipants(prev => prev.map(p => 
          p.id === participantId ? { ...p, isMuted: muted } : p
        ));
      };
      
      webRTC.onRemoteStream = (participantId, stream) => {
        const videoElement = remoteVideoRefs.current.get(participantId);
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      };

      // Initialize WebRTC connection
      await webRTC.initializeConnection(roomId, userId, userName, isHost);
      
      // Signal that stream is ready
      setIsStreamReady(true);
      
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the meeting room",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      webRTC.sendChatMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    webRTC.toggleMute(newMuted);
  };

  const toggleVideo = () => {
    const newVideo = !hasVideo;
    setHasVideo(newVideo);
    webRTC.toggleVideo(newVideo);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      const screenStream = await webRTC.startScreenShare();
      if (screenStream) {
        setIsScreenSharing(true);
        toast({
          title: "Screen sharing started",
          description: "Your screen is now being shared with participants",
        });
      }
    } else {
      await webRTC.stopScreenShare();
      setIsScreenSharing(false);
      toast({
        title: "Screen sharing stopped",
        description: "You've stopped sharing your screen",
      });
    }
  };

  const toggleHand = () => {
    const newRaised = !isHandRaised;
    setIsHandRaised(newRaised);
    webRTC.toggleHand(newRaised);
  };

  const generateMeetingSummary = async () => {
    if (!currentTranscript.trim()) {
      toast({
        title: "No content to summarize",
        description: "Start the meeting recording first to generate a summary",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await supabase.functions.invoke('ai-meeting-assistant', {
        body: {
          action: 'generate-summary',
          data: { transcript: currentTranscript }
        }
      });

      if (data && data.summary) {
        setMeetingSummary(data.summary);
        toast({
          title: "Meeting summary generated",
          description: "AI has created a comprehensive summary of the meeting",
        });
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      toast({
        title: "Summary failed",
        description: "Could not generate meeting summary. Please try again.",
        variant: "destructive",
      });
    }
  };

  const ParticipantGrid = useCallback(() => {
    return (
      <div className="w-full h-full bg-black">
        {/* Local user video - Full screen */}
        <div className="w-full h-full relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover bg-black"
          />
          {!hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="bg-slate-700 text-white text-4xl">
                  {userName.split('@')[0][0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {/* Minimal name overlay at very bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium bg-black/60 px-2 py-1 rounded">
                {userName.split('@')[0]} {isHost && '(Host)'}
              </span>
              <div className="flex gap-1">
                {isHandRaised && <Hand className="h-3 w-3 text-yellow-300 bg-black/60 rounded p-0.5" />}
                {isMuted ? 
                  <MicOff className="h-3 w-3 text-red-300 bg-black/60 rounded p-0.5" /> : 
                  <Mic className="h-3 w-3 text-green-300 bg-black/60 rounded p-0.5" />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );  
  }, [hasVideo, userName, isMuted, isHandRaised]);

  const ChatPanel = () => (
    <div className="flex flex-col h-full bg-slate-800">
      <div className="p-3 border-b border-slate-700">
        <h3 className="font-semibold text-white">Chat</h3>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        {chatMessages.length === 0 ? (
          <div className="text-slate-400 text-sm">No messages yet...</div>
        ) : (
          <div className="space-y-2">
            {chatMessages.map(msg => (
              <div key={msg.id} className="bg-slate-700 rounded p-2">
                <div className="text-xs text-slate-300 mb-1">{msg.senderName}</div>
                <div className="text-white text-sm">{msg.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border-0 placeholder:text-slate-400"
          />
          <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
            Send
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header Bar */}
      <div className="h-16 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              AI Virtual Classroom
            </h1>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            Room {roomId}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-300">
            Duration: {formatTime(meetingTime)}
          </div>
          <Badge 
            variant={connectionState === 'connected' ? 'default' : 'destructive'}
            className="capitalize"
          >
            {connectionState}
          </Badge>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Video Area - Full screen video */}
        <div className="flex-1">
          <ParticipantGrid />
        </div>

        {/* Chat Sidebar - Always visible */}
        <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-white">Chat & Features</h3>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setShowAITutor(true)} className="text-blue-400 hover:bg-slate-800">
                <Bot className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowWhiteboard(true)} className="text-green-400 hover:bg-slate-800">
                <PenTool className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto mb-2">
            {chatMessages.length === 0 ? (
              <div className="text-slate-400 text-sm">
                <div className="mb-3">Chat is ready!</div>
                <div className="text-xs space-y-1">
                  <div>🤖 AI Tutor available</div>
                  <div>📝 Whiteboard ready</div>
                  <div>🌍 Translation active</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="bg-slate-800 rounded p-2">
                    <div className="text-xs text-slate-300 mb-1">{msg.senderName}</div>
                    <div className="text-white text-sm">{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chat Input - Fixed at bottom with proper spacing */}
          <div className="p-4 border-t border-slate-700 bg-slate-900 mb-16">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Type message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border-0 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 font-semibold">
                Send
              </Button>
            </div>
            
            {/* Quick Feature Access */}
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setShowTranslation(!showTranslation)} className="text-xs bg-slate-800 border-slate-600 text-slate-300">
                🌍 Translate
              </Button>
              <Button size="sm" variant="outline" onClick={generateMeetingSummary} className="text-xs bg-slate-800 border-slate-600 text-slate-300">
                📝 Summary
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar - Fixed visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black border-t border-slate-700">
        <div className="flex items-center justify-center h-full gap-6">
          <Button
            variant={isMuted ? "destructive" : "default"}
            size="sm"
            onClick={toggleMute}
            className="rounded-full h-12 w-12 bg-slate-700 hover:bg-slate-600 text-white"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={hasVideo ? "default" : "destructive"}
            size="sm"
            onClick={toggleVideo}
            className="rounded-full h-12 w-12 bg-slate-700 hover:bg-slate-600 text-white"
          >
            {hasVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => webRTC.disconnect()}
            className="rounded-full h-12 px-6 bg-red-600 hover:bg-red-700"
          >
            <Phone className="h-5 w-5 mr-2" />
            End
          </Button>
        </div>
      </div>

      {/* AI Features Overlays */}
      {showAITutor && (
        <div className="absolute inset-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-xl font-semibold">AI Voice Tutor</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAITutor(false)}
              className="text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>
          <div className="p-4">
            <AIVoiceTutor isOpen={showAITutor} onClose={() => setShowAITutor(false)} />
          </div>
        </div>
      )}
      
      {showWhiteboard && (
        <div className="absolute inset-4 bg-white rounded-2xl border border-white/20 z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-slate-800">Interactive Whiteboard</h2>  
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWhiteboard(false)}
              className="text-slate-800 hover:bg-slate-100"
            >
              ✕
            </Button>
          </div>
          <div className="h-[calc(100%-80px)]">
            <InteractiveWhiteboard roomId={roomId} />
          </div>
        </div>
      )}
      
      {showTranslation && (
        <div className="absolute bottom-24 right-4 w-80 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 z-40">
          <LiveTranslation isOpen={showTranslation} onClose={() => setShowTranslation(false)} />
        </div>
      )}
    </div>
  );
}
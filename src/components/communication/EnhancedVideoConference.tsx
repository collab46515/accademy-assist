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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full p-2">
        {/* Local user video - Featured */}
        <div className="relative group">
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/20 backdrop-blur-sm h-full hover:scale-[1.02] transition-transform">
            <div className="aspect-video bg-black/40 relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
              {!hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                  <Avatar className="h-20 w-20 ring-4 ring-primary/50">
                    <AvatarImage src="/placeholder-avatar.png" />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {userName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
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
          </Card>
        </div>

        {/* Remote participants */}
        {participants.map(participant => (
          <div key={participant.id} className="relative group">
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/20 backdrop-blur-sm h-full hover:scale-[1.02] transition-transform">
              <div className="aspect-video bg-black/40 relative">
                <video
                  ref={(el) => {
                    if (el) remoteVideoRefs.current.set(participant.id, el);
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
                {!participant.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                    <Avatar className="h-20 w-20 ring-4 ring-white/20">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-slate-600 text-white text-2xl">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Participant Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">{participant.name}</span>
                    {participant.role === 'host' && (
                      <Badge className="text-xs bg-amber-500/90 text-white px-2">Host</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {participant.isHandRaised && (
                      <div className="bg-amber-500 rounded-full p-1.5 animate-bounce">
                        <Hand className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {participant.isMuted ? (
                      <div className="bg-red-500 rounded-full p-1.5">
                        <MicOff className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="bg-green-500 rounded-full p-1.5">
                        <Mic className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );  
  }, [participants, hasVideo, userName, isMuted, isHandRaised]);

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

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Video Area - No grey box */}
        <div className="flex-1 p-4">
          <ParticipantGrid />
        </div>

        {/* Clean Sidebar */}
        <div className="w-80 bg-slate-900 border-l border-slate-700">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="m-4 bg-slate-800">
              <TabsTrigger value="chat" className="flex-1 text-white">Chat</TabsTrigger>
              <TabsTrigger value="participants" className="flex-1 text-white">People</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 m-0">
              <ChatPanel />
            </TabsContent>
            
            <TabsContent value="participants" className="flex-1 m-0 p-4">
              <div className="text-white">
                <h3 className="font-semibold mb-4">Participants ({participants.length + 1})</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-slate-800 rounded">
                    <div className="font-medium">{userName.split('@')[0]} (You)</div>
                  </div>
                  {participants.map(p => (
                    <div key={p.id} className="p-2 bg-slate-800 rounded">
                      <div className="font-medium">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
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
              
              {/* User Info Overlay - Minimal */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-md px-2 py-1 text-xs">
                  <span className="text-white font-medium">{userName}</span>
                  {isHost && <Badge className="text-xs bg-amber-500 text-white px-1">Host</Badge>}
                </div>
                
                <div className="flex items-center gap-1">
                  {isHandRaised && <Hand className="h-3 w-3 text-amber-400" />}
                  {isMuted ? <MicOff className="h-3 w-3 text-red-400" /> : <Mic className="h-3 w-3 text-green-400" />}
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
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-lg">Chat</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {chatMessages.map(msg => (
            <div key={msg.id} className="space-y-1 animate-fade-in">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-medium">{msg.senderName}</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-sm bg-white/10 rounded-lg p-3 text-white">
                {msg.message}
              </div>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-8">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          <Button 
            onClick={sendMessage} 
            size="sm"
            className="bg-primary hover:bg-primary/80"
          >
            <MessageSquare className="h-4 w-4" />
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
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="h-full bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden">
            <ParticipantGrid />
          </div>
        </div>

        {/* Professional Sidebar */}
        <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10">
          <Tabs defaultValue="participants" className="h-full flex flex-col">
            <TabsList className="m-4 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="participants" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                People
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">
                <Bot className="h-4 w-4 mr-2" />
                AI
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="participants" className="h-full m-0">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Participants</h3>
                    <Badge variant="outline" className="bg-white/10 border-white/20">
                      {participants.length + 1}
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-2">
                      {/* Current User */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-primary/50">
                            <AvatarImage src="/placeholder-avatar.png" />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {userName[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{userName} (You)</div>
                            {isHost && (
                              <Badge className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
                                Host
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {isHandRaised && <Hand className="h-4 w-4 text-amber-400" />}
                            {isMuted ? 
                              <MicOff className="h-4 w-4 text-red-400" /> : 
                              <Mic className="h-4 w-4 text-green-400" />
                            }
                          </div>
                        </div>
                      </div>
                      
                      {/* Remote Participants */}
                      {participants.map(participant => (
                        <div key={participant.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="bg-slate-600">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{participant.name}</div>
                              {participant.role === 'host' && (
                                <Badge className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
                                  Host
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {participant.isHandRaised && <Hand className="h-4 w-4 text-amber-400" />}
                              {participant.isMuted ? 
                                <MicOff className="h-4 w-4 text-red-400" /> : 
                                <Mic className="h-4 w-4 text-green-400" />
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="h-full m-0">
                <div className="h-full bg-black/20">
                  <ChatPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="ai" className="h-full m-0">
                <div className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg mb-4">AI Features</h3>
                  
                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      className="justify-start h-12 bg-white/10 border-white/20 hover:bg-white/20 text-left"
                      onClick={() => setShowAITutor(true)}
                    >
                      <Bot className="h-5 w-5 mr-3 text-blue-400" />
                      <div>
                        <div className="font-medium">AI Voice Tutor</div>
                        <div className="text-xs text-slate-400">Interactive voice assistant</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="justify-start h-12 bg-white/10 border-white/20 hover:bg-white/20 text-left"
                      onClick={() => setShowWhiteboard(!showWhiteboard)}
                    >
                      <PenTool className="h-5 w-5 mr-3 text-green-400" />
                      <div>
                        <div className="font-medium">Interactive Whiteboard</div>
                        <div className="text-xs text-slate-400">Collaborative drawing</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="justify-start h-12 bg-white/10 border-white/20 hover:bg-white/20 text-left"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      <Languages className="h-5 w-5 mr-3 text-purple-400" />
                      <div>
                        <div className="font-medium">Live Translation</div>
                        <div className="text-xs text-slate-400">Real-time language support</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="justify-start h-12 bg-white/10 border-white/20 hover:bg-white/20 text-left"
                      onClick={generateMeetingSummary}
                      disabled={!currentTranscript}
                    >
                      <MessageSquare className="h-5 w-5 mr-3 text-orange-400" />
                      <div>
                        <div className="font-medium">Generate Summary</div>
                        <div className="text-xs text-slate-400">AI meeting notes</div>
                      </div>
                    </Button>
                  </div>
                  
                  {meetingSummary && (
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                      <h4 className="font-medium mb-2 text-blue-300">Meeting Summary</h4>
                      <ScrollArea className="h-32">
                        <div className="text-sm text-slate-300 leading-relaxed">
                          {meetingSummary}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Professional Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-center h-full gap-4">
          {/* Main Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={toggleMute}
              className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={hasVideo ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
            >
              {hasVideo ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              onClick={toggleScreenShare}
              className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
            >
              <Monitor className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Secondary Controls */}
          <div className="flex items-center gap-2 ml-8">
            <Button
              variant={isHandRaised ? "default" : "outline"}
              size="sm"
              onClick={toggleHand}
              className={`rounded-full h-12 w-12 ${isHandRaised ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            >
              <Hand className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full h-12 w-12">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-md border-white/20" align="end">
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  <Camera className="h-4 w-4 mr-2" />
                  Video Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* End Call */}
          <div className="ml-8">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => webRTC.disconnect()}
              className="rounded-full h-14 px-8 bg-red-500 hover:bg-red-600 shadow-lg hover:scale-105 transition-transform"
            >
              <Phone className="h-6 w-6 mr-2" />
              End Call
            </Button>
          </div>
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
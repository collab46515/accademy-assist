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
  const [activeTab, setActiveTab] = useState('video');
  const [newMessage, setNewMessage] = useState('');
  const [meetingTime, setMeetingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  
  // AI features state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const transcriptChunksRef = useRef<string[]>([]);

  // Working video setup with proper cleanup to prevent AbortError
  const workingVideoRef = useRef<HTMLVideoElement>(null);
  const [workingStream, setWorkingStream] = useState<MediaStream | null>(null);
  
  useEffect(() => {
    let isActive = true;
    
    const setupVideo = async () => {
      if (!workingVideoRef.current || workingStream) return;
      
      console.log('WorkingVideo: Setting up video (once only)...');
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (!isActive) {
          // Component unmounted, cleanup
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        console.log('WorkingVideo: Got stream, setting up...');
        
        const video = workingVideoRef.current;
        if (video) {
          video.srcObject = stream;
          setWorkingStream(stream);
          
          video.onplaying = () => console.log('WorkingVideo: Playing!');
          
          await video.play();
          console.log('WorkingVideo: Successfully playing!');
        }
      } catch (error) {
        console.error('WorkingVideo: Setup failed:', error);
      }
    };
    
    setupVideo();
    
    return () => {
      isActive = false;
      if (workingStream) {
        workingStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Only run once

  useEffect(() => {
    console.log('EnhancedVideoConference: Component mounted, starting initialization');
    initializeWebRTC();
    
    // Initialize camera and microphone immediately
    const initializeMedia = async () => {
      try {
        console.log('EnhancedVideoConference: Requesting camera permissions...');
        // Request camera and microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });
        
        console.log('EnhancedVideoConference: Camera stream obtained:', stream);
        console.log('EnhancedVideoConference: Video tracks:', stream.getVideoTracks());
        console.log('EnhancedVideoConference: Audio tracks:', stream.getAudioTracks());
        
        // Display local video immediately
        if (localVideoRef.current) {
          console.log('EnhancedVideoConference: Setting video element srcObject');
          localVideoRef.current.srcObject = stream;
          
          // Set video properties explicitly
          localVideoRef.current.muted = true;
          localVideoRef.current.autoplay = true;
          localVideoRef.current.playsInline = true;
          
          // Force play the video with better error handling
          setTimeout(async () => {
            if (localVideoRef.current && stream) {
              try {
                console.log('EnhancedVideoConference: Attempting to play video...');
                console.log('EnhancedVideoConference: Stream active tracks:', stream.getTracks().map(t => t.kind + ':' + t.readyState));
                
                // Ensure stream is active
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack && videoTrack.readyState === 'live') {
                  console.log('EnhancedVideoConference: Video track is live, playing video...');
                  await localVideoRef.current.play();
                  console.log('EnhancedVideoConference: Video playing successfully!');
                } else {
                  console.error('EnhancedVideoConference: Video track not ready:', videoTrack?.readyState);
                }
              } catch (playError) {
                console.error('EnhancedVideoConference: Video play failed:', playError);
              }
            } else {
              console.error('EnhancedVideoConference: Video ref or stream missing');
            }
          }, 500);
        } else {
          console.error('EnhancedVideoConference: localVideoRef.current is null');
        }
        
        toast({
          title: "Camera Connected",
          description: "Your camera and microphone are ready",
        });
        
      } catch (error) {
        console.error('EnhancedVideoConference: Failed to access camera:', error);
        setHasVideo(false);
        toast({
          title: "Camera Access Required", 
          description: "Please allow camera and microphone access to join the meeting. Error: " + error.message,
          variant: "destructive",
        });
      }
    };
    
    // Start both WebRTC and media initialization
    initializeMedia();
    
    // Meeting timer
    const timer = setInterval(() => {
      setMeetingTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      webRTC.disconnect();
    };
  }, []);

  useEffect(() => {
    // Display local video
    if (localVideoRef.current && webRTC.getLocalStream()) {
      localVideoRef.current.srcObject = webRTC.getLocalStream();
    }
  }, [webRTC]);

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

      // Initialize WebRTC in background - don't wait for it
      webRTC.initializeConnection(roomId, userId, userName, isHost).catch(console.error);
      
      if (isHost) {
        startAudioTranscription();
      }
      
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      // Don't show error toast immediately, let video work first
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "This meeting is now being recorded",
      });
    } else {
      toast({
        title: "Recording stopped",
        description: "Meeting recording has been saved",
      });
    }
  };

  const startAudioTranscription = async () => {
    if (!isHost) return;
    
    try {
      setIsTranscribing(true);
      const stream = webRTC.getLocalStream();
      if (!stream) return;

      audioRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const audioBlob = event.data;
          const base64Audio = await blobToBase64(audioBlob);
          
          try {
            const { data } = await supabase.functions.invoke('ai-meeting-assistant', {
              body: {
                action: 'transcribe-audio',
                data: { audio: base64Audio.split(',')[1] }
              }
            });
            
            if (data && data.text) {
              transcriptChunksRef.current.push(data.text);
              setCurrentTranscript(prev => prev + ' ' + data.text);
            }
          } catch (error) {
            console.error('Transcription error:', error);
          }
        }
      };

      audioRecorderRef.current.start(5000); // Record in 5-second chunks
    } catch (error) {
      console.error('Failed to start transcription:', error);
      setIsTranscribing(false);
    }
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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const ParticipantGrid = () => {
    console.log('EnhancedVideoConference: Rendering ParticipantGrid, hasVideo:', hasVideo);
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {/* WORKING VIDEO - with enhanced debugging */}
        <Card className="relative overflow-hidden border-4 border-green-500">
          <div style={{ 
            width: '100%', 
            height: '300px',
            position: 'relative',
            backgroundColor: 'blue'
          }}>
            <video 
              ref={workingVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
              ✅ WORKING VIDEO
            </div>
            
            {/* Debug info */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Stream: {workingStream ? 'SET' : 'NOT SET'}
            </div>
          </div>
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-black/70 rounded px-2 py-1">
              <span className="text-white text-xs font-medium truncate">
                {userName} (You)
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {isHandRaised && (
                <div className="bg-yellow-500 rounded p-1">
                  <Hand className="h-3 w-3 text-white" />
                </div>
              )}
              {!isMuted && (
                <div className="bg-green-500 rounded p-1">
                  <Mic className="h-3 w-3 text-white" />
                </div>
              )}
              {isMuted && (
                <div className="bg-red-500 rounded p-1">
                  <MicOff className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Remote participants */}
        {participants.map(participant => (
          <Card key={participant.id} className="relative overflow-hidden bg-black">
            <div className="aspect-video">
              <video
                ref={(el) => {
                  if (el) remoteVideoRefs.current.set(participant.id, el);
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!participant.hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="text-2xl">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-black/70 rounded px-2 py-1">
                <span className="text-white text-xs font-medium truncate">
                  {participant.name}
                </span>
                {participant.role === 'host' && (
                  <Badge variant="secondary" className="text-xs">Host</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {participant.isHandRaised && (
                  <div className="bg-yellow-500 rounded p-1">
                    <Hand className="h-3 w-3 text-white" />
                  </div>
                )}
                {!participant.isMuted && (
                  <div className="bg-green-500 rounded p-1">
                    <Mic className="h-3 w-3 text-white" />
                  </div>
                )}
                {participant.isMuted && (
                  <div className="bg-red-500 rounded p-1">
                    <MicOff className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const ChatPanel = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {chatMessages.map(msg => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{msg.senderName}</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm bg-muted rounded p-2">{msg.message}</p>
            </div>
          ))}
          
          {/* Live transcript */}
          {isTranscribing && currentTranscript && (
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Live Transcript
              </div>
              <div className="text-sm bg-blue-50 rounded p-2 max-h-32 overflow-y-auto">
                {currentTranscript}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button size="sm" onClick={sendMessage}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">
            {lessonPlan?.title || `Room ${roomId}`}
          </h1>
          {connectionState === 'connected' && (
            <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
          )}
          <div className="text-sm opacity-75">
            {formatTime(meetingTime)}
          </div>
          {isRecording && (
            <Badge variant="destructive">Recording</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isTranscribing && (
            <Badge variant="secondary" className="animate-pulse">
              Transcribing
            </Badge>
          )}
          <span className="text-sm">{participants.length + 1} participants</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={toggleRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateMeetingSummary}>
                Generate AI Summary
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAITutor(true)}>
                AI Voice Tutor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowWhiteboard(!showWhiteboard)}>
                {showWhiteboard ? 'Hide' : 'Show'} Whiteboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTranslation(!showTranslation)}>
                {showTranslation ? 'Hide' : 'Show'} Translation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          {showWhiteboard ? (
            <div className="h-full">
              <InteractiveWhiteboard roomId={roomId} />
            </div>
          ) : (
            <ParticipantGrid />
          )}
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-background border-l">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-2">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="video" className="flex-1 m-0">
              <div className="p-4">
                <h3 className="font-medium mb-4">Participants ({participants.length + 1})</h3>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {/* Current user */}
                    <div className="flex items-center justify-between p-2 rounded hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{userName} (You)</div>
                          {isHost && (
                            <Badge variant="secondary" className="text-xs">Host</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {isHandRaised && (
                          <Hand className="h-4 w-4 text-yellow-500" />
                        )}
                        {isMuted ? (
                          <MicOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4 text-green-500" />
                        )}
                        {!hasVideo && (
                          <VideoOff className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {/* Remote participants */}
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{participant.name}</div>
                            {participant.role === 'host' && (
                              <Badge variant="secondary" className="text-xs">Host</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {participant.isHandRaised && (
                            <Hand className="h-4 w-4 text-yellow-500" />
                          )}
                          {participant.isMuted ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-green-500" />
                          )}
                          {!participant.hasVideo && (
                            <VideoOff className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="flex-1 m-0">
              <ChatPanel />
            </TabsContent>
            
            <TabsContent value="ai" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">AI Features</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowAITutor(true)}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      AI Voice Tutor
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      Live Translation
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={generateMeetingSummary}
                      disabled={!currentTranscript}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Generate Summary
                    </Button>
                  </div>
                </div>
                
                {meetingSummary && (
                  <div>
                    <h3 className="font-medium mb-2">Meeting Summary</h3>
                    <ScrollArea className="h-40">
                      <div className="text-sm bg-muted rounded p-3">
                        {meetingSummary}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Audio Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Volume</span>
                      <span className="text-sm">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Meeting Info</h3>
                  <div className="text-sm space-y-1">
                    <div>Room ID: {roomId}</div>
                    <div>Duration: {formatTime(meetingTime)}</div>
                    <div>Status: {connectionState}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black text-white p-4 flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleMute}
          className="rounded-full h-12 w-12"
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={hasVideo ? "secondary" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full h-12 w-12"
        >
          {hasVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="lg"
          onClick={toggleScreenShare}
          className="rounded-full h-12 w-12"
        >
          <Monitor className="h-5 w-5" />
        </Button>
        
        <Button
          variant={isHandRaised ? "default" : "secondary"}
          size="lg"
          onClick={toggleHand}
          className="rounded-full h-12 w-12"
        >
          <Hand className="h-5 w-5" />
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setShowWhiteboard(!showWhiteboard)}
          className="rounded-full h-12 w-12"
        >
          <PenTool className="h-5 w-5" />
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          onClick={() => webRTC.disconnect()}
          className="rounded-full h-12 w-12"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>
      
      {/* AI Components */}
      {showAITutor && (
        <AIVoiceTutor
          isOpen={showAITutor}
          onClose={() => setShowAITutor(false)}
          lessonContext={lessonPlan}
        />
      )}
      
      {showTranslation && (
        <LiveTranslation
          isOpen={showTranslation}
          onClose={() => setShowTranslation(false)}
          audioStream={webRTC.getLocalStream()}
        />
      )}
    </div>
  );
}
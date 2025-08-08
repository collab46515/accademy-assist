import { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Phone, Users, Share, 
  MessageSquare, Settings, Hand, Monitor, Camera 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'participant';
  isMuted: boolean;
  hasVideo: boolean;
  isHandRaised: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

const mockParticipants: Participant[] = [
  { id: '1', name: 'Ms. Johnson (Host)', role: 'host', isMuted: false, hasVideo: true, isHandRaised: false },
  { id: '2', name: 'Emma Smith', role: 'participant', isMuted: true, hasVideo: true, isHandRaised: false },
  { id: '3', name: 'John Doe', role: 'participant', isMuted: true, hasVideo: false, isHandRaised: true },
  { id: '4', name: 'Sarah Wilson', role: 'participant', isMuted: false, hasVideo: true, isHandRaised: false },
];

const mockChatMessages: ChatMessage[] = [
  { id: '1', sender: 'Ms. Johnson', message: 'Welcome everyone to today\'s math class!', timestamp: '09:00' },
  { id: '2', sender: 'Emma Smith', message: 'Good morning, Ms. Johnson', timestamp: '09:01' },
  { id: '3', sender: 'John Doe', message: 'Can you please share the presentation?', timestamp: '09:02' },
];

export function VideoConferenceInterface() {
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [meetingTime, setMeetingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const ParticipantGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
      {participants.map(participant => (
        <Card key={participant.id} className="relative overflow-hidden bg-black">
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            {participant.hasVideo ? (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                <Camera className="h-8 w-8 opacity-50" />
                <span className="ml-2 opacity-75">Video Feed</span>
              </div>
            ) : (
              <Avatar className="h-16 w-16">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-2xl">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
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

  const ChatPanel = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {chatMessages.map(msg => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{msg.sender}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="text-sm bg-muted rounded p-2">{msg.message}</p>
            </div>
          ))}
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

  const ParticipantsList = () => (
    <ScrollArea className="h-full p-4">
      <div className="space-y-2">
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
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Mathematics Class - Year 10</h1>
          <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
          <div className="text-sm opacity-75">
            {formatTime(meetingTime)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">{participants.length} participants</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <ParticipantGrid />
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-background border-l">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 m-0">
              <ChatPanel />
            </TabsContent>
            <TabsContent value="participants" className="flex-1 m-0">
              <ParticipantsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black text-white p-4 flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={() => setIsMuted(!isMuted)}
          className="rounded-full h-12 w-12"
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={hasVideo ? "secondary" : "destructive"}
          size="lg"
          onClick={() => setHasVideo(!hasVideo)}
          className="rounded-full h-12 w-12"
        >
          {hasVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="lg"
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className="rounded-full h-12 w-12"
        >
          <Monitor className="h-5 w-5" />
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full h-12 w-12"
        >
          <Share className="h-5 w-5" />
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full h-12 w-12"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
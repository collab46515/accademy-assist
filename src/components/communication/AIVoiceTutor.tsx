import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, MicOff, Volume2, VolumeX, Bot, 
  MessageSquare, Lightbulb, BookOpen, HelpCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIVoiceTutorProps {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: any;
}

interface TutorMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export function AIVoiceTutor({ isOpen, onClose, lessonContext }: AIVoiceTutorProps) {
  const { toast } = useToast();
  
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [currentTopic, setCurrentTopic] = useState('General Help');
  
  // Audio management
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  // WebSocket for real-time communication
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      initializeAudioContext();
      if (lessonContext) {
        setCurrentTopic(lessonContext.subject || lessonContext.title || 'Current Lesson');
      }
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen]);

  const initializeAudioContext = async () => {
    try {
      const context = new AudioContext({
        sampleRate: 24000,
      });
      setAudioContext(context);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        if (recordedChunks.length > 0) {
          processAudioForAI();
        }
      };
      
      setMediaRecorder(recorder);
      
      toast({
        title: "AI Voice Tutor Ready",
        description: "Start speaking to get personalized help",
      });
      
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      toast({
        title: "Audio Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const connectToAITutor = async () => {
    try {
      setIsConnected(true);
      
      // Send initial context about the lesson
      const systemMessage: TutorMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: `AI Tutor connected for ${currentTopic}. How can I help you today?`,
        timestamp: new Date()
      };
      
      setMessages([systemMessage]);
      
      // In a real implementation, you would establish WebSocket connection to OpenAI Realtime API
      // For now, we'll simulate the connection
      toast({
        title: "Connected to AI Tutor",
        description: "You can now have voice conversations about your lesson",
      });
      
    } catch (error) {
      console.error('Failed to connect to AI tutor:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Could not connect to AI tutor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startListening = () => {
    if (!mediaRecorder || !isConnected) return;
    
    setIsListening(true);
    setRecordedChunks([]);
    mediaRecorder.start(100); // Record in 100ms chunks
    
    toast({
      title: "Listening...",
      description: "Speak your question to the AI tutor",
    });
  };

  const stopListening = () => {
    if (!mediaRecorder || !isListening) return;
    
    setIsListening(false);
    mediaRecorder.stop();
  };

  const processAudioForAI = async () => {
    if (recordedChunks.length === 0) return;
    
    try {
      // Combine audio chunks
      const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      const base64Audio = await blobToBase64(audioBlob);
      
      // Add user message (placeholder)
      const userMessage: TutorMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Processing your question...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Send to AI for processing (using our AI meeting assistant)
      const { data } = await supabase.functions.invoke('ai-meeting-assistant', {
        body: {
          action: 'transcribe-audio',
          data: { audio: base64Audio.split(',')[1] }
        }
      });
      
      if (data && data.text) {
        // Update user message with transcription
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, content: data.text }
            : msg
        ));
        
        // Generate AI response
        await generateAIResponse(data.text);
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Could not process your audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRecordedChunks([]);
    }
  };

  const generateAIResponse = async (userQuestion: string) => {
    try {
      setIsSpeaking(true);
      
      // Generate contextual response based on lesson
      const contextPrompt = lessonContext 
        ? `You are an AI tutor helping with a ${lessonContext.subject || 'lesson'} about "${lessonContext.title || currentTopic}". 
           The student asked: "${userQuestion}". Provide a helpful, educational response that relates to the lesson context.`
        : `You are a helpful AI tutor. The student asked: "${userQuestion}". Provide a clear, educational response.`;

      // Use OpenAI to generate response
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getOpenAIKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are a patient, knowledgeable AI tutor. Provide clear, encouraging responses that help students learn.'
            },
            {
              role: 'user',
              content: contextPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      
      // Add AI message
      const aiMessage: TutorMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Generate speech for the response
      await generateSpeech(aiResponse);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "AI Error",
        description: "Could not generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const generateSpeech = async (text: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getOpenAIKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy',
          response_format: 'mp3',
        }),
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        await playAudio(audioBuffer);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  };

  const playAudio = async (audioBuffer: ArrayBuffer) => {
    if (!audioContext) return;
    
    try {
      const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferDecoded;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
      };
      
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  };

  const getOpenAIKey = async () => {
    // In a real implementation, this would be handled securely through the backend
    // For now, this is a placeholder
    return 'your-openai-key';
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const cleanup = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (audioContext) {
      audioContext.close();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const QuickHelp = () => (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateAIResponse("Can you explain this topic in simple terms?")}
        disabled={!isConnected}
      >
        <Lightbulb className="h-4 w-4 mr-1" />
        Explain Simply
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateAIResponse("Can you give me some practice questions?")}
        disabled={!isConnected}
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        Practice Questions
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateAIResponse("What are the key points I should remember?")}
        disabled={!isConnected}
      >
        <BookOpen className="h-4 w-4 mr-1" />
        Key Points
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateAIResponse("How does this relate to real life?")}
        disabled={!isConnected}
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        Real World
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Voice Tutor
            <Badge variant="secondary">{currentTopic}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Connection Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {!isConnected && (
                  <Button size="sm" onClick={connectToAITutor}>
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Help */}
          {isConnected && <QuickHelp />}

          {/* Messages */}
          <ScrollArea className="flex-1 border rounded-lg">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.type === 'system'
                        ? 'bg-muted'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isSpeaking && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 text-blue-900 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">🤖</div>
                      <span className="text-sm">AI is speaking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="rounded-full h-16 w-16"
              onClick={isListening ? stopListening : startListening}
              disabled={!isConnected || isSpeaking}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            <div className="text-center">
              <div className="text-sm font-medium">
                {isListening ? 'Listening...' : isSpeaking ? 'AI Speaking' : 'Press to Talk'}
              </div>
              <div className="text-xs text-muted-foreground">
                Voice AI Tutor
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
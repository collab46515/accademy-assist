import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Headphones,
  Settings,
  Zap,
  Brain,
  Waveform
} from 'lucide-react';

interface Props {
  roomId: string;
  userRole: 'teacher' | 'student';
  onTranscription: (text: string, isComplete: boolean) => void;
  onVoiceCommand: (command: string) => void;
  aiVoiceEnabled?: boolean;
  selectedVoice?: string;
}

export const VoiceControls: React.FC<Props> = ({
  roomId,
  userRole,
  onTranscription,
  onVoiceCommand,
  aiVoiceEnabled = true,
  selectedVoice = 'Brian'
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlayingAI, setIsPlayingAI] = useState(false);
  const [voiceCommandMode, setVoiceCommandMode] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();

  // Available voices
  const voices = [
    { id: 'Brian', name: 'Brian', description: 'Calm and clear' },
    { id: 'Alice', name: 'Alice', description: 'Warm and friendly' },
    { id: 'Sarah', name: 'Sarah', description: 'Professional' },
    { id: 'Daniel', name: 'Daniel', description: 'Deep and authoritative' }
  ];

  // Initialize audio context and analyzer
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Monitor audio level during recording
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(Math.round((average / 255) * 100));

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  // Convert audio blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      monitorAudioLevel();

      toast({
        title: "Recording Started",
        description: voiceCommandMode ? "Listening for voice commands..." : "Recording audio for transcription...",
      });

    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  // Process recorded audio
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const audioBase64 = await blobToBase64(audioBlob);

      const { data, error } = await supabase.functions.invoke('ai-voice-service', {
        body: {
          action: 'speech-to-text',
          audioData: audioBase64
        }
      });

      if (error) throw error;

      const transcription = data.transcription;
      
      if (voiceCommandMode) {
        // Process as voice command
        processVoiceCommand(transcription);
      } else {
        // Regular transcription
        onTranscription(transcription, true);
      }

      toast({
        title: "Audio Processed",
        description: voiceCommandMode ? "Voice command recognized" : "Audio transcribed successfully",
      });

    } catch (error) {
      console.error('Audio processing error:', error);
      toast({
        title: "Processing Failed",
        description: "Could not process audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process voice command
  const processVoiceCommand = (text: string) => {
    const command = text.toLowerCase();
    
    // Common voice commands
    if (command.includes('create quiz') || command.includes('generate quiz')) {
      onVoiceCommand('create_quiz');
    } else if (command.includes('explain') || command.includes('help with')) {
      onVoiceCommand(`explain: ${text}`);
    } else if (command.includes('show example') || command.includes('give example')) {
      onVoiceCommand('show_example');
    } else if (command.includes('repeat') || command.includes('say again')) {
      onVoiceCommand('repeat_last');
    } else if (command.includes('slower') || command.includes('slow down')) {
      onVoiceCommand('slow_down');
    } else if (command.includes('faster') || command.includes('speed up')) {
      onVoiceCommand('speed_up');
    } else {
      // General AI assistant query
      onVoiceCommand(`query: ${text}`);
    }
  };

  // Text to speech
  const speakText = async (text: string, voice = selectedVoice) => {
    if (!aiVoiceEnabled || !text.trim()) return;

    setIsPlayingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-service', {
        body: {
          action: 'text-to-speech',
          text: text,
          voice: voice,
          model: 'eleven_turbo_v2'
        }
      });

      if (error) throw error;

      if (data.audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
        
        audio.onended = () => setIsPlayingAI(false);
        audio.onerror = () => setIsPlayingAI(false);
        
        await audio.play();
      }

    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Failed",
        description: "Could not generate speech audio.",
        variant: "destructive"
      });
      setIsPlayingAI(false);
    }
  };

  // Quick command buttons for teachers
  const quickCommands = [
    { label: 'Explain This', command: 'explain_current', icon: <Brain className="h-3 w-3" /> },
    { label: 'Create Quiz', command: 'create_quiz', icon: <Zap className="h-3 w-3" /> },
    { label: 'Show Example', command: 'show_example', icon: <Play className="h-3 w-3" /> },
    { label: 'Summarize', command: 'summarize_lesson', icon: <Square className="h-3 w-3" /> }
  ];

  return (
    <Card className="p-4 bg-white border shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-blue-100">
              <Volume2 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-medium text-sm">Voice Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Voice: {selectedVoice}
            </Badge>
            {aiVoiceEnabled && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                AI Voice ON
              </Badge>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </>
            ) : isProcessing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setVoiceCommandMode(!voiceCommandMode)}
          >
            {voiceCommandMode ? (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Commands
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Transcribe
              </>
            )}
          </Button>
        </div>

        {/* Audio Level Indicator */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Waveform className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Audio Level:</span>
              <span className="text-sm font-medium">{audioLevel}%</span>
            </div>
            <Progress value={audioLevel} className="h-2" />
          </div>
        )}

        {/* Voice Command Mode Indicator */}
        {voiceCommandMode && (
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-800">Voice Command Mode</span>
            </div>
            <p className="text-xs text-blue-700">
              Say: "Create quiz", "Explain this", "Show example", "Help with [topic]"
            </p>
          </div>
        )}

        {/* Quick Commands (Teacher Only) */}
        {userRole === 'teacher' && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Quick Commands</h5>
            <div className="grid grid-cols-2 gap-2">
              {quickCommands.map((cmd) => (
                <Button
                  key={cmd.command}
                  size="sm"
                  variant="outline"
                  onClick={() => onVoiceCommand(cmd.command)}
                  className="text-xs justify-start"
                >
                  {cmd.icon}
                  <span className="ml-1">{cmd.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* AI Voice Status */}
        {aiVoiceEnabled && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">AI Voice Response</span>
            </div>
            {isPlayingAI && (
              <Badge className="bg-purple-100 text-purple-700 text-xs animate-pulse">
                <Volume2 className="h-3 w-3 mr-1" />
                Playing...
              </Badge>
            )}
          </div>
        )}

        {/* Test Voice Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => speakText("Hello! This is a test of the AI voice system.")}
          disabled={isPlayingAI || !aiVoiceEnabled}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          Test AI Voice
        </Button>
      </div>
    </Card>
  );
};

// Export hook for easy voice integration
export const useVoiceControls = (
  roomId: string, 
  userRole: 'teacher' | 'student',
  onTranscription?: (text: string, isComplete: boolean) => void,
  onVoiceCommand?: (command: string) => void
) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Brian');

  const speakText = async (text: string) => {
    if (!isVoiceEnabled) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-service', {
        body: {
          action: 'text-to-speech',
          text: text,
          voice: selectedVoice,
          model: 'eleven_turbo_v2'
        }
      });

      if (error) throw error;

      if (data.audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
        await audio.play();
      }
    } catch (error) {
      console.error('Voice synthesis error:', error);
    }
  };

  return {
    isVoiceEnabled,
    setIsVoiceEnabled,
    selectedVoice,
    setSelectedVoice,
    speakText
  };
};
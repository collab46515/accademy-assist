import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeOff,
  Phone,
  PhoneOff,
  Bot,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AudioRecorder, AudioQueue, encodeAudioForAPI } from '@/utils/RealtimeAudio';

interface AIVoiceAssistantProps {
  roomId: string;
  isVisible: boolean;
  onToggle: () => void;
}

export const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({
  roomId,
  isVisible,
  onToggle
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  // WebRTC refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioElementRef.current = document.createElement("audio");
    audioElementRef.current.autoplay = true;

    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      console.log('Connecting to AI voice assistant...');

      // Get ephemeral token
      const { data, error } = await supabase.functions.invoke('realtime-classroom');
      
      if (error) {
        throw new Error(`Failed to get ephemeral token: ${error.message}`);
      }

      if (!data?.client_secret?.value) {
        throw new Error('No ephemeral token received');
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log('Received ephemeral token');

      // Create peer connection
      pcRef.current = new RTCPeerConnection();

      // Set up remote audio
      pcRef.current.ontrack = (event) => {
        console.log('Received remote track:', event);
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = event.streams[0];
        }
      };

      // Add local audio track
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      mediaStream.getTracks().forEach(track => {
        pcRef.current?.addTrack(track, mediaStream);
      });

      // Set up data channel
      dcRef.current = pcRef.current.createDataChannel("oai-events");
      
      dcRef.current.addEventListener("message", (event) => {
        console.log("Received WebRTC message:", event.data);
        handleRealtimeEvent(JSON.parse(event.data));
      });

      // Create and set local description
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      console.log('Connecting to OpenAI WebRTC...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`WebRTC connection failed: ${await sdpResponse.text()}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await pcRef.current.setRemoteDescription(answer);
      console.log('WebRTC connection established');

      // Initialize audio context and queue
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);

      // Start audio recording
      recorderRef.current = new AudioRecorder((audioData) => {
        if (dcRef.current?.readyState === 'open') {
          dcRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodeAudioForAPI(audioData)
          }));
        }
      });
      
      await recorderRef.current.start();
      console.log('Audio recording started');

      setIsConnected(true);
      setIsListening(true);
      
      toast.success('AI Voice Assistant connected and ready!');

    } catch (error) {
      console.error('Error connecting to AI assistant:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect');
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    console.log('Disconnecting AI voice assistant...');
    
    recorderRef.current?.stop();
    dcRef.current?.close();
    pcRef.current?.close();
    audioContextRef.current?.close();
    
    pcRef.current = null;
    dcRef.current = null;
    audioContextRef.current = null;
    audioQueueRef.current = null;
    recorderRef.current = null;

    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript('');
    setAiResponse('');
    
    toast.info('AI Voice Assistant disconnected');
  };

  const handleRealtimeEvent = async (event: any) => {
    console.log('Handling realtime event:', event.type);

    switch (event.type) {
      case 'session.created':
        console.log('Session created, sending configuration...');
        if (dcRef.current?.readyState === 'open') {
          dcRef.current.send(JSON.stringify({
            type: 'session.update',
            session: {
              modalities: ["text", "audio"],
              instructions: "You are a helpful AI teaching assistant. Keep responses concise and educational.",
              voice: "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.7,
              max_response_output_tokens: "inf"
            }
          }));
        }
        break;

      case 'input_audio_buffer.speech_started':
        setIsListening(true);
        setTranscript('');
        console.log('User started speaking');
        break;

      case 'input_audio_buffer.speech_stopped':
        setIsListening(false);
        console.log('User stopped speaking');
        break;

      case 'conversation.item.input_audio_transcription.completed':
        setTranscript(event.transcript);
        console.log('Transcription:', event.transcript);
        break;

      case 'response.audio.delta':
        setIsSpeaking(true);
        if (audioQueueRef.current && event.delta) {
          try {
            // Convert base64 to Uint8Array
            const binaryString = atob(event.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await audioQueueRef.current.addToQueue(bytes);
          } catch (error) {
            console.error('Error processing audio delta:', error);
          }
        }
        break;

      case 'response.audio.done':
        setIsSpeaking(false);
        console.log('AI finished speaking');
        break;

      case 'response.audio_transcript.delta':
        setAiResponse(prev => prev + (event.delta || ''));
        break;

      case 'response.audio_transcript.done':
        console.log('AI response transcript complete:', event.transcript);
        break;

      case 'error':
        console.error('Realtime API error:', event);
        toast.error(`AI Assistant error: ${event.error?.message || 'Unknown error'}`);
        break;

      default:
        console.log('Unhandled event type:', event.type, event);
    }
  };

  const sendMessage = (text: string) => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') {
      toast.error('AI Assistant not connected');
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    dcRef.current.send(JSON.stringify(event));
    dcRef.current.send(JSON.stringify({ type: 'response.create' }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Card className="w-80 p-4 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">AI Teaching Assistant</h3>
          </div>
          <Button onClick={onToggle} variant="ghost" size="sm">
            ×
          </Button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-sm text-slate-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {(isListening || isSpeaking) && (
            <Badge variant="secondary" className="ml-auto">
              {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : ''}
            </Badge>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 mb-1">You said:</div>
            <div className="text-sm">{transcript}</div>
          </div>
        )}

        {/* AI Response Display */}
        {aiResponse && (
          <div className="mb-3 p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 mb-1">AI Assistant:</div>
            <div className="text-sm">{aiResponse}</div>
          </div>
        )}

        {/* Quick Text Input for Testing */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Type a question..."
            className="w-full p-2 text-sm border border-slate-300 rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                sendMessage(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="flex-1"
              size="sm"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={disconnect}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            disabled={!isConnected}
            className="flex items-center gap-1"
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled={!isConnected}
            className="flex items-center gap-1"
          >
            {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Usage Tips */}
        <div className="mt-4 p-2 bg-slate-50 rounded text-xs text-slate-600">
          💡 Ask questions about the lesson, request explanations, or get study tips. The AI assistant is here to help with your learning!
        </div>
      </Card>
    </div>
  );
};
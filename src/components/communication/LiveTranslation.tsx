import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Languages, Volume2, VolumeX, Mic, MicOff, 
  ArrowRight, Globe, Settings 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LiveTranslationProps {
  isOpen: boolean;
  onClose: () => void;
  audioStream?: MediaStream | null;
}

interface TranslationEntry {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  confidence: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

export function LiveTranslation({ isOpen, onClose, audioStream }: LiveTranslationProps) {
  const { toast } = useToast();
  
  // State management
  const [isActive, setIsActive] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translations, setTranslations] = useState<TranslationEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showConfidence, setShowConfidence] = useState(false);
  
  // Audio processing
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const processingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      initializeAudio();
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen, audioStream]);

  const initializeAudio = async () => {
    try {
      let stream = audioStream;
      
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 44100,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }

      const context = new AudioContext();
      setAudioContext(context);

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        processAudioChunks();
      };

      setMediaRecorder(recorder);
      
      toast({
        title: "Live Translation Ready",
        description: "Audio capture initialized for real-time translation",
      });

    } catch (error) {
      console.error('Failed to initialize audio for translation:', error);
      toast({
        title: "Audio Error",
        description: "Could not access audio for translation",
        variant: "destructive",
      });
    }
  };

  const startTranslation = () => {
    if (!mediaRecorder) return;
    
    setIsActive(true);
    chunksRef.current = [];
    
    // Start recording in intervals for continuous translation
    mediaRecorder.start();
    
    // Process audio chunks every 3 seconds
    processingTimeoutRef.current = setInterval(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.start();
      }
    }, 3000);
    
    toast({
      title: "Translation Started",
      description: `Translating from ${getLanguageName(sourceLanguage)} to ${getLanguageName(targetLanguage)}`,
    });
  };

  const stopTranslation = () => {
    if (!mediaRecorder) return;
    
    setIsActive(false);
    
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    if (processingTimeoutRef.current) {
      clearInterval(processingTimeoutRef.current);
    }
    
    toast({
      title: "Translation Stopped",
      description: "Live translation has been paused",
    });
  };

  const processAudioChunks = async () => {
    if (chunksRef.current.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const base64Audio = await blobToBase64(audioBlob);
      
      // Step 1: Transcribe audio
      const transcriptionResponse = await supabase.functions.invoke('ai-meeting-assistant', {
        body: {
          action: 'transcribe-audio',
          data: { audio: base64Audio.split(',')[1] }
        }
      });
      
      if (transcriptionResponse.data && transcriptionResponse.data.text) {
        const originalText = transcriptionResponse.data.text.trim();
        
        if (originalText.length > 3) { // Only translate meaningful text
          // Step 2: Translate text
          await translateText(originalText, transcriptionResponse.data.confidence || 0.8);
        }
      }
      
    } catch (error) {
      console.error('Error processing audio for translation:', error);
    } finally {
      setIsProcessing(false);
      chunksRef.current = [];
    }
  };

  const translateText = async (text: string, confidence: number) => {
    try {
      const response = await supabase.functions.invoke('ai-meeting-assistant', {
        body: {
          action: 'translate-text',
          data: { 
            text, 
            targetLanguage: getLanguageName(targetLanguage)
          }
        }
      });
      
      if (response.data && response.data.translatedText) {
        const translation: TranslationEntry = {
          id: Date.now().toString(),
          originalText: text,
          translatedText: response.data.translatedText,
          sourceLanguage: response.data.sourceLanguage || 'auto',
          targetLanguage: targetLanguage,
          timestamp: new Date(),
          confidence: confidence
        };
        
        setTranslations(prev => [translation, ...prev].slice(0, 50)); // Keep last 50 translations
        
        // Auto-speak translation if enabled
        if (autoSpeak) {
          await speakTranslation(response.data.translatedText);
        }
      }
      
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const speakTranslation = async (text: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your-openai-key', // In reality, this would be from your backend
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy',
          response_format: 'mp3',
        }),
      });

      if (response.ok && audioContext) {
        const audioBuffer = await response.arrayBuffer();
        const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBufferDecoded;
        source.connect(audioContext.destination);
        source.start(0);
      }
    } catch (error) {
      console.error('Error speaking translation:', error);
    }
  };

  const getLanguageName = (code: string) => {
    if (code === 'auto') return 'Auto-detect';
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.flag || '🌐';
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
    if (processingTimeoutRef.current) {
      clearInterval(processingTimeoutRef.current);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Live Translation
            {isActive && (
              <Badge variant="default" className="animate-pulse">
                Live
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Language Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Translation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">From</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">🌐 Auto-detect</SelectItem>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-6" />
                
                <div className="flex-1">
                  <label className="text-sm font-medium">To</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoSpeak}
                    onCheckedChange={setAutoSpeak}
                  />
                  <label className="text-sm">Auto-speak translations</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showConfidence}
                    onCheckedChange={setShowConfidence}
                  />
                  <label className="text-sm">Show confidence</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isActive ? "destructive" : "default"}
              size="lg"
              onClick={isActive ? stopTranslation : startTranslation}
              disabled={!mediaRecorder}
              className="rounded-full h-16 w-16"
            >
              {isActive ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            <div className="text-center">
              <div className="text-sm font-medium">
                {isActive ? 'Translating Live' : 'Start Translation'}
              </div>
              <div className="text-xs text-muted-foreground">
                {getLanguageFlag(sourceLanguage)} → {getLanguageFlag(targetLanguage)}
              </div>
            </div>
          </div>

          {/* Status */}
          {isProcessing && (
            <div className="text-center">
              <Badge variant="secondary" className="animate-pulse">
                Processing audio...
              </Badge>
            </div>
          )}

          {/* Translations */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Translations
                <Badge variant="outline">{translations.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                <div className="p-4 space-y-4">
                  {translations.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No translations yet</p>
                      <p className="text-sm">Start speaking to see live translations</p>
                    </div>
                  ) : (
                    translations.map((translation) => (
                      <div key={translation.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="text-sm text-muted-foreground">
                            {translation.timestamp.toLocaleTimeString()}
                          </div>
                          {showConfidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(translation.confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Original:</span>
                            <p className="mt-1">{translation.originalText}</p>
                          </div>
                          
                          <div className="text-sm">
                            <span className="text-muted-foreground">Translation:</span>
                            <p className="mt-1 font-medium text-blue-700">
                              {translation.translatedText}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {getLanguageFlag(translation.sourceLanguage)} → {getLanguageFlag(translation.targetLanguage)}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakTranslation(translation.translatedText)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
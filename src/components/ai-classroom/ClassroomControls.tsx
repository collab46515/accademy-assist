import { Mic, MicOff, Video, VideoOff, Volume2, Phone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassroomControlsProps {
  isMuted: boolean;
  isCameraOn: boolean;
  isVoiceEnabled: boolean;
  onMuteToggle: () => void;
  onCameraToggle: () => void;
  onVoiceToggle: () => void;
  onSettings: () => void;
  onEndSession: () => void;
}

export function ClassroomControls({
  isMuted,
  isCameraOn,
  isVoiceEnabled,
  onMuteToggle,
  onCameraToggle,
  onVoiceToggle,
  onSettings,
  onEndSession
}: ClassroomControlsProps) {
  return (
    <div className="bg-white border-t border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              size="sm" 
              variant={isMuted ? "destructive" : "default"}
              onClick={onMuteToggle}
              className="flex-shrink-0"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </Button>
            
            <Button 
              size="sm" 
              variant={isCameraOn ? "default" : "outline"}
              onClick={onCameraToggle}
              className={`flex-shrink-0 ${isCameraOn ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse' : ''}`}
            >
              {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">
                {isCameraOn ? "Camera On" : "Camera Off"}
              </span>
            </Button>

            <Button 
              size="sm" 
              variant={isVoiceEnabled ? "default" : "outline"}
              onClick={onVoiceToggle}
              className="flex-shrink-0"
            >
              {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">
                {isVoiceEnabled ? "Voice On" : "Voice Off"}
              </span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onSettings}
              className="flex-shrink-0"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Settings</span>
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={onEndSession}
              className="flex-shrink-0"
            >
              <Phone className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
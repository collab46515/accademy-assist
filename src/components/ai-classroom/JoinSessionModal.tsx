import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, Copy, QrCode, Share } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface JoinSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

export function JoinSessionModal({ isOpen, onClose, sessionId }: JoinSessionModalProps) {
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('student');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate session link
  const sessionLink = sessionId ? 
    `${window.location.origin}/ai-classroom/session/${sessionId}?role=${userRole}&name=${encodeURIComponent(userName)}` :
    `${window.location.origin}/ai-classroom/session/demo-session-1?role=${userRole}&name=${encodeURIComponent(userName || 'Demo User')}`;

  const handleJoinSession = async () => {
    if (!userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to join the session",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    
    try {
      // Simulate joining process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const targetSessionId = joinCode.trim() || sessionId || 'demo-session-1';
      const joinUrl = `/ai-classroom/session/${targetSessionId}?role=${userRole}&name=${encodeURIComponent(userName)}`;
      
      navigate(joinUrl);
      onClose();
      
      toast({
        title: "Joining session...",
        description: `Welcome ${userName}! Loading AI classroom...`,
      });
    } catch (error) {
      toast({
        title: "Failed to join",
        description: "Could not join the session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const copySessionLink = () => {
    navigator.clipboard.writeText(sessionLink);
    toast({
      title: "Link copied!",
      description: "Session link has been copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Join AI Classroom
          </DialogTitle>
          <DialogDescription>
            Enter your details to join an interactive AI-powered learning session
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Join as</Label>
            <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as 'teacher' | 'student')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Teacher
                  <Badge variant="secondary" className="text-xs">Create & Control</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Student
                  <Badge variant="outline" className="text-xs">Participate & Learn</Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Session Code (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="joinCode">Session Code (Optional)</Label>
            <Input
              id="joinCode"
              placeholder="Enter session code or leave empty for demo"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to join the demo session
            </p>
          </div>

          {/* Quick Demo Session */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                🚀 Try Demo Session
                <Badge className="bg-green-500 text-xs">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Experience all AI classroom features with demo data
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copySessionLink}
                  className="flex-1"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Could implement QR code generation
                    toast({
                      title: "QR Code",
                      description: "QR code feature coming soon!",
                    });
                  }}
                >
                  <QrCode className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleJoinSession} 
            disabled={isJoining}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Joining...
              </div>
            ) : (
              <>Join Session</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
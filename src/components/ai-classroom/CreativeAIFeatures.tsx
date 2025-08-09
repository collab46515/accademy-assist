import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Gamepad2,
  Volume2,
  Palette,
  Mic,
  Image,
  Play,
  Pause,
  Settings,
  Sparkles,
  Brain,
  BookOpen,
  Camera,
  Headphones,
  Wand2,
  Users,
  Star,
  Zap,
  Eye,
  Activity,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface AIAvatar {
  id: string;
  name: string;
  subject: string;
  personality: string;
  visualStyle: string;
  voiceProfile: string;
  active: boolean;
  interactions: number;
}

interface VoiceClone {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  status: 'training' | 'ready' | 'error';
  similarity: number;
  sampleText: string;
}

interface StoryScenario {
  id: string;
  title: string;
  subject: string;
  narrative: string;
  characters: string[];
  interactiveElements: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Props {
  roomId: string;
  currentSubject: string;
  lessonTheme: string;
  onFeatureActivate: (feature: string, config: any) => void;
}

export const CreativeAIFeatures: React.FC<Props> = ({
  roomId,
  currentSubject,
  lessonTheme,
  onFeatureActivate
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('avatars');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Avatars
  const [avatars, setAvatars] = useState<AIAvatar[]>([
    {
      id: '1',
      name: 'Professor Einstein',
      subject: 'Mathematics',
      personality: 'Wise, encouraging, uses analogies',
      visualStyle: 'Classic academic with wild hair',
      voiceProfile: 'gentle_professor',
      active: true,
      interactions: 147
    },
    {
      id: '2',
      name: 'Dr. Nova',
      subject: 'Science',
      personality: 'Enthusiastic, curious, experimental',
      visualStyle: 'Modern scientist with lab coat',
      voiceProfile: 'energetic_researcher',
      active: false,
      interactions: 89
    }
  ]);

  // Voice Clones
  const [voiceClones, setVoiceClones] = useState<VoiceClone[]>([
    {
      id: '1',
      name: 'Teacher\'s Voice',
      description: 'Main instructor voice clone',
      voiceId: 'teacher_clone_01',
      status: 'ready',
      similarity: 94,
      sampleText: 'Welcome to today\'s lesson on quadratic equations...'
    },
    {
      id: '2',
      name: 'Friendly Assistant',
      description: 'Warm, encouraging tone',
      voiceId: 'assistant_clone_01',
      status: 'training',
      similarity: 87,
      sampleText: 'Great job! Let\'s try another example together.'
    }
  ]);

  // Story Scenarios
  const [storyScenarios, setStoryScenarios] = useState<StoryScenario[]>([
    {
      id: '1',
      title: 'The Algebra Detective',
      subject: 'Mathematics',
      narrative: 'Join Detective X as they solve mysterious crimes using algebraic equations...',
      characters: ['Detective X', 'Suspect A', 'The Variable Villain'],
      interactiveElements: ['Clue analysis', 'Equation solving', 'Timeline reconstruction'],
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: 'Chemistry Lab Adventure',
      subject: 'Science',
      narrative: 'Enter the magical world of molecules where you\'ll help save the compound kingdom...',
      characters: ['Dr. Atom', 'Molecule Mike', 'Bonding Betty'],
      interactiveElements: ['Reaction experiments', 'Formula creation', 'Element matching'],
      difficulty: 'beginner'
    }
  ]);

  const [selectedAvatar, setSelectedAvatar] = useState<AIAvatar | null>(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [storyDialogOpen, setStoryDialogOpen] = useState(false);
  const [newStoryPrompt, setNewStoryPrompt] = useState('');

  // Generate new AI avatar
  const generateAvatar = async () => {
    setIsGenerating(true);
    try {
      // Show immediate feedback to user
      toast({
        title: "AI Avatar Generation Started!",
        description: "Creating a new AI tutor avatar for " + currentSubject,
      });

      // Simulate avatar generation with visual feedback
      setTimeout(() => {
        const newAvatar: AIAvatar = {
          id: `avatar-${Date.now()}`,
          name: `AI Tutor ${avatars.length + 1}`,
          subject: currentSubject,
          personality: 'Adaptive and engaging mathematics tutor',
          visualStyle: 'Friendly professor',
          voiceProfile: 'Warm and encouraging',
          active: false,
          interactions: 0
        };

        setAvatars(prev => [newAvatar, ...prev]);
        setIsGenerating(false);
        
        toast({
          title: "Avatar Created Successfully!",
          description: `${newAvatar.name} is ready to assist with ${currentSubject}`,
        });
        
        // Auto-activate the new avatar
        setTimeout(() => {
          setAvatars(prev => prev.map(avatar => 
            avatar.id === newAvatar.id 
              ? { ...avatar, active: true }
              : { ...avatar, active: false }
          ));
        }, 1000);
      }, 2000);

    } catch (error) {
      console.error('Error generating avatar:', error);
      toast({
        title: "Avatar Generation Failed",
        description: "Please try again. If the issue persists, check your connection.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  // Activate avatar
  const activateAvatar = async (avatarId: string) => {
    try {
      const avatar = avatars.find(a => a.id === avatarId);
      if (!avatar) return;

      const { data, error } = await supabase.functions.invoke('creative-ai-features', {
        body: {
          action: 'activate_avatar',
          roomId,
          avatarId,
          config: {
            personality: avatar.personality,
            voiceProfile: avatar.voiceProfile,
            subject: avatar.subject
          }
        }
      });

      if (error) throw error;

      // Update avatar status
      setAvatars(prev => prev.map(a => ({
        ...a,
        active: a.id === avatarId ? true : false
      })));

      onFeatureActivate('ai_avatar', { avatarId, ...avatar });

      toast({
        title: "Avatar Activated",
        description: `${avatar.name} is now assisting with the lesson.`,
      });

    } catch (error) {
      console.error('Avatar activation error:', error);
      toast({
        title: "Activation Failed",
        description: "Could not activate AI avatar.",
        variant: "destructive"
      });
    }
  };

  // Generate story scenario
  const generateStory = async () => {
    if (!newStoryPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('creative-ai-features', {
        body: {
          action: 'generate_story',
          roomId,
          config: {
            prompt: newStoryPrompt,
            subject: currentSubject,
            lessonTheme,
            difficulty: 'intermediate',
            interactiveElements: true
          }
        }
      });

      if (error) throw error;

      const newScenario: StoryScenario = {
        id: Date.now().toString(),
        title: data.title || 'Custom Learning Adventure',
        subject: currentSubject,
        narrative: data.narrative || newStoryPrompt,
        characters: data.characters || ['Student', 'AI Guide'],
        interactiveElements: data.interactiveElements || ['Problem solving', 'Discovery'],
        difficulty: data.difficulty || 'intermediate'
      };

      setStoryScenarios(prev => [...prev, newScenario]);
      setNewStoryPrompt('');
      setStoryDialogOpen(false);

      toast({
        title: "Story Scenario Created",
        description: `"${newScenario.title}" is ready for the lesson.`,
      });

    } catch (error) {
      console.error('Story generation error:', error);
      toast({
        title: "Story Generation Failed",
        description: "Could not create story scenario.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Test voice clone
  const testVoiceClone = async (voiceId: string, text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-service', {
        body: {
          action: 'text-to-speech',
          text: text,
          voice: voiceId,
          model: 'eleven_turbo_v2'
        }
      });

      if (error) throw error;

      // Play audio
      if (data.audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
        audio.play();
      }

      toast({
        title: "Voice Test",
        description: "Playing voice sample...",
      });

    } catch (error) {
      console.error('Voice test error:', error);
      toast({
        title: "Voice Test Failed",
        description: "Could not play voice sample.",
        variant: "destructive"
      });
    }
  };

  // Launch story scenario
  const launchStory = (scenarioId: string) => {
    const scenario = storyScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    onFeatureActivate('story_learning', {
      scenarioId,
      title: scenario.title,
      narrative: scenario.narrative,
      characters: scenario.characters,
      interactiveElements: scenario.interactiveElements
    });

    toast({
      title: "Story Launched",
      description: `"${scenario.title}" is now active in the classroom.`,
    });
  };

  const activeAvatar = avatars.find(a => a.active);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Creative AI Features</h3>
              <p className="text-sm text-muted-foreground">
                Avatars, voice cloning & story-based learning
              </p>
            </div>
          </div>
          {activeAvatar && (
            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700">
              <Gamepad2 className="h-3 w-3 mr-1" />
              {activeAvatar.name} Active
            </Badge>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="avatars" className="text-xs">
            <Gamepad2 className="h-3 w-3 mr-1" />
            Avatars
          </TabsTrigger>
          <TabsTrigger value="voices" className="text-xs">
            <Volume2 className="h-3 w-3 mr-1" />
            Voices
          </TabsTrigger>
          <TabsTrigger value="stories" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            Stories
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* AI Avatars Tab */}
          <TabsContent value="avatars" className="h-full p-0 m-0">
            <div className="h-full flex flex-col">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">AI Tutor Avatars</h4>
                  <Button 
                    size="sm" 
                    onClick={generateAvatar}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-pink-500 to-purple-500"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Create Avatar'}
                  </Button>
                </div>

                <div className="space-y-3">
                  {avatars.map((avatar) => (
                    <Card key={avatar.id} className={`p-4 ${avatar.active ? 'border-green-500 bg-green-50' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400">
                            <Gamepad2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{avatar.name}</h5>
                            <p className="text-xs text-muted-foreground">{avatar.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {avatar.interactions} interactions
                          </Badge>
                          {avatar.active && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {avatar.personality}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            {avatar.visualStyle}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Volume2 className="h-3 w-3 mr-1" />
                            {avatar.voiceProfile}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedAvatar(avatar);
                              setAvatarDialogOpen(true);
                            }}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => activateAvatar(avatar.id)}
                            disabled={avatar.active}
                            className={avatar.active ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}
                          >
                            {avatar.active ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Voice Cloning Tab */}
          <TabsContent value="voices" className="h-full p-0 m-0">
            <div className="h-full flex flex-col">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Voice Clones</h4>
                  <Button 
                    size="sm" 
                    onClick={() => setVoiceDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Create Clone
                  </Button>
                </div>

                <div className="space-y-3">
                  {voiceClones.map((clone) => (
                    <Card key={clone.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-sm">{clone.name}</h5>
                          <p className="text-xs text-muted-foreground">{clone.description}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            clone.status === 'ready' ? 'border-green-500 text-green-700' :
                            clone.status === 'training' ? 'border-yellow-500 text-yellow-700' :
                            'border-red-500 text-red-700'
                          }`}
                        >
                          {clone.status}
                        </Badge>
                      </div>

                      {clone.status === 'ready' && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">Similarity:</span>
                            <Badge variant="secondary" className="text-xs">
                              {clone.similarity}%
                            </Badge>
                          </div>
                          <div className="bg-slate-100 p-2 rounded text-xs">
                            "{clone.sampleText}"
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {clone.status === 'ready' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => testVoiceClone(clone.voiceId, clone.sampleText)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Test
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                          {clone.status === 'ready' && (
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500">
                              <Headphones className="h-3 w-3 mr-1" />
                              Use
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Story Learning Tab */}
          <TabsContent value="stories" className="h-full p-0 m-0">
            <div className="h-full flex flex-col">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Story-Based Learning</h4>
                  <Button 
                    size="sm" 
                    onClick={() => setStoryDialogOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create Story
                  </Button>
                </div>

                <div className="space-y-3">
                  {storyScenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-sm">{scenario.title}</h5>
                          <p className="text-xs text-muted-foreground">{scenario.subject}</p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {scenario.difficulty}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {scenario.narrative.substring(0, 100)}...
                      </p>

                      <div className="space-y-2 mb-3">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Characters:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scenario.characters.map((character, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {character}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Interactive Elements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scenario.interactiveElements.map((element, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {element}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => launchStory(scenario.id)}
                          className="bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Launch Story
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Story Creation Dialog */}
      <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Learning Story</DialogTitle>
            <DialogDescription>
              Describe the story scenario you'd like AI to create for {currentSubject}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Story Prompt</label>
              <Textarea
                placeholder="e.g., A detective story where students solve crimes using algebra..."
                value={newStoryPrompt}
                onChange={(e) => setNewStoryPrompt(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={generateStory}
                disabled={isGenerating || !newStoryPrompt.trim()}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Story
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
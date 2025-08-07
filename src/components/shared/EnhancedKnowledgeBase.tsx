import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  User, 
  Send, 
  Loader2, 
  MessageSquare,
  Brain,
  Search,
  Clock,
  X,
  GraduationCap,
  Users,
  Shield,
  Settings,
  BarChart3,
  Lightbulb,
  FileText,
  Star,
  Image,
  Palette,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  visualContent?: {
    hasImages: boolean;
    hasCharts: boolean;
    hasDiagrams: boolean;
    imageRequests: string[];
    chartRequests: string[];
  };
  generatedImages?: string[];
  timestamp: Date;
}

interface EnhancedKnowledgeBaseProps {
  schoolData?: any;
  context?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedKnowledgeBase({ schoolData, context, isOpen, onClose }: EnhancedKnowledgeBaseProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to the Enhanced Visual Knowledge Base AI! I can provide comprehensive educational guidance with visual support including diagrams, charts, and AI-generated illustrations. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [includeVisuals, setIncludeVisuals] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const knowledgeCategories = [
    { value: 'general', label: 'General Education', icon: BookOpen, color: 'bg-blue-500' },
    { value: 'curriculum', label: 'Curriculum & Pedagogy', icon: GraduationCap, color: 'bg-green-500' },
    { value: 'leadership', label: 'Leadership & Management', icon: Users, color: 'bg-purple-500' },
    { value: 'welfare', label: 'Student Welfare', icon: Shield, color: 'bg-pink-500' },
    { value: 'operations', label: 'Operations & Finance', icon: Settings, color: 'bg-orange-500' },
    { value: 'research', label: 'Research & Innovation', icon: Lightbulb, color: 'bg-yellow-500' },
    { value: 'policy', label: 'Policy & Compliance', icon: FileText, color: 'bg-red-500' }
  ];

  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-generator', {
        body: { prompt, size: '1024x1024', quality: 'standard' }
      });

      if (error) throw new Error(error.message);
      return data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Image Generation Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      category: selectedCategory,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending enhanced knowledge base query:', inputValue);
      
      const { data, error } = await supabase.functions.invoke('enhanced-knowledge-base', {
        body: {
          message: inputValue,
          category: selectedCategory,
          schoolData: schoolData,
          context: context || 'Enhanced Visual Educational Knowledge Base',
          queryType: 'enhanced_knowledge_base',
          includeVisuals
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      console.log('Enhanced knowledge base response received:', data);

      // Generate images if requested (including diagrams as images)
      let generatedImages: string[] = [];
      if (data.visualContent?.hasImages && data.visualContent.imageRequests.length > 0) {
        for (const imageRequest of data.visualContent.imageRequests) {
          const imageUrl = await generateImage(imageRequest);
          if (imageUrl) {
            generatedImages.push(imageUrl);
          }
        }
      }
      
      // Generate diagram images if requested
      if (data.visualContent?.hasDiagrams && data.visualContent.chartRequests?.length > 0) {
        for (const chartRequest of data.visualContent.chartRequests) {
          const diagramPrompt = `Create a clear, educational diagram: ${chartRequest}. Style: clean, professional, educational illustration with labels and clear visual hierarchy.`;
          const imageUrl = await generateImage(diagramPrompt);
          if (imageUrl) {
            generatedImages.push(imageUrl);
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your query. Please try again.',
        category: data.category,
        visualContent: data.visualContent,
        generatedImages,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get knowledge base response. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble accessing the knowledge base right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message: Message) => {
    return (
      <div className="whitespace-pre-wrap">
        {message.content}
      </div>
    );
  };

  if (!isOpen) return null;

  const currentCategory = knowledgeCategories.find(cat => cat.value === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col border shadow-2xl bg-background">
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  Enhanced Visual Knowledge Base AI
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Image className="h-3 w-3 mr-1" />
                    Visual
                  </Badge>
                </CardTitle>
                <p className="text-white/80 text-sm">Educational intelligence with diagrams, charts & AI-generated visuals</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Controls */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="visual-mode" 
                  checked={includeVisuals} 
                  onCheckedChange={setIncludeVisuals}
                />
                <Label htmlFor="visual-mode" className="text-sm flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Visual Mode
                </Label>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 max-w-full ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-lg p-4 break-words ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border'
                    }`}
                  >
                    {/* Category Badge */}
                    {message.category && message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {knowledgeCategories.find(cat => cat.value === message.category)?.label || message.category}
                        </Badge>
                        {message.visualContent && (
                          <div className="flex gap-1">
                            {message.visualContent.hasDiagrams && (
                              <Badge variant="outline" className="text-xs">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Diagrams
                              </Badge>
                            )}
                            {message.visualContent.hasImages && (
                              <Badge variant="outline" className="text-xs">
                                <Image className="h-3 w-3 mr-1" />
                                Images
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="text-sm leading-relaxed">
                      {renderMessageContent(message)}
                    </div>

                    {/* Generated Images */}
                    {message.generatedImages && message.generatedImages.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.generatedImages.map((imageUrl, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden bg-white">
                            <img 
                              src={imageUrl} 
                              alt={`Generated educational illustration ${index + 1}`}
                              className="w-full h-auto max-h-96 object-contain"
                            />
                            <div className="p-2 bg-gray-50 flex justify-between items-center">
                              <span className="text-xs text-gray-600">AI-Generated Educational Illustration</span>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 mt-3">
                      <Clock className="h-3 w-3 text-muted-foreground opacity-60" />
                      <span className="text-xs text-muted-foreground opacity-60">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {(isLoading || isGeneratingImage) && (
                <div className="flex gap-3 justify-start max-w-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-2 border">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      {isGeneratingImage ? 'Generating visual content...' : 'Processing knowledge query...'}
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-background flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask anything about ${currentCategory?.label.toLowerCase() || 'education'} - I can provide diagrams and visuals!`}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
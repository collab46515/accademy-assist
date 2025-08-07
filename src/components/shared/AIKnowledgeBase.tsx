import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  timestamp: Date;
}

interface AIKnowledgeBaseProps {
  schoolData?: any;
  context?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIKnowledgeBase({ schoolData, context, isOpen, onClose }: AIKnowledgeBaseProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to the School Knowledge Base AI! I\'m your comprehensive educational intelligence system with expertise across curriculum, pedagogy, administration, student welfare, and operational excellence. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(false);
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

  const suggestedQuestions = {
    general: [
      "What are the latest trends in educational technology?",
      "How can we improve student engagement?",
      "Best practices for parent-teacher communication",
      "Effective classroom management strategies"
    ],
    curriculum: [
      "How to design an effective curriculum?",
      "Differentiated instruction techniques",
      "Assessment for learning strategies",
      "Integrating STEM across subjects"
    ],
    leadership: [
      "School improvement planning process",
      "Building a positive school culture",
      "Leading change in education",
      "Performance management for teachers"
    ],
    welfare: [
      "Mental health support for students",
      "Safeguarding best practices",
      "Inclusive education strategies",
      "Behavior intervention plans"
    ],
    operations: [
      "School budget planning principles",
      "Staff recruitment and retention",
      "Facilities management best practices",
      "Technology infrastructure planning"
    ],
    research: [
      "Evidence-based teaching methods",
      "Latest educational research findings",
      "Innovation in assessment",
      "Future of education trends"
    ],
    policy: [
      "Inspection preparation checklist",
      "Data protection in schools",
      "Health and safety compliance",
      "Educational policy updates"
    ]
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
      console.log('Sending knowledge base query:', inputValue);
      
      const { data, error } = await supabase.functions.invoke('ai-knowledge-base', {
        body: {
          message: inputValue,
          category: selectedCategory,
          schoolData: schoolData,
          context: context || 'Comprehensive Educational Knowledge Base',
          queryType: 'knowledge_base'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      console.log('Knowledge base response received:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your query. Please try again.',
        category: data.category,
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

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  const currentCategory = knowledgeCategories.find(cat => cat.value === selectedCategory);
  const currentSuggestions = suggestedQuestions[selectedCategory as keyof typeof suggestedQuestions] || suggestedQuestions.general;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col border shadow-2xl bg-background">
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-white text-lg">Knowledge Base AI - Educational Intelligence</CardTitle>
                <p className="text-white/80 text-sm">Comprehensive expertise across all educational domains</p>
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
          {/* Category Selector */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3 mb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Knowledge Category:</span>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
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

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 max-w-full ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-4 break-words ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border'
                    }`}
                  >
                    {message.category && message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {knowledgeCategories.find(cat => cat.value === message.category)?.label || message.category}
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

              {isLoading && (
                <div className="flex gap-3 justify-start max-w-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-2 border">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Searching knowledge base...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-muted/30 flex-shrink-0">
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Suggested questions for {currentCategory?.label}:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentSuggestions.map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-2 px-3 justify-start text-left"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-background flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask anything about ${currentCategory?.label.toLowerCase() || 'education'}...`}
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
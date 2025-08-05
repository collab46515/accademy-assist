import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target,
  Users,
  MapPin,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Shield,
  Settings
} from "lucide-react";

interface ConstraintsManagerProps {
  onBack: () => void;
  onNext: () => void;
}

interface Constraint {
  id: string;
  type: 'hard' | 'soft';
  category: 'teacher' | 'room' | 'time' | 'subject';
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
}

const defaultConstraints: Constraint[] = [
  {
    id: '1',
    type: 'hard',
    category: 'teacher',
    name: 'No Teacher Conflicts',
    description: 'A teacher cannot be in two places at the same time',
    enabled: true,
    priority: 10
  },
  {
    id: '2',
    type: 'hard',
    category: 'room',
    name: 'No Room Double Booking',
    description: 'A room cannot host multiple classes simultaneously',
    enabled: true,
    priority: 10
  },
  {
    id: '3',
    type: 'soft',
    category: 'teacher',
    name: 'Teacher Preferences',
    description: 'Respect teacher preferred time slots',
    enabled: true,
    priority: 7
  },
  {
    id: '4',
    type: 'soft',
    category: 'time',
    name: 'Minimize Gaps',
    description: 'Reduce free periods between classes',
    enabled: true,
    priority: 6
  },
  {
    id: '5',
    type: 'hard',
    category: 'subject',
    name: 'Required Periods',
    description: 'Each subject must have its required number of periods',
    enabled: true,
    priority: 9
  },
  {
    id: '6',
    type: 'soft',
    category: 'room',
    name: 'Lab Requirements',
    description: 'Science subjects should be assigned to labs when possible',
    enabled: true,
    priority: 5
  }
];

export function ConstraintsManager({ onBack, onNext }: ConstraintsManagerProps) {
  const [constraints, setConstraints] = useState<Constraint[]>(defaultConstraints);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const hardConstraints = constraints.filter(c => c.type === 'hard');
  const softConstraints = constraints.filter(c => c.type === 'soft');
  const enabledConstraints = constraints.filter(c => c.enabled);

  const toggleConstraint = (id: string) => {
    setConstraints(prev => 
      prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)
    );
  };

  const updatePriority = (id: string, priority: number) => {
    setConstraints(prev => 
      prev.map(c => c.id === id ? { ...c, priority } : c)
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'teacher': return <Users className="h-4 w-4" />;
      case 'room': return <MapPin className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      case 'subject': return <BookOpen className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const filteredConstraints = selectedCategory === 'all' 
    ? constraints 
    : constraints.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
          <Target className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Configure Constraints</h2>
        <p className="text-muted-foreground">Set up rules and preferences for the AI to follow during generation</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hard Constraints</p>
                <p className="text-2xl font-bold text-destructive">{hardConstraints.filter(c => c.enabled).length}/{hardConstraints.length}</p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Must be satisfied</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Soft Constraints</p>
                <p className="text-2xl font-bold text-primary">{softConstraints.filter(c => c.enabled).length}/{softConstraints.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Preferred but flexible</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold text-success">{enabledConstraints.length}/{constraints.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Currently enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Constraints Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Constraint Rules</span>
              </CardTitle>
              <CardDescription>Configure hard and soft constraints for timetable generation</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="category-filter">Filter by:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Teacher</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="room">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Room</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="time">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Time</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="subject">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Subject</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConstraints.map((constraint) => (
              <div key={constraint.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={constraint.enabled}
                    onCheckedChange={() => toggleConstraint(constraint.id)}
                  />
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(constraint.category)}
                    <Badge variant={constraint.type === 'hard' ? 'destructive' : 'secondary'}>
                      {constraint.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{constraint.name}</p>
                    <p className="text-sm text-muted-foreground">{constraint.description}</p>
                  </div>
                </div>
                
                {constraint.enabled && constraint.type === 'soft' && (
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Priority:</Label>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePriority(constraint.id, Math.max(1, constraint.priority - 1))}
                        disabled={constraint.priority <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{constraint.priority}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePriority(constraint.id, Math.min(10, constraint.priority + 1))}
                        disabled={constraint.priority >= 10}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <span>Back: Setup</span>
        </Button>
        <Button onClick={onNext} className="shadow-[var(--shadow-elegant)]">
          <span>Next: Start Generation</span>
        </Button>
      </div>
    </div>
  );
}
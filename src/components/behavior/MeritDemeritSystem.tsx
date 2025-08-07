import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Star, 
  Minus, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertCircle,
  Users,
  Calendar,
  Trophy,
  Target
} from 'lucide-react';

export function MeritDemeritSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAwardDialog, setShowAwardDialog] = useState(false);
  const [awardType, setAwardType] = useState<'merit' | 'demerit'>('merit');

  const students = [
    {
      id: 1,
      name: 'Sarah Johnson',
      class: '9A',
      merits: 45,
      demerits: 3,
      netScore: 42,
      weeklyMerits: 8,
      weeklyDemerits: 0,
      rank: 1,
      recentActivity: [
        { type: 'merit', reason: 'Excellent homework submission', points: 5, date: '2024-01-15' },
        { type: 'merit', reason: 'Helping other students', points: 3, date: '2024-01-14' }
      ]
    },
    {
      id: 2,
      name: 'Mike Chen',
      class: '10B',
      merits: 32,
      demerits: 8,
      netScore: 24,
      weeklyMerits: 4,
      weeklyDemerits: 2,
      rank: 2,
      recentActivity: [
        { type: 'demerit', reason: 'Late to class', points: -2, date: '2024-01-15' },
        { type: 'merit', reason: 'Good participation', points: 4, date: '2024-01-13' }
      ]
    },
    {
      id: 3,
      name: 'Emma Wilson',
      class: '8C',
      merits: 28,
      demerits: 12,
      netScore: 16,
      weeklyMerits: 2,
      weeklyDemerits: 4,
      rank: 3,
      recentActivity: [
        { type: 'demerit', reason: 'Disrupting class', points: -3, date: '2024-01-14' },
        { type: 'demerit', reason: 'Homework not completed', points: -2, date: '2024-01-12' }
      ]
    }
  ];

  const meritReasons = [
    'Excellent homework submission',
    'Outstanding class participation',
    'Helping other students',
    'Leadership qualities',
    'Academic excellence',
    'Good behavior',
    'Community service',
    'Sports achievement',
    'Creative work',
    'Improvement in attitude'
  ];

  const demeritReasons = [
    'Late to class',
    'Homework not completed',
    'Disrupting class',
    'Inappropriate behavior',
    'Uniform violation',
    'Mobile phone misuse',
    'Disrespectful to staff',
    'Vandalism',
    'Cheating',
    'Fighting'
  ];

  const getScoreColor = (score: number) => {
    if (score >= 30) return 'text-green-600';
    if (score >= 10) return 'text-blue-600';
    if (score >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (weeklyMerits: number, weeklyDemerits: number) => {
    const weeklyNet = weeklyMerits - weeklyDemerits;
    if (weeklyNet > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (weeklyNet < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Target className="h-4 w-4 text-gray-500" />;
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Merit & Demerit System</h2>
          <p className="text-muted-foreground">Track and manage student achievement points</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAwardDialog && awardType === 'merit'} onOpenChange={(open) => {
            setShowAwardDialog(open);
            if (open) setAwardType('merit');
          }}>
            <DialogTrigger asChild>
              <Button>
                <Star className="h-4 w-4 mr-2" />
                Award Merit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Award Merit Points</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name} ({student.class})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {meritReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 point</SelectItem>
                      <SelectItem value="2">2 points</SelectItem>
                      <SelectItem value="3">3 points</SelectItem>
                      <SelectItem value="5">5 points</SelectItem>
                      <SelectItem value="10">10 points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea placeholder="Optional additional details..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAwardDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAwardDialog(false)}>
                    Award Merit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAwardDialog && awardType === 'demerit'} onOpenChange={(open) => {
            setShowAwardDialog(open);
            if (open) setAwardType('demerit');
          }}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Minus className="h-4 w-4 mr-2" />
                Issue Demerit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue Demerit Points</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name} ({student.class})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {demeritReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 point</SelectItem>
                      <SelectItem value="2">2 points</SelectItem>
                      <SelectItem value="3">3 points</SelectItem>
                      <SelectItem value="5">5 points</SelectItem>
                      <SelectItem value="10">10 points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea placeholder="Optional additional details..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAwardDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => setShowAwardDialog(false)}>
                    Issue Demerit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merits This Week</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">142</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demerits This Week</CardTitle>
            <Minus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">31</div>
            <p className="text-xs text-muted-foreground">-12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Above 30 Points</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Elite achievers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Below 0 Points</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Need intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Student Scores */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                  </div>
                  <Badge variant="outline">#{student.rank}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  {getTrendIcon(student.weeklyMerits, student.weeklyDemerits)}
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(student.netScore)}`}>
                      {student.netScore > 0 ? '+' : ''}{student.netScore}
                    </div>
                    <div className="text-sm text-muted-foreground">net score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Merit Points</span>
                    <span className="text-green-600 font-medium">{student.merits}</span>
                  </div>
                  <Progress value={(student.merits / 50) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    +{student.weeklyMerits} this week
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Demerit Points</span>
                    <span className="text-red-600 font-medium">{student.demerits}</span>
                  </div>
                  <Progress value={(student.demerits / 20) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    +{student.weeklyDemerits} this week
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Activity</span>
                    <span className="font-medium">
                      {student.weeklyMerits - student.weeklyDemerits > 0 ? '+' : ''}
                      {student.weeklyMerits - student.weeklyDemerits}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-green-600">
                      +{student.weeklyMerits} merits
                    </Badge>
                    {student.weeklyDemerits > 0 && (
                      <Badge variant="secondary" className="text-red-600">
                        -{student.weeklyDemerits} demerits
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {student.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        {activity.type === 'merit' ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Minus className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">{activity.reason}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          activity.type === 'merit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {activity.points > 0 ? '+' : ''}{activity.points}
                        </span>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
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
  Gift, 
  Trophy,
  Star,
  Crown,
  Award,
  Target,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';

export function BehaviorRewards() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateRewardDialog, setShowCreateRewardDialog] = useState(false);
  const [showGiveRewardDialog, setShowGiveRewardDialog] = useState(false);

  const rewards = [
    {
      id: 1,
      name: 'Student of the Week Certificate',
      description: 'Recognition certificate for outstanding weekly performance',
      pointsRequired: 50,
      category: 'Recognition',
      availability: 'Weekly',
      redeemed: 8,
      active: true
    },
    {
      id: 2,
      name: 'Extra Break Time',
      description: '15 minutes additional break time',
      pointsRequired: 25,
      category: 'Privilege',
      availability: 'Daily',
      redeemed: 23,
      active: true
    },
    {
      id: 3,
      name: 'Homework Pass',
      description: 'Skip one homework assignment',
      pointsRequired: 40,
      category: 'Privilege',
      availability: 'Monthly',
      redeemed: 12,
      active: true
    },
    {
      id: 4,
      name: 'School Store Voucher',
      description: '£5 voucher for school store',
      pointsRequired: 75,
      category: 'Tangible',
      availability: 'Monthly',
      redeemed: 6,
      active: true
    },
    {
      id: 5,
      name: 'Principal\'s Lunch',
      description: 'Special lunch with the principal',
      pointsRequired: 100,
      category: 'Experience',
      availability: 'Termly',
      redeemed: 2,
      active: true
    }
  ];

  const recentRedemptions = [
    {
      id: 1,
      student: 'Sarah Johnson',
      class: '9A',
      reward: 'Student of the Week Certificate',
      pointsUsed: 50,
      date: '2024-01-15',
      status: 'Delivered'
    },
    {
      id: 2,
      student: 'Mike Chen',
      class: '10B',
      reward: 'Extra Break Time',
      pointsUsed: 25,
      date: '2024-01-14',
      status: 'Pending'
    },
    {
      id: 3,
      student: 'Emma Wilson',
      class: '8C',
      reward: 'Homework Pass',
      pointsUsed: 40,
      date: '2024-01-13',
      status: 'Delivered'
    }
  ];

  const topRedeemers = [
    { name: 'Sarah Johnson', class: '9A', totalRewards: 12, pointsSpent: 480 },
    { name: 'Alex Thompson', class: '11A', totalRewards: 8, pointsSpent: 320 },
    { name: 'Mike Chen', class: '10B', totalRewards: 6, pointsSpent: 250 },
    { name: 'Jessica Lee', class: '9B', totalRewards: 5, pointsSpent: 200 },
    { name: 'Marcus Brown', class: '10C', totalRewards: 3, pointsSpent: 125 }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Recognition': return <Award className="h-4 w-4" />;
      case 'Privilege': return <Crown className="h-4 w-4" />;
      case 'Tangible': return <Gift className="h-4 w-4" />;
      case 'Experience': return <Trophy className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Recognition': return 'bg-blue-100 text-blue-800';
      case 'Privilege': return 'bg-purple-100 text-purple-800';
      case 'Tangible': return 'bg-green-100 text-green-800';
      case 'Experience': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRewards = rewards.filter(reward =>
    reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Behavior Rewards System</h2>
          <p className="text-muted-foreground">Manage rewards and recognition for positive behavior</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateRewardDialog} onOpenChange={setShowCreateRewardDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reward</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reward Name</Label>
                  <Input placeholder="e.g. Student of the Month" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what this reward includes..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Points Required</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recognition">Recognition</SelectItem>
                        <SelectItem value="privilege">Privilege</SelectItem>
                        <SelectItem value="tangible">Tangible</SelectItem>
                        <SelectItem value="experience">Experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="How often can this be redeemed?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="termly">Termly</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateRewardDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowCreateRewardDialog(false)}>
                    Create Reward
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showGiveRewardDialog} onOpenChange={setShowGiveRewardDialog}>
            <DialogTrigger asChild>
              <Button>
                <Gift className="h-4 w-4 mr-2" />
                Give Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Give Reward to Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stu001">Sarah Johnson (9A) - 85 points</SelectItem>
                      <SelectItem value="stu002">Mike Chen (10B) - 65 points</SelectItem>
                      <SelectItem value="stu003">Emma Wilson (8C) - 45 points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reward</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward" />
                    </SelectTrigger>
                    <SelectContent>
                      {rewards.map(reward => (
                        <SelectItem key={reward.id} value={reward.id.toString()}>
                          {reward.name} ({reward.pointsRequired} points)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea placeholder="Any special notes about this reward..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowGiveRewardDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowGiveRewardDialog(false)}>
                    Give Reward
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
            <CardTitle className="text-sm font-medium">Active Rewards</CardTitle>
            <Gift className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.filter(r => r.active).length}</div>
            <p className="text-xs text-muted-foreground">Available for redemption</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's Redemptions</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">51</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,375</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Students engaged</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Rewards */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRewards.map((reward) => (
                  <div key={reward.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white">
                          {getCategoryIcon(reward.category)}
                        </div>
                        <div>
                          <h4 className="font-medium">{reward.name}</h4>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(reward.category)}>
                        {reward.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {reward.pointsRequired} points
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {reward.availability}
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {reward.redeemed} redeemed
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Redeemers */}
        <div className="space-y-6">
          {/* Recent Redemptions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Redemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRedemptions.map((redemption) => (
                  <div key={redemption.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium text-sm">{redemption.student}</div>
                      <div className="text-xs text-muted-foreground">
                        {redemption.reward}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(redemption.status)} variant="secondary">
                        {redemption.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {redemption.pointsUsed} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Redeemers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Redeemers This Term</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRedeemers.map((redeemer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{redeemer.name}</div>
                        <div className="text-xs text-muted-foreground">{redeemer.class}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{redeemer.totalRewards} rewards</div>
                      <div className="text-xs text-muted-foreground">{redeemer.pointsSpent} points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
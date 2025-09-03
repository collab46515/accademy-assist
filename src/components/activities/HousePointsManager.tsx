import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Star, Award, Search } from 'lucide-react';
import { toast } from 'sonner';

interface HousePoint {
  id: string;
  studentId: string;
  studentName: string;
  house: string;
  points: number;
  reason: string;
  category: string;
  awardedBy: string;
  date: string;
}

interface Student {
  id: string;
  name: string;
  house: string;
  yearGroup: string;
  formClass: string;
}

export function HousePointsManager() {
  const [housePoints, setHousePoints] = useState<HousePoint[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Emma Thompson',
      house: 'Gryffindor',
      points: 10,
      reason: 'Outstanding drama performance',
      category: 'Academic Excellence',
      awardedBy: 'Ms. Williams',
      date: '2024-01-15'
    }
  ]);

  const [students] = useState<Student[]>([
    { id: 'STU001', name: 'Emma Thompson', house: 'Gryffindor', yearGroup: 'Year 10', formClass: '10A' },
    { id: 'STU002', name: 'James Wilson', house: 'Hufflepuff', yearGroup: 'Year 9', formClass: '9B' },
    { id: 'STU003', name: 'Sophie Chen', house: 'Ravenclaw', yearGroup: 'Year 11', formClass: '11C' },
    { id: 'STU004', name: 'Michael Brown', house: 'Slytherin', yearGroup: 'Year 8', formClass: '8A' }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    points: 5,
    reason: '',
    category: 'Academic Excellence'
  });

  const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
  const categories = [
    'Academic Excellence',
    'Sporting Achievement',
    'Community Service',
    'Leadership',
    'Artistic Achievement',
    'Citizenship',
    'Improvement',
    'Helping Others'
  ];

  const pointsOptions = [1, 2, 3, 5, 10, 15, 20, 25];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.house.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.yearGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      studentId: '',
      points: 5,
      reason: '',
      category: 'Academic Excellence'
    });
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.studentId || !formData.reason) {
      toast.error('Please select a student and provide a reason');
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (!selectedStudent) {
      toast.error('Invalid student selected');
      return;
    }

    const newHousePoint: HousePoint = {
      id: Date.now().toString(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      house: selectedStudent.house,
      points: formData.points,
      reason: formData.reason,
      category: formData.category,
      awardedBy: 'Current User', // Would be actual logged-in user
      date: new Date().toISOString().split('T')[0]
    };

    setHousePoints(prev => [newHousePoint, ...prev]);
    toast.success(`${formData.points} house points awarded to ${selectedStudent.name}!`);
    
    setIsDialogOpen(false);
    resetForm();
  };

  const getHouseBadge = (house: string) => {
    const colors = {
      "Gryffindor": "bg-red-600 text-white",
      "Hufflepuff": "bg-yellow-600 text-black",
      "Ravenclaw": "bg-blue-600 text-white",
      "Slytherin": "bg-green-600 text-white"
    };
    
    return <Badge className={colors[house as keyof typeof colors] || "bg-gray-500 text-white"}>{house}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Academic Excellence': 'bg-blue-100 text-blue-800',
      'Sporting Achievement': 'bg-green-100 text-green-800',
      'Community Service': 'bg-purple-100 text-purple-800',
      'Leadership': 'bg-orange-100 text-orange-800',
      'Artistic Achievement': 'bg-pink-100 text-pink-800',
      'Citizenship': 'bg-indigo-100 text-indigo-800',
      'Improvement': 'bg-yellow-100 text-yellow-800',
      'Helping Others': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant="outline" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  // Calculate house totals
  const houseTotals = houses.map(house => ({
    house,
    total: housePoints.filter(hp => hp.house === house).reduce((sum, hp) => sum + hp.points, 0),
    count: housePoints.filter(hp => hp.house === house).length
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* House Competition Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            House Competition Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {houseTotals.map((house, index) => (
              <Card key={house.house} className={`p-4 ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}>
                <div className="text-center space-y-2">
                  {index === 0 && (
                    <div className="flex justify-center">
                      <Badge className="bg-yellow-500 text-white">🏆 1st Place</Badge>
                    </div>
                  )}
                  {getHouseBadge(house.house)}
                  <div className="text-3xl font-bold text-primary">{house.total}</div>
                  <div className="text-sm text-muted-foreground">{house.count} awards</div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Award Points Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Award House Points
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Award Points
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Award House Points</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search Student</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, house, or year..."
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="student">Select Student *</Label>
                    <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStudents.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            <div className="flex items-center gap-2">
                              <span>{student.name}</span>
                              <Badge variant="outline" className="text-xs">{student.house}</Badge>
                              <Badge variant="outline" className="text-xs">{student.yearGroup}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="points">Points *</Label>
                      <Select value={formData.points.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, points: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pointsOptions.map(points => (
                            <SelectItem key={points} value={points.toString()}>
                              {points} point{points !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Describe why this student is receiving house points..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Award Points
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Awarded By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {housePoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell className="font-medium">{point.studentName}</TableCell>
                    <TableCell>{getHouseBadge(point.house)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{point.points}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(point.category)}</TableCell>
                    <TableCell className="max-w-xs truncate">{point.reason}</TableCell>
                    <TableCell>{point.awardedBy}</TableCell>
                    <TableCell>{new Date(point.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {housePoints.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No house points awarded yet. Click "Award Points" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
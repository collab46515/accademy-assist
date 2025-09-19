import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Star, Award, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  house: string;
  yearGroup: string;
  formClass: string;
}

export function HousePointsManager() {
  const { user } = useAuth();
  const { housePoints, addHousePoint, loading } = useActivities();
  const [students, setStudents] = useState<Student[]>([]);
  const [editingPoint, setEditingPoint] = useState<any>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    points: 5,
    reason: '',
    category: 'Academic Excellence'
  });

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_roles')
        .select('school_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
      
      if (data?.school_id) {
        // Mock student data for now - would fetch from students table in real implementation
        setStudents([
          { id: 'STU001', name: 'Emma Thompson', house: 'Gryffindor', yearGroup: 'Year 10', formClass: '10A' },
          { id: 'STU002', name: 'James Wilson', house: 'Hufflepuff', yearGroup: 'Year 9', formClass: '9B' },
          { id: 'STU003', name: 'Sophie Chen', house: 'Ravenclaw', yearGroup: 'Year 11', formClass: '11C' },
          { id: 'STU004', name: 'Michael Brown', house: 'Slytherin', yearGroup: 'Year 8', formClass: '8A' }
        ]);
      }
    };

    fetchStudents();
  }, [user]);

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
    setEditingPoint(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (point: any) => {
    setEditingPoint(point);
    const student = students.find(s => s.name === point.student_id || s.id === point.student_id);
    setFormData({
      studentId: student?.id || '',
      points: point.points,
      reason: point.reason,
      category: 'Academic Excellence'
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.studentId || !formData.reason) {
      toast.error('Please select a student and provide a reason');
      return;
    }

    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (!selectedStudent) {
      toast.error('Invalid student selected');
      return;
    }

    // Get user's school_id
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('school_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!userRole?.school_id) {
      toast.error('Unable to determine school');
      return;
    }

    try {
      const housePointData = {
        student_id: selectedStudent.id,
        school_id: userRole.school_id,
        house: selectedStudent.house,
        points: formData.points,
        reason: formData.reason,
        awarded_by: user.email || 'Unknown User',
        awarded_date: new Date().toISOString().split('T')[0]
      };

      await addHousePoint(housePointData);
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving house point:', error);
    }
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
                  <DialogTitle>{editingPoint ? 'Edit House Points' : 'Award House Points'}</DialogTitle>
                  <DialogDescription>
                    {editingPoint ? 'Update the house point details.' : 'Search for a student and award house points for their achievements.'}
                  </DialogDescription>
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
                  <Button onClick={handleSave} disabled={loading}>
                    {editingPoint ? 'Update Points' : 'Award Points'}
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {housePoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell className="font-medium">Student {point.student_id}</TableCell>
                    <TableCell>{getHouseBadge(point.house)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{point.points}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge('Academic Excellence')}</TableCell>
                    <TableCell className="max-w-xs truncate">{point.reason}</TableCell>
                    <TableCell>{point.awarded_by}</TableCell>
                    <TableCell>{new Date(point.awarded_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(point)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
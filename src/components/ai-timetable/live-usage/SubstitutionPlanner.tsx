import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Clock, Users, BookOpen, MapPin } from "lucide-react";

interface AbsentTeacher {
  id: string;
  name: string;
  subjects: string[];
  classes: string[];
  periods: Array<{
    day: string;
    period: number;
    subject: string;
    class: string;
    room: string;
  }>;
}

interface SubstituteCandidate {
  id: string;
  name: string;
  subjects: string[];
  availability: string[];
  compatibility: number;
  reason: string;
  currentLoad: number;
}

export function SubstitutionPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [absentTeachers, setAbsentTeachers] = useState<AbsentTeacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  // Mock data - would come from real API
  const mockAbsentTeacher: AbsentTeacher = {
    id: 'teacher-1',
    name: 'Sarah Johnson',
    subjects: ['Mathematics', 'Physics'],
    classes: ['Year 10A', 'Year 11B', 'Year 12C'],
    periods: [
      { day: 'Monday', period: 1, subject: 'Mathematics', class: 'Year 10A', room: 'M101' },
      { day: 'Monday', period: 3, subject: 'Physics', class: 'Year 11B', room: 'S201' },
      { day: 'Tuesday', period: 2, subject: 'Mathematics', class: 'Year 12C', room: 'M102' },
    ]
  };

  const mockCandidates: SubstituteCandidate[] = [
    {
      id: 'sub-1',
      name: 'Michael Chen',
      subjects: ['Mathematics', 'Computer Science'],
      availability: ['Monday-1', 'Monday-3', 'Tuesday-2'],
      compatibility: 95,
      reason: 'Same subject expertise, available all required periods',
      currentLoad: 18
    },
    {
      id: 'sub-2',
      name: 'Emily Davis',
      subjects: ['Physics', 'Chemistry'],
      availability: ['Monday-3', 'Tuesday-2'],
      compatibility: 80,
      reason: 'Physics expertise, not available for Math periods',
      currentLoad: 22
    },
    {
      id: 'sub-3',
      name: 'Free Period Coverage',
      subjects: ['General'],
      availability: ['Monday-1', 'Monday-3', 'Tuesday-2'],
      compatibility: 60,
      reason: 'Study hall supervision, no specialized teaching',
      currentLoad: 10
    }
  ];

  const addAbsentTeacher = () => {
    setAbsentTeachers([...absentTeachers, mockAbsentTeacher]);
  };

  const assignSubstitute = (teacherId: string, substituteId: string) => {
    console.log(`Assigning substitute ${substituteId} to teacher ${teacherId}`);
    // Implementation would update the timetable
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teacher Substitution Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Absent Teacher</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher-1">Sarah Johnson</SelectItem>
                  <SelectItem value="teacher-2">Mark Williams</SelectItem>
                  <SelectItem value="teacher-3">Lisa Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addAbsentTeacher}>Add Absence</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {absentTeachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Coverage Required: {mockAbsentTeacher.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Subjects
                </h4>
                <div className="flex flex-wrap gap-1">
                  {mockAbsentTeacher.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Classes
                </h4>
                <div className="flex flex-wrap gap-1">
                  {mockAbsentTeacher.classes.map((cls) => (
                    <Badge key={cls} variant="outline">{cls}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Periods to Cover
                </h4>
                <div className="text-sm text-muted-foreground">
                  {mockAbsentTeacher.periods.length} periods
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Affected Periods</h4>
              {mockAbsentTeacher.periods.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{period.day}</Badge>
                    <span className="font-medium">Period {period.period}</span>
                    <span>{period.subject}</span>
                    <span className="text-muted-foreground">{period.class}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{period.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {absentTeachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Substitute Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCandidates.map((candidate) => (
              <div key={candidate.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current load: {candidate.currentLoad} periods/week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCompatibilityColor(candidate.compatibility)}`} />
                        <span className="font-medium">{candidate.compatibility}% match</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => assignSubstitute(mockAbsentTeacher.id, candidate.id)}
                      disabled={candidate.compatibility < 70}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {candidate.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.reason}</p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Available: {candidate.availability.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
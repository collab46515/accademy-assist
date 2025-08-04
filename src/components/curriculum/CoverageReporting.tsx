import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, BookOpen, TrendingUp, Users, Clock } from 'lucide-react';
import { CurriculumFramework, CurriculumTopic, TopicCoverage, useCurriculumData } from '@/hooks/useCurriculumData';

interface CoverageReportingProps {
  framework: CurriculumFramework;
  topics: CurriculumTopic[];
  coverage: TopicCoverage[];
  schoolId: string;
  academicYear: string;
}

export function CoverageReporting({ 
  framework, 
  topics, 
  coverage, 
  schoolId, 
  academicYear 
}: CoverageReportingProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  
  const { generateCoverageReport } = useCurriculumData();

  useEffect(() => {
    generateReportData();
  }, [topics, coverage, selectedSubject, selectedGrade]);

  const generateReportData = async () => {
    try {
      const fullReport = await generateCoverageReport(schoolId, academicYear);
      setReportData(fullReport);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  // Calculate overall statistics
  const overallStats = {
    totalTopics: topics.length,
    completedTopics: coverage.filter(c => c.status === 'completed').length,
    inProgressTopics: coverage.filter(c => c.status === 'in_progress').length,
    notStartedTopics: coverage.filter(c => c.status === 'not_started').length,
    reviewedTopics: coverage.filter(c => c.status === 'reviewed').length
  };

  const completionPercentage = overallStats.totalTopics > 0 
    ? Math.round((overallStats.completedTopics / overallStats.totalTopics) * 100)
    : 0;

  // Prepare chart data
  const statusData = [
    { name: 'Completed', value: overallStats.completedTopics, color: '#22c55e' },
    { name: 'In Progress', value: overallStats.inProgressTopics, color: '#f59e0b' },
    { name: 'Not Started', value: overallStats.notStartedTopics, color: '#ef4444' },
    { name: 'Reviewed', value: overallStats.reviewedTopics, color: '#8b5cf6' }
  ];

  // Subject-wise coverage data
  const subjectData = framework.subjects.map(subject => {
    const subjectTopics = topics.filter(t => t.subject === subject);
    const subjectCoverage = coverage.filter(c => {
      const topic = topics.find(t => t.id === c.topic_id);
      return topic?.subject === subject;
    });
    
    const completed = subjectCoverage.filter(c => c.status === 'completed').length;
    const total = subjectTopics.length;
    
    return {
      subject,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  // Grade-wise coverage data
  const gradeData = framework.grade_levels.map(grade => {
    const gradeTopics = topics.filter(t => t.grade_level === grade);
    const gradeCoverage = coverage.filter(c => {
      const topic = topics.find(t => t.id === c.topic_id);
      return topic?.grade_level === grade;
    });
    
    const completed = gradeCoverage.filter(c => c.status === 'completed').length;
    const total = gradeTopics.length;
    
    return {
      grade,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  // Period-wise coverage data
  const periodData = framework.academic_periods.map(period => {
    const periodTopics = topics.filter(t => t.academic_period === period);
    const periodCoverage = coverage.filter(c => {
      const topic = topics.find(t => t.id === c.topic_id);
      return topic?.academic_period === period;
    });
    
    const completed = periodCoverage.filter(c => c.status === 'completed').length;
    const total = periodTopics.length;
    
    return {
      period,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  const handleExportReport = () => {
    // Create CSV data
    const csvData = [
      ['Subject', 'Grade Level', 'Topic', 'Status', 'Progress %', 'Estimated Hours', 'Academic Period'],
      ...topics.map(topic => {
        const topicCoverage = coverage.find(c => c.topic_id === topic.id);
        return [
          topic.subject,
          topic.grade_level,
          topic.title,
          topicCoverage?.status || 'not_started',
          topicCoverage?.completion_percentage || 0,
          topic.estimated_hours || 0,
          topic.academic_period || ''
        ];
      })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculum-coverage-report-${academicYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Coverage Reports & Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive curriculum coverage analysis for {framework.name}
              </CardDescription>
            </div>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Topics</p>
                <p className="text-2xl font-bold">{overallStats.totalTopics}</p>
              </div>
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.completedTopics}</p>
              </div>
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{overallStats.inProgressTopics}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Not Started</p>
                <p className="text-2xl font-bold text-red-600">{overallStats.notStartedTopics}</p>
              </div>
              <Users className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-primary">{completionPercentage}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Overall topic completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject-wise Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Progress</CardTitle>
            <CardDescription>Completion percentage by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Grade-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Grade-wise Progress</CardTitle>
          <CardDescription>Topic completion across grade levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#22c55e" name="Completed" />
              <Bar dataKey="total" fill="#e5e7eb" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Period-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Period Progress</CardTitle>
          <CardDescription>Topic completion by academic period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periodData.map((period) => (
              <div key={period.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{period.period}</span>
                  <span className="text-sm text-muted-foreground">
                    {period.completed}/{period.total} topics ({period.percentage}%)
                  </span>
                </div>
                <Progress value={period.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Subject Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Subject Breakdown</CardTitle>
          <CardDescription>In-depth analysis by subject and grade level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {framework.subjects.map((subject) => {
              const subjectTopics = topics.filter(t => t.subject === subject);
              const subjectCoverage = coverage.filter(c => {
                const topic = topics.find(t => t.id === c.topic_id);
                return topic?.subject === subject;
              });
              
              const completed = subjectCoverage.filter(c => c.status === 'completed').length;
              const inProgress = subjectCoverage.filter(c => c.status === 'in_progress').length;
              const total = subjectTopics.length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <Card key={subject}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{subject}</h4>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                      
                      <Progress value={percentage} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Completed:</span>
                          <span className="ml-1 font-medium text-green-600">{completed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">In Progress:</span>
                          <span className="ml-1 font-medium text-yellow-600">{inProgress}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <span className="ml-1 font-medium">{total}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Remaining:</span>
                          <span className="ml-1 font-medium text-red-600">{total - completed}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
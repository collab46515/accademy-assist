import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Calendar, Users, BookOpen, Clock, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CurriculumFrameworkSelector } from '@/components/curriculum/CurriculumFrameworkSelector';
import { TopicManager } from '@/components/curriculum/TopicManager';
import { CoverageReporting } from '@/components/curriculum/CoverageReporting';
import { ImportExportTools } from '@/components/curriculum/ImportExportTools';
import { useCurriculumData, CurriculumFramework } from '@/hooks/useCurriculumData';
import { useRBAC } from '@/hooks/useRBAC';
import { useToast } from '@/hooks/use-toast';

const CurriculumPage = () => {
  const [selectedFramework, setSelectedFramework] = useState<CurriculumFramework | null>(null);
  const [activeTab, setActiveTab] = useState('framework');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSchoolId] = useState('8cafd4e6-2974-4cf7-aa6e-39c70aef789f'); // Using the actual school ID from auth
  const [currentAcademicYear] = useState('2024-2025');
  
  const { 
    frameworks, 
    topics, 
    coverage, 
    schoolAdoption,
    loading,
    fetchTopics,
    fetchCoverage,
    fetchSchoolAdoption
  } = useCurriculumData();
  
  const { hasRole, isSchoolAdmin, getCurrentSchoolRoles } = useRBAC();
  const { toast } = useToast();

  // Check user permissions
  const canManageCurriculum = isSchoolAdmin() || hasRole('super_admin') || hasRole('hod');
  const canViewProgress = canManageCurriculum || hasRole('teacher');

  useEffect(() => {
    // Fetch school's current curriculum adoption
    fetchSchoolAdoption(currentSchoolId, currentAcademicYear);
  }, [currentSchoolId, currentAcademicYear]);

  useEffect(() => {
    // When framework is selected, fetch topics and coverage
    if (selectedFramework) {
      fetchTopics(selectedFramework.id);
      fetchCoverage(currentSchoolId, currentAcademicYear);
      setActiveTab('topics');
    }
  }, [selectedFramework]);

  // Calculate statistics
  const stats = {
    totalTopics: topics.length,
    completedTopics: coverage.filter(c => c.status === 'completed').length,
    inProgressTopics: coverage.filter(c => c.status === 'in_progress').length,
    notStartedTopics: coverage.filter(c => c.status === 'not_started').length
  };

  const completionPercentage = stats.totalTopics > 0 
    ? Math.round((stats.completedTopics / stats.totalTopics) * 100) 
    : 0;

  // Filter topics by search
  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.grade_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFrameworkSelect = (framework: CurriculumFramework) => {
    console.log('Framework selected:', framework);
    setSelectedFramework(framework);
    setActiveTab('topics'); // Auto-switch to topics tab when framework is selected
  };

  if (loading) {
    return (
      <div className="w-full">
        <PageHeader
          title="Curriculum Management"
          description="Manage curriculum frameworks, topics, and track teaching progress across your school"
          breadcrumbItems={[
            { label: 'Dashboard', href: '/' },
            { label: 'Academics', href: '/academics' },
            { label: 'Curriculum' }
          ]}
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading curriculum data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full">
      <PageHeader
        title="Universal Curriculum System"
        description="Manage any curriculum framework with configurable grade levels, academic periods, and progress tracking"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Academics', href: '/academics' },
          { label: 'Curriculum' }
        ]}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8 pb-16">

        {/* Stats Cards - Show only if framework is selected */}
        {selectedFramework && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Topics</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalTopics}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedTopics}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.inProgressTopics}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-3xl font-bold text-primary">{completionPercentage}%</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="topics">
              Topics {!selectedFramework && "(Select Framework First)"}
            </TabsTrigger>
            <TabsTrigger value="progress">
              Progress {(!selectedFramework || !canViewProgress) && "(Select Framework First)"}
            </TabsTrigger>
            <TabsTrigger value="reports">
              Reports {!selectedFramework && "(Select Framework First)"}
            </TabsTrigger>
            <TabsTrigger value="import">Import/Export</TabsTrigger>
          </TabsList>

        <TabsContent value="framework">
          <CurriculumFrameworkSelector
            selectedFramework={selectedFramework || undefined}
            onSelectFramework={handleFrameworkSelect}
            schoolId={currentSchoolId}
            academicYear={currentAcademicYear}
          />
        </TabsContent>

        <TabsContent value="topics">
          {selectedFramework ? (
            <TopicManager
              framework={selectedFramework}
              topics={filteredTopics}
              coverage={coverage}
              schoolId={currentSchoolId}
              academicYear={currentAcademicYear}
              canEdit={canManageCurriculum}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Framework Selected</h3>
                <p className="text-muted-foreground">Please select a curriculum framework to manage topics</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress">
          {selectedFramework ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Topic Coverage Progress
                  </CardTitle>
                  <CardDescription>
                    Track teaching progress across subjects and grade levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search topics by subject, grade level, or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Grade Level</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Teacher</TableHead>
                          {canManageCurriculum && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTopics.map((topic) => {
                          const topicCoverage = coverage.find(c => c.topic_id === topic.id);
                          const status = topicCoverage?.status || 'not_started';
                          const progress = topicCoverage?.completion_percentage || 0;
                          
                          return (
                            <TableRow key={topic.id}>
                              <TableCell className="font-medium">{topic.subject}</TableCell>
                              <TableCell>{topic.grade_level}</TableCell>
                              <TableCell>{topic.title}</TableCell>
                              <TableCell>
                                {topic.academic_period && (
                                  <Badge variant="outline">{topic.academic_period}</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    status === 'completed' ? 'default' :
                                    status === 'in_progress' ? 'secondary' :
                                    status === 'reviewed' ? 'outline' : 'destructive'
                                  }
                                >
                                  {status.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-muted-foreground">{progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {topicCoverage?.teacher_id ? 'Assigned' : 'Unassigned'}
                              </TableCell>
                              {canManageCurriculum && (
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    Mark Progress
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Framework Selected</h3>
                <p className="text-muted-foreground">Please select a curriculum framework to view progress</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {selectedFramework ? (
            <CoverageReporting
              framework={selectedFramework}
              topics={topics}
              coverage={coverage}
              schoolId={currentSchoolId}
              academicYear={currentAcademicYear}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Framework Selected</h3>
                <p className="text-muted-foreground">Please select a curriculum framework to view reports</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="import">
          <ImportExportTools
            selectedFramework={selectedFramework}
            schoolId={currentSchoolId}
            academicYear={currentAcademicYear}
          />
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurriculumPage;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Calendar, Edit, Copy, List, Download, Filter, SortAsc, Eye, BookOpen, Save, CheckCircle2, MessageSquare, UserCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useLessonPlanningData, type LessonPlan } from '@/hooks/useLessonPlanningData';
import { useRBAC } from '@/hooks/useRBAC';

interface LessonPlanningProps {
  schoolId: string;
  canEdit?: boolean;
}

export const LessonPlanningClean: React.FC<LessonPlanningProps> = ({ schoolId, canEdit = true }) => {
  const { hasRole } = useRBAC();
  const { 
    lessonPlans, 
    loading, 
    createLessonPlan, 
    updateLessonPlan, 
    submitForApproval, 
    approveLessonPlan, 
    rejectLessonPlan,
    addComment,
    assignToTA,
    canEdit: canEditPlan,
    canApprove: canApprovePlan
  } = useLessonPlanningData(schoolId);
  
  const [currentView, setCurrentView] = useState<'list' | 'calendar' | 'editor'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const { toast } = useToast();

  // Filter logic
  const filteredPlans = lessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || plan.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Handlers
  const handleEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setCurrentView('editor');
  };

  const handleDuplicate = async (plan: LessonPlan) => {
    const duplicatedPlan = {
      ...plan,
      title: `${plan.title} (Copy)`,
      status: 'draft' as const
    };
    // Remove the fields that will be auto-generated
    const { id, teacher_id, school_id, created_at, updated_at, ...planData } = duplicatedPlan;
    await createLessonPlan(planData);
  };

  const handleNewLesson = () => {
    setCurrentView('editor');
    setEditingPlan(null);
  };

  const handleApprove = async (planId: string) => {
    if (await canApprovePlan(planId)) {
      await approveLessonPlan(planId);
    }
  };

  const handleReject = async (planId: string, reason?: string) => {
    if (await canApprovePlan(planId)) {
      await rejectLessonPlan(planId, reason);
    }
  };

  const handleSubmitForApproval = async (planId: string) => {
    await submitForApproval(planId);
  };

  return (
    <div className="w-full min-h-full animate-fade-in">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lesson Planning</h2>
              <p className="text-gray-600 mt-1">Plan, organize, and manage your lessons</p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={currentView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('list')}
                  className="flex items-center gap-2 h-8"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
                <Button
                  variant={currentView === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('calendar')}
                  className="flex items-center gap-2 h-8"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
                <Button
                  variant={currentView === 'editor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('editor')}
                  className="flex items-center gap-2 h-8"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Editor</span>
                </Button>
              </div>

              {canEdit && (
                <Button onClick={handleNewLesson} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Lesson
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="animate-fade-in">
            {currentView === 'list' && (
              <ListView 
                lessonPlans={filteredPlans}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onApprove={handleApprove}
                onReject={handleReject}
                onSubmitForApproval={handleSubmitForApproval}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterSubject={filterSubject}
                setFilterSubject={setFilterSubject}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onNewLesson={handleNewLesson}
                canEdit={canEdit}
                hasRole={hasRole}
                loading={loading}
              />
            )}
            
            {currentView === 'calendar' && (
              <CalendarView 
                lessonPlans={filteredPlans}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
              />
            )}
            
            {currentView === 'editor' && (
              <EditorView 
                editingPlan={editingPlan}
                onCancel={() => setCurrentView('list')}
                onSave={async (planData: any) => {
                  if (editingPlan) {
                    await updateLessonPlan(editingPlan.id, planData);
                  } else {
                    await createLessonPlan(planData);
                  }
                  setCurrentView('list');
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// List View Component
function ListView({ 
  lessonPlans, 
  onEdit, 
  onDuplicate, 
  onApprove,
  onReject,
  onSubmitForApproval,
  searchTerm, 
  setSearchTerm,
  filterSubject,
  setFilterSubject,
  filterStatus,
  setFilterStatus,
  onNewLesson,
  canEdit,
  hasRole,
  loading
}: any) {
  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lesson plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="History">History</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {lessonPlans.map((plan: LessonPlan) => (
          <div key={plan.id} className="bg-white border rounded-lg p-4 shadow-sm animate-fade-in hover-scale">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{plan.title}</h3>
                <p className="text-sm text-gray-600">{plan.subject} • {plan.year_group}</p>
              </div>
              <Badge 
                className={
                  plan.status === 'approved' ? 'bg-green-100 text-green-800' :
                  plan.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                  plan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }
              >
                {plan.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span>{format(new Date(plan.lesson_date), 'MMM dd, yyyy')}</span>
              <span>{plan.duration_minutes} mins</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDuplicate(plan)}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                <Eye className="h-3 w-3" />
              </Button>
              {plan.status === 'draft' && (
                <Button variant="outline" size="sm" onClick={() => onSubmitForApproval(plan.id)}>
                  <UserCheck className="h-3 w-3" />
                </Button>
              )}
              {plan.status === 'submitted' && hasRole('hod') && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onApprove(plan.id)}>
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onReject(plan.id)}>
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">
                <Button variant="ghost" size="sm" className="font-medium">
                  Date <SortAsc className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessonPlans.map((plan: LessonPlan) => (
              <TableRow key={plan.id} className="hover:bg-muted/50 animate-fade-in">
                <TableCell className="font-medium">
                  {format(new Date(plan.lesson_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{plan.year_group}</div>
                    <div className="text-sm text-muted-foreground">{plan.form_class}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{plan.subject}</div>
                    <div className="text-sm text-muted-foreground">{plan.duration_minutes} mins</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    <div className="font-medium truncate">{plan.title}</div>
                    {plan.curriculum_topic_id && (
                      <div className="text-xs text-blue-600 truncate">
                        Topic: {plan.curriculum_topic_id}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      plan.status === 'approved' ? 'bg-green-100 text-green-800' :
                      plan.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      plan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(plan)} className="hover-scale">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDuplicate(plan)} className="hover-scale">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(plan)} className="hover-scale">
                      <Eye className="h-3 w-3" />
                    </Button>
                    {plan.status === 'draft' && (
                      <Button variant="ghost" size="sm" onClick={() => onSubmitForApproval(plan.id)} className="hover-scale" title="Submit for Approval">
                        <UserCheck className="h-3 w-3" />
                      </Button>
                    )}
                    {plan.status === 'submitted' && hasRole('hod') && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => onApprove(plan.id)} className="hover-scale text-green-600" title="Approve">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onReject(plan.id)} className="hover-scale text-red-600" title="Reject">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {loading && (
        <div className="text-center py-12 animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-600 mt-2">Loading lesson plans...</p>
        </div>
      )}

      {!loading && lessonPlans.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lesson plans found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first lesson plan.</p>
          <Button onClick={onNewLesson} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Create Lesson Plan
          </Button>
        </div>
      )}
    </div>
  );
}

// Calendar View Component
function CalendarView({ lessonPlans, onEdit, onDuplicate }: any) {
  const subjects = ['Mathematics', 'English', 'Science', 'History'];
  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-blue-500',
    'English': 'bg-green-500', 
    'Science': 'bg-purple-500',
    'History': 'bg-orange-500'
  };

  return (
    <div className="p-4 space-y-4">
      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
        <span className="text-sm font-medium text-gray-700">Subjects:</span>
        {subjects.map(subject => (
          <div key={subject} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${subjectColors[subject]}`}></div>
            <span className="text-sm text-gray-600">{subject}</span>
          </div>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Calendar
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border rounded-lg overflow-hidden animate-scale-in">
        <div className="grid grid-cols-7 gap-0 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-medium text-gray-700 border-r last:border-r-0 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-0">
          {Array.from({ length: 35 }, (_, index) => {
            const day = (index % 31) + 1;
            const dayLessons = lessonPlans.filter((plan: LessonPlan) => {
              const planDate = new Date(plan.lesson_date).getDate();
              return planDate === day;
            });

            return (
              <div key={index} className="min-h-[120px] p-2 border-r border-b last:border-r-0 hover:bg-gray-50 transition-colors">
                <div className="text-sm text-gray-600 mb-2 font-medium">
                  {day}
                </div>
                <div className="space-y-1">
                  {dayLessons.map((plan: LessonPlan) => (
                    <div 
                      key={plan.id}
                      className={`p-2 rounded text-xs text-white cursor-pointer hover:opacity-80 animate-scale-in hover-scale ${
                        subjectColors[plan.subject] || 'bg-gray-500'
                      }`}
                      onClick={() => onEdit(plan)}
                    >
                      <div className="font-medium truncate">{plan.subject}</div>
                      <div className="truncate opacity-90">{plan.year_group}</div>
                      <div className="truncate text-xs opacity-75">{plan.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{lessonPlans.length} lessons this month</span>
        <div className="text-xs text-gray-500">
          Click and drag lessons to reschedule (coming soon)
        </div>
      </div>
    </div>
  );
}

// Editor View Component
function EditorView({ editingPlan, onCancel, onSave }: any) {
  const [formData, setFormData] = useState({
    title: editingPlan?.title || '',
    subject: editingPlan?.subject || '',
    year_group: editingPlan?.year_group || '',
    form_class: editingPlan?.form_class || '',
    lesson_date: editingPlan?.lesson_date || '',
    duration_minutes: editingPlan?.duration_minutes || 60,
    status: 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto animate-fade-in">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {editingPlan ? 'Edit Lesson Plan' : 'New Lesson Plan'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a detailed lesson plan with curriculum alignment and automated integrations
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save as Template
          </Button>
        </div>
      </div>

      {/* Teacher Workflow Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-scale-in">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Teacher Workflow</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</div>
            <span className="text-blue-700">Select class/date → auto-fill from timetable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</div>
            <span className="text-blue-700">Choose curriculum topic → auto-fill objectives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</div>
            <span className="text-blue-700">Edit lesson plan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">4</div>
            <span className="text-blue-700">Save → or "Save & Create Homework"</span>
          </div>
        </div>
      </div>

      {/* Lesson Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border rounded-lg p-6 animate-scale-in">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year_group">Year Group</Label>
              <Select 
                value={formData.year_group} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, year_group: value }))}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select year group" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="Year 7">Year 7</SelectItem>
                  <SelectItem value="Year 8">Year 8</SelectItem>
                  <SelectItem value="Year 9">Year 9</SelectItem>
                  <SelectItem value="Year 10">Year 10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="form_class">Form Class</Label>
              <Input
                id="form_class"
                value={formData.form_class}
                onChange={(e) => setFormData(prev => ({ ...prev, form_class: e.target.value }))}
                placeholder="e.g., 7A, 8B"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lesson-date">Date</Label>
              <Input
                id="lesson-date"
                type="date"
                value={formData.lesson_date}
                onChange={(e) => setFormData(prev => ({ ...prev, lesson_date: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                className="mt-1"
                min="15"
                max="180"
                step="5"
                required
              />
            </div>
          </div>
        </div>

        {/* Auto-fill Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Auto-filled from Timetable</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-700 font-medium">Period:</span> Period 3 (11:30-12:30)
            </div>
            <div>
              <span className="text-green-700 font-medium">Room:</span> M12
            </div>
            <div>
              <span className="text-green-700 font-medium">Students:</span> 28 enrolled
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-600">
            Your lesson plan will automatically integrate with attendance, gradebook, and assignments.
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2 hover-scale">
              <Save className="h-4 w-4" />
              Save & Create Homework
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
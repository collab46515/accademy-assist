import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Upload,
  File,
  Image,
  FileText,
  Video,
  Music,
  Trash2,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  X
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  maxSize: number; // in MB
  allowedTypes: string[];
  isRequired: boolean;
  submissions: AssignmentSubmission[];
}

interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  files: SubmittedFile[];
  submittedAt: Date;
  status: 'submitted' | 'late' | 'pending';
  comments?: string;
}

interface SubmittedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface AssignmentDropZoneProps {
  roomId: string;
  userRole: 'teacher' | 'student';
  userId: string;
  userName: string;
  isVisible: boolean;
  onClose: () => void;
}

export const AssignmentDropZone: React.FC<AssignmentDropZoneProps> = ({
  roomId,
  userRole,
  userId,
  userName,
  isVisible,
  onClose
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Algebra Worksheet Solutions',
      description: 'Submit your completed worksheet with all working shown',
      dueDate: new Date(Date.now() + 86400000), // 1 day from now
      maxSize: 10,
      allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      isRequired: true,
      submissions: [
        {
          id: 's1',
          studentId: '1',
          studentName: 'Sarah Johnson',
          files: [
            {
              id: 'f1',
              name: 'algebra_solutions.pdf',
              size: 2.5 * 1024 * 1024, // 2.5MB
              type: 'pdf',
              url: '/uploads/algebra_solutions.pdf',
              uploadedAt: new Date(Date.now() - 300000)
            }
          ],
          submittedAt: new Date(Date.now() - 300000),
          status: 'submitted',
          comments: 'Completed all problems with detailed working'
        }
      ]
    }
  ]);

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [submissionComment, setSubmissionComment] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxSize: 10,
    allowedTypes: ['pdf', 'doc', 'docx'],
    isRequired: true
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-4 w-4" />;
    if (type.includes('video')) return <Video className="h-4 w-4" />;
    if (type.includes('audio')) return <Music className="h-4 w-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return 'Overdue';
    if (hours < 24) return `${hours}h ${minutes}m remaining`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const submitAssignment = async () => {
    if (!currentAssignment || selectedFiles.length === 0) return;

    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Create submission
    const newSubmission: AssignmentSubmission = {
      id: Date.now().toString(),
      studentId: userId,
      studentName: userName,
      files: selectedFiles.map((file, index) => ({
        id: `f${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date()
      })),
      submittedAt: new Date(),
      status: new Date() <= currentAssignment.dueDate ? 'submitted' : 'late',
      comments: submissionComment
    };

    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === currentAssignment.id
          ? { ...assignment, submissions: [...assignment.submissions, newSubmission] }
          : assignment
      )
    );

    setSelectedFiles([]);
    setSubmissionComment('');
    setCurrentAssignment(null);
    setUploading(false);
    setUploadProgress(0);
  };

  const createAssignment = () => {
    if (!newAssignment.title.trim()) return;

    const assignment: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: new Date(newAssignment.dueDate),
      maxSize: newAssignment.maxSize,
      allowedTypes: newAssignment.allowedTypes,
      isRequired: newAssignment.isRequired,
      submissions: []
    };

    setAssignments(prev => [...prev, assignment]);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: '',
      maxSize: 10,
      allowedTypes: ['pdf', 'doc', 'docx'],
      isRequired: true
    });
    setShowCreateForm(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Assignment Drop Zone</h2>
              <p className="text-slate-600">Submit and manage class assignments</p>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Teacher: Create assignment form */}
          {userRole === 'teacher' && showCreateForm && (
            <Card className="p-4 mb-6">
              <h3 className="font-semibold mb-3">Create New Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded mt-1"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={createAssignment}>Create Assignment</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </div>
            </Card>
          )}

          {/* Teacher: Create assignment button */}
          {userRole === 'teacher' && !showCreateForm && (
            <div className="mb-6">
              <Button onClick={() => setShowCreateForm(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Create New Assignment
              </Button>
            </div>
          )}

          {/* Assignment List */}
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      {assignment.isRequired && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {assignment.dueDate.toLocaleString()}
                      </span>
                      <span>Max size: {assignment.maxSize}MB</span>
                      <span>Types: {assignment.allowedTypes.join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      formatTimeRemaining(assignment.dueDate) === 'Overdue' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {formatTimeRemaining(assignment.dueDate)}
                    </div>
                    {userRole === 'teacher' && (
                      <div className="text-xs text-slate-500 mt-1">
                        {assignment.submissions.length} submission{assignment.submissions.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Student submission interface */}
                {userRole === 'student' && (
                  <div>
                    {/* Check if already submitted */}
                    {assignment.submissions.find(s => s.studentId === userId) ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Submitted</span>
                        </div>
                        {assignment.submissions
                          .filter(s => s.studentId === userId)
                          .map(submission => (
                            <div key={submission.id} className="space-y-2">
                              {submission.files.map(file => (
                                <div key={file.id} className="flex items-center gap-2 text-sm">
                                  {getFileIcon(file.type)}
                                  <span>{file.name}</span>
                                  <span className="text-slate-500">({formatFileSize(file.size)})</span>
                                </div>
                              ))}
                              <div className="text-xs text-slate-600">
                                Submitted: {submission.submittedAt.toLocaleString()}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div>
                        <Button
                          onClick={() => setCurrentAssignment(assignment)}
                          variant="outline"
                          className="mb-3"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Teacher view: submissions */}
                {userRole === 'teacher' && assignment.submissions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="font-medium mb-3">Submissions ({assignment.submissions.length})</h4>
                    <div className="space-y-2">
                      {assignment.submissions.map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-slate-500" />
                            <div>
                              <div className="text-sm font-medium">{submission.studentName}</div>
                              <div className="text-xs text-slate-500">
                                {submission.files.length} file{submission.files.length !== 1 ? 's' : ''} • 
                                {submission.submittedAt.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              submission.status === 'submitted' ? 'default' :
                              submission.status === 'late' ? 'destructive' : 'secondary'
                            }>
                              {submission.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Submission Modal */}
        {currentAssignment && userRole === 'student' && (
          <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold">Submit: {currentAssignment.title}</h3>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {/* Drop zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Max {currentAssignment.maxSize}MB • {currentAssignment.allowedTypes.join(', ')}
                  </p>
                  <input
                    type="file"
                    multiple
                    accept={currentAssignment.allowedTypes.map(type => `.${type}`).join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-input" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>

                {/* Selected files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Selected Files</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <div className="text-sm font-medium">{file.name}</div>
                              <div className="text-xs text-slate-500">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="mt-6">
                  <label className="text-sm font-medium">Comments (optional)</label>
                  <textarea
                    value={submissionComment}
                    onChange={(e) => setSubmissionComment(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded mt-1"
                    rows={3}
                    placeholder="Add any comments about your submission..."
                  />
                </div>

                {/* Upload progress */}
                {uploading && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-slate-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentAssignment(null);
                    setSelectedFiles([]);
                    setSubmissionComment('');
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitAssignment}
                  disabled={selectedFiles.length === 0 || uploading}
                >
                  {uploading ? 'Submitting...' : 'Submit Assignment'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
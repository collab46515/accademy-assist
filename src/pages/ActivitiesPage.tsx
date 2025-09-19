import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Trophy, 
  Search, 
  Plus,
  Users,
  Calendar,
  Award,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Eye,
  Edit,
  Loader2
} from "lucide-react";
import { ActivityManager } from "@/components/activities/ActivityManager";
import { HousePointsManager } from "@/components/activities/HousePointsManager";
import { useActivities } from "@/hooks/useActivities";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const ActivitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { activities, participants, housePoints, loading } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showParticipantDialog, setShowParticipantDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "full":
        return <Badge className="bg-warning text-warning-foreground">Full</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      sports: "bg-blue-500 text-white",
      arts: "bg-purple-500 text-white",
      academic: "bg-green-500 text-white",
      service: "bg-orange-500 text-white",
      "duke-of-edinburgh": "bg-red-500 text-white"
    };
    
    return <Badge className={colors[category]}>{category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</Badge>;
  };

  const getHouseBadge = (house: string) => {
    const colors = {
      "Gryffindor": "bg-red-600 text-white",
      "Hufflepuff": "bg-yellow-600 text-white",
      "Ravenclaw": "bg-blue-600 text-white",
      "Slytherin": "bg-green-600 text-white"
    };
    
    return <Badge className={colors[house as keyof typeof colors] || "bg-gray-500 text-white"}>{house}</Badge>;
  };

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivities = activities.length;
  const activeActivities = activities.filter(a => a.status === "active").length;
  const totalParticipants = activities.reduce((sum, activity) => sum + activity.enrolled, 0);
  const totalHousePoints = housePoints.reduce((sum, hp) => sum + hp.points, 0);

  const handleManageActivity = (activity: any) => {
    setSelectedActivity(activity);
    setShowActivityDialog(true);
  };

  const handleViewParticipant = (participant: any) => {
    setSelectedParticipant(participant);
    setShowParticipantDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Extracurricular Activities</h1>
        <p className="text-muted-foreground">Track co-curricular engagement, DofE, house points, and trip participation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-3xl font-bold text-primary">{totalActivities}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{activeActivities}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-3xl font-bold text-primary">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">House Points</p>
                <p className="text-3xl font-bold text-warning">{totalHousePoints}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="house-points">House Points</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Activity Management</span>
                  </CardTitle>
                  <CardDescription>Manage extracurricular activities and clubs</CardDescription>
                </div>
                <ActivityManager />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities by name, instructor, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading activities...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.name}</TableCell>
                          <TableCell>{getCategoryBadge(activity.category)}</TableCell>
                          <TableCell>{activity.instructor}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <Clock className="h-3 w-3" />
                              <span>{activity.schedule}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.location || 'Not specified'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{activity.enrolled}/{activity.capacity}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(activity.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleManageActivity(activity)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {activities.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No activities found. Use the Activity Manager to add new activities.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participation">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Student Participation</span>
              </CardTitle>
              <CardDescription>Track individual student involvement in activities</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading participants...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Enrolled</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Achievements</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">Student {record.student_id}</TableCell>
                          <TableCell>Activity {record.activity_id}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500 text-white">Active</Badge>
                          </TableCell>
                          <TableCell>{new Date(record.enrollment_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm">{record.attendance_count || 0} sessions</div>
                              {(record.attendance_count || 0) >= 10 && <CheckCircle className="h-4 w-4 text-success" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={record.status === "active" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.achievements && record.achievements.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {record.achievements.map((achievement, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewParticipant(record)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {participants.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No participants found. Students will appear here when they enroll in activities.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="house-points">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>House Points System</span>
                  </CardTitle>
                  <CardDescription>Award and track house points for student achievements</CardDescription>
                </div>
                <HousePointsManager />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading house points...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>House</TableHead>
                        <TableHead>Points</TableHead>
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
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-warning" />
                              <span className="font-bold">{point.points}</span>
                            </div>
                          </TableCell>
                          <TableCell>{point.reason}</TableCell>
                          <TableCell>{point.awarded_by}</TableCell>
                          <TableCell>{new Date(point.awarded_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {housePoints.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No house points awarded yet. Use the House Points Manager to award points.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Management Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>
              View and manage activity information
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Activity Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="mt-1">{getCategoryBadge(selectedActivity.category)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Instructor</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.instructor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.schedule}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.location || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Capacity</Label>
                  <p className="text-sm text-muted-foreground">{selectedActivity.enrolled}/{selectedActivity.capacity}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedActivity.status)}</div>
                </div>
                {selectedActivity.cost && (
                  <div>
                    <Label className="text-sm font-medium">Cost</Label>
                    <p className="text-sm text-muted-foreground">₹{selectedActivity.cost}</p>
                  </div>
                )}
              </div>
              {selectedActivity.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedActivity.description}</p>
                </div>
              )}
              {selectedActivity.requirements?.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Requirements</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedActivity.requirements.map((req: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Participant Details Dialog */}
      <Dialog open={showParticipantDialog} onOpenChange={setShowParticipantDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Participant Details</DialogTitle>
            <DialogDescription>
              View participant information and progress
            </DialogDescription>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedParticipant.student_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Activity ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedParticipant.activity_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Enrollment Date</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedParticipant.enrollment_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={selectedParticipant.status === "active" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"}>
                    {selectedParticipant.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Attendance Count</Label>
                  <p className="text-sm text-muted-foreground">{selectedParticipant.attendance_count || 0} sessions</p>
                </div>
              </div>
              {selectedParticipant.achievements?.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Achievements</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedParticipant.achievements.map((achievement: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivitiesPage;
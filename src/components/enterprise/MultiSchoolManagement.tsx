import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Globe, 
  Users, 
  Settings, 
  Plus, 
  MapPin, 
  Calendar,
  Database,
  Network,
  Shield,
  Clock
} from "lucide-react";

interface School {
  id: string;
  name: string;
  code: string;
  type: 'primary' | 'secondary' | 'university' | 'campus';
  location: string;
  timezone: string;
  language: string;
  currency: string;
  academicYear: string;
  totalStudents: number;
  totalStaff: number;
  status: 'active' | 'inactive' | 'maintenance';
  parentOrganization?: string;
  settings: {
    allowCrossCampusEnrollment: boolean;
    centralizedReporting: boolean;
    sharedResources: boolean;
    autonomousScheduling: boolean;
  };
}

export function MultiSchoolManagement() {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [showAddSchool, setShowAddSchool] = useState(false);

  // Mock data for schools
  const mockSchools: School[] = [
    {
      id: 'school-1',
      name: 'Riverside Academy Main Campus',
      code: 'RSA-MAIN',
      type: 'primary',
      location: 'London, UK',
      timezone: 'Asia/Muscat',
      language: 'ar',
      currency: 'OMR',
      academicYear: '2024-2025',
      totalStudents: 850,
      totalStaff: 65,
      status: 'active',
      settings: {
        allowCrossCampusEnrollment: true,
        centralizedReporting: true,
        sharedResources: true,
        autonomousScheduling: false
      }
    },
    {
      id: 'school-2', 
      name: 'Riverside Academy North Campus',
      code: 'RSA-NORTH',
      type: 'secondary',
      location: 'Manchester, UK',
      timezone: 'Asia/Muscat',
      language: 'ar',
      currency: 'OMR',
      academicYear: '2024-2025',
      totalStudents: 1200,
      totalStaff: 95,
      status: 'active',
      parentOrganization: 'school-1',
      settings: {
        allowCrossCampusEnrollment: true,
        centralizedReporting: true,
        sharedResources: false,
        autonomousScheduling: true
      }
    },
    {
      id: 'school-3',
      name: 'École Internationale de Paris',
      code: 'EIP-MAIN',
      type: 'university',
      location: 'Paris, France',
      timezone: 'Europe/Paris',
      language: 'fr',
      currency: 'EUR',
      academicYear: '2024-2025',
      totalStudents: 2100,
      totalStaff: 180,
      status: 'active',
      settings: {
        allowCrossCampusEnrollment: false,
        centralizedReporting: false,
        sharedResources: false,
        autonomousScheduling: true
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'primary': return '🏫';
      case 'secondary': return '🎓';
      case 'university': return '🏛️';
      case 'campus': return '🏢';
      default: return '🏫';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Multi-School Management
            </CardTitle>
            <Button onClick={() => setShowAddSchool(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockSchools.length}</div>
                    <div className="text-sm text-muted-foreground">Total Schools</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockSchools.reduce((acc, school) => acc + school.totalStudents, 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Students</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{new Set(mockSchools.map(s => s.location.split(',')[1]?.trim())).size}</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {mockSchools.map((school) => (
              <Card key={school.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getTypeIcon(school.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{school.name}</h3>
                          <Badge variant="outline">{school.code}</Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(school.status)}`} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {school.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {school.timezone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {school.language.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{school.totalStudents.toLocaleString()}</span> students
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{school.totalStaff}</span> staff
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={school.settings.allowCrossCampusEnrollment}
                          disabled
                        />
                        <span>Cross-Campus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={school.settings.centralizedReporting}
                          disabled
                        />
                        <span>Central Reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={school.settings.sharedResources}
                          disabled
                        />
                        <span>Shared Resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={school.settings.autonomousScheduling}
                          disabled
                        />
                        <span>Auto Schedule</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* School Settings Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Organization Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hierarchy" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hierarchy" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">School Hierarchy Structure</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">Riverside Academy Group</span>
                      <Badge variant="secondary">Parent Organization</Badge>
                    </div>
                    <div className="ml-6 mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-px bg-border"></span>
                        <span>Main Campus (Primary)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-px bg-border"></span>
                        <span>North Campus (Secondary)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">École Internationale de Paris</span>
                      <Badge variant="secondary">Independent</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integration" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Cross-School Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Shared Student Records</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Unified Grading System</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Cross-Campus Transfers</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Centralized Calendar</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Resource Sharing</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Joint Reporting</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Multi-School Security</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Role-Based Access Control</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      School administrators can only access their own school data, 
                      while super administrators have multi-school access.
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4" />
                      <span className="font-medium">Data Isolation</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Each school's data is logically separated with robust 
                      Row-Level Security policies.
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reporting" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Multi-School Reporting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Consolidated Reports</h5>
                      <div className="text-sm text-muted-foreground mb-3">
                        Generate reports across all schools in your organization
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">School Comparisons</h5>
                      <div className="text-sm text-muted-foreground mb-3">
                        Compare performance metrics between schools
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
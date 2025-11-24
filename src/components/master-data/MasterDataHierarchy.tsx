import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, School, BookOpen, Users, Home, CreditCard, Info } from 'lucide-react';

export function MasterDataHierarchy() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Master Data Hierarchy & Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Follow this hierarchy when setting up your system. Data flows from top to bottom, so configure School Settings first, then Academic Structure, and so on.
            </AlertDescription>
          </Alert>

          {/* Level 1: School */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">School Settings</h3>
                  <Badge>Foundation</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Basic school information, contact details, and system configuration
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Level 2: Academic Structure */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Academic Structure</h3>
                  <Badge>Critical - Used Everywhere</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Define the academic organization that will be referenced throughout the system
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-8">
                  <Card className="border-2 border-primary/20">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-1">Year Groups</h4>
                      <p className="text-xs text-muted-foreground">
                        E.g., Year 7, Year 8, Year 9
                      </p>
                      <Badge variant="outline" className="mt-2">Used in:</Badge>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Fee Structures</li>
                        <li>• Admissions</li>
                        <li>• Student Assignment</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-primary/20">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-1">Classes/Sections</h4>
                      <p className="text-xs text-muted-foreground">
                        E.g., 7A, 7B, 8A, 8B
                      </p>
                      <Badge variant="outline" className="mt-2">Used in:</Badge>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Fee Heads</li>
                        <li>• Student Enrollment</li>
                        <li>• Timetables</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-primary/20">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-1">Subjects</h4>
                      <p className="text-xs text-muted-foreground">
                        E.g., Mathematics, Science, English
                      </p>
                      <Badge variant="outline" className="mt-2">Used in:</Badge>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Timetables</li>
                        <li>• Teacher Assignment</li>
                        <li>• Gradebooks</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Level 3: People */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">People</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Students (assigned to Year + Section), Staff (assigned to subjects/departments), Parents (linked to students)
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Level 4: Houses */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Houses</h3>
                  <Badge variant="secondary">Optional</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pastoral/house system for competitions and student grouping
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Level 5: Financial */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                5
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Financial Configuration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fee Heads (linked to specific Year Groups/Classes) → Fee Structures → Payment Plans → Discounts
                </p>
              </div>
            </div>
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Best Practice:</strong> Always define Year Groups and Classes in the Academic Structure section first. These will then automatically populate dropdowns in Fee Management, Admissions, Student Enrollment, and Timetabling.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

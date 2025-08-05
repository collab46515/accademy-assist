import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Brain,
  Sparkles,
  Calendar,
  BarChart3,
  Clock,
  Zap,
  Target,
  Grid3X3,
  Wand2
} from "lucide-react";

const AISuitePage = () => {
  const criticalInsights = 2;
  const activeFeatures = 3;
  const totalUsage = 492;
  const avgAccuracy = 91;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
          <Bot className="h-8 w-8 text-primary" />
          <span>AI & Automation Suite</span>
          <Badge className="bg-warning text-warning-foreground">Beta</Badge>
        </h1>
        <p className="text-muted-foreground">Smart features with AI-generated comments, predictive analytics, and automated scheduling</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Features</p>
                <p className="text-3xl font-bold text-primary">{activeFeatures}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-3xl font-bold text-success">{totalUsage}</p>
              </div>
              <Bot className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-3xl font-bold text-primary">{avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Insights</p>
                <p className="text-3xl font-bold text-destructive">{criticalInsights}</p>
              </div>
              <Brain className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/timetable'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>AI Timetable Generator</span>
            </CardTitle>
            <CardDescription>Automated scheduling with AI optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">87%</p>
                <p className="text-sm text-muted-foreground">Optimization rate</p>
              </div>
              <Button variant="outline" size="sm">
                Open Generator
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/lesson-planner'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <span>Lesson Planner</span>
            </CardTitle>
            <CardDescription>AI-powered lesson planning and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">23</p>
                <p className="text-sm text-muted-foreground">Plans generated</p>
              </div>
              <Button variant="outline" size="sm">
                Create Lesson
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/grading'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>AI Grading Assistant</span>
            </CardTitle>
            <CardDescription>Intelligent feedback and grading suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">12</p>
                <p className="text-sm text-muted-foreground">Submissions graded</p>
              </div>
              <Button variant="outline" size="sm">
                Grade Work
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/comments'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Comment Generator</span>
            </CardTitle>
            <CardDescription>AI-generated student report comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">Comments created</p>
              </div>
              <Button variant="outline" size="sm">
                Generate Comment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/insights'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Predictive Insights</span>
            </CardTitle>
            <CardDescription>Early warning system and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-destructive">{criticalInsights}</p>
                <p className="text-sm text-muted-foreground">Critical insights</p>
              </div>
              <Button variant="outline" size="sm">
                View Insights
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-suite/settings'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Grid3X3 className="h-5 w-5 text-primary" />
              <span>AI Settings</span>
            </CardTitle>
            <CardDescription>Configure AI models and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Models configured</p>
              </div>
              <Button variant="outline" size="sm">
                Manage Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-muted-foreground">
              <Zap className="h-5 w-5" />
              <span>More AI Features</span>
            </CardTitle>
            <CardDescription>Additional AI capabilities coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Voice assistants, image generation, and more AI-powered tools in development
              </p>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-[var(--shadow-card)] mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recent AI Activity</span>
          </CardTitle>
          <CardDescription>Latest AI-generated content and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Lesson plan generated</p>
                  <p className="text-sm text-muted-foreground">Mathematics - Year 7 Fractions</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">5 comments generated</p>
                  <p className="text-sm text-muted-foreground">Year 9 Science reports</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">4 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Predictive insight generated</p>
                  <p className="text-sm text-muted-foreground">Attendance warning for 8 students</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISuitePage;
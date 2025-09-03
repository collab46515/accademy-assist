import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileCode, 
  Database, 
  Layers, 
  GitBranch, 
  Shield, 
  Zap, 
  Globe,
  Code,
  BookOpen,
  Monitor,
  Brain,
  Cloud
} from 'lucide-react';

export default function TechnicalDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const techStack = [
    { name: "React 18", description: "Frontend framework with hooks", icon: Code, category: "Frontend" },
    { name: "TypeScript", description: "Type-safe JavaScript", icon: FileCode, category: "Language" },
    { name: "Tailwind CSS", description: "Utility-first CSS", icon: Monitor, category: "Styling" },
    { name: "Vite", description: "Fast build tool", icon: Zap, category: "Build" },
    { name: "Supabase", description: "Backend-as-a-Service", icon: Database, category: "Backend" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Technical Documentation</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive development guide for the DOXA Education Platform
              </p>
            </div>
            <Badge variant="secondary">v1.0.0</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Project Overview
                </CardTitle>
                <CardDescription>
                  DOXA is a comprehensive AI-powered education management platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {techStack.map((tech, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <tech.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-muted-foreground">{tech.description}</div>
                        <Badge variant="outline" className="text-xs mt-1">{tech.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Frontend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• React 18 with TypeScript</li>
                        <li>• Component-based architecture</li>
                        <li>• Tailwind CSS styling</li>
                        <li>• Responsive design</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Backend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Supabase BaaS</li>
                        <li>• PostgreSQL database</li>
                        <li>• Row Level Security</li>
                        <li>• Real-time subscriptions</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• AI Classroom Analytics</li>
                        <li>• Question Generation</li>
                        <li>• Timetable Optimization</li>
                        <li>• Lesson Planning</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Schema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Core Tables</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• profiles - User profiles and information</li>
                      <li>• schools - School organizations</li>
                      <li>• user_school_roles - RBAC system</li>
                      <li>• students - Student records</li>
                      <li>• attendance_records - Attendance tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Development Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
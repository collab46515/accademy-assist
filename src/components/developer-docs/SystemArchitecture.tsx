import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Layers, Database, Cloud, Lock, Zap } from 'lucide-react';

export function SystemArchitecture() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            System Architecture Overview
          </CardTitle>
          <CardDescription>
            Complete technical architecture of the School Management ERP System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Frontend
                </h4>
                <ul className="space-y-1 ml-6 text-sm text-muted-foreground">
                  <li>• React 18.3.1 - Component-based UI framework</li>
                  <li>• TypeScript - Type-safe development</li>
                  <li>• Vite - Fast build tool and dev server</li>
                  <li>• TailwindCSS - Utility-first styling</li>
                  <li>• React Router v6 - Client-side routing</li>
                  <li>• TanStack Query - Server state management</li>
                  <li>• Radix UI - Accessible component primitives</li>
                  <li>• Shadcn/ui - Component library</li>
                  <li>• Lucide React - Icon system</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Backend & Database
                </h4>
                <ul className="space-y-1 ml-6 text-sm text-muted-foreground">
                  <li>• Supabase - Backend as a Service</li>
                  <li>• PostgreSQL - Relational database</li>
                  <li>• Row Level Security (RLS) - Data security</li>
                  <li>• Supabase Auth - Authentication system</li>
                  <li>• Edge Functions - Serverless functions</li>
                  <li>• Real-time subscriptions</li>
                  <li>• Storage buckets - File management</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Architecture Layers</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">1. Presentation Layer (Frontend)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Located in: <code className="px-1 py-0.5 bg-muted rounded">src/pages/</code> and <code className="px-1 py-0.5 bg-muted rounded">src/components/</code>
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• Page components define routes and overall layout</li>
                  <li>• Feature components encapsulate business logic UI</li>
                  <li>• Shared UI components for consistency</li>
                  <li>• Responsive design with mobile-first approach</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">2. State Management Layer</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Located in: <code className="px-1 py-0.5 bg-muted rounded">src/hooks/</code>
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• <strong>useAuth</strong> - Authentication state and methods</li>
                  <li>• <strong>useRBAC</strong> - Role-based access control</li>
                  <li>• <strong>usePermissions</strong> - Fine-grained permission checking</li>
                  <li>• <strong>useSchoolModules</strong> - School-specific module access</li>
                  <li>• Custom hooks for data fetching and mutations</li>
                  <li>• TanStack Query for server state caching</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">3. API/Integration Layer</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Located in: <code className="px-1 py-0.5 bg-muted rounded">src/integrations/supabase/</code>
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• Supabase client configuration</li>
                  <li>• Auto-generated TypeScript types from database schema</li>
                  <li>• Query helpers and mutations</li>
                  <li>• Real-time subscription setup</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">4. Database Layer</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Located in: <code className="px-1 py-0.5 bg-muted rounded">supabase/migrations/</code>
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• PostgreSQL database with typed schema</li>
                  <li>• Row Level Security (RLS) policies for data protection</li>
                  <li>• Triggers and functions for business logic</li>
                  <li>• Enums for type safety (app_role, resource_type, etc.)</li>
                  <li>• Foreign key constraints for referential integrity</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Security Architecture</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Lock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Authentication</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supabase Auth handles user authentication with email/password. JWT tokens stored securely 
                    in httpOnly cookies. Password reset flow enforced via <code className="px-1 py-0.5 bg-muted rounded">must_change_password</code> flag.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Lock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Authorization (RBAC)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Multi-layered access control:
                  </p>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• <strong>Role-based</strong>: user_roles table with app_role enum</li>
                    <li>• <strong>Module-level</strong>: school_modules controls school access</li>
                    <li>• <strong>Permission-level</strong>: role_module_permissions for CRUD operations</li>
                    <li>• <strong>Field-level</strong>: field_permissions for column visibility</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Lock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Row Level Security (RLS)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    All tables have RLS enabled. Policies use <code className="px-1 py-0.5 bg-muted rounded">SECURITY DEFINER</code> functions 
                    like <code className="px-1 py-0.5 bg-muted rounded">is_super_admin()</code> and <code className="px-1 py-0.5 bg-muted rounded">can_access_student()</code> to 
                    prevent privilege escalation and recursive policy checks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Data Flow</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. <strong>User Action</strong> → Component triggers event handler</p>
              <p>2. <strong>Component</strong> → Calls custom hook (e.g., useAuth, usePermissions)</p>
              <p>3. <strong>Hook</strong> → Makes Supabase query with proper filters</p>
              <p>4. <strong>Supabase Client</strong> → Sends authenticated request to Supabase API</p>
              <p>5. <strong>RLS Policies</strong> → Validate access based on auth.uid() and roles</p>
              <p>6. <strong>Database</strong> → Returns authorized data only</p>
              <p>7. <strong>Hook</strong> → Updates TanStack Query cache</p>
              <p>8. <strong>Component</strong> → Re-renders with new data</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">File Structure</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <pre>{`
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base Shadcn components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   ├── [feature]/      # Feature-specific components
│   └── developer-docs/ # Documentation components
├── pages/              # Route page components
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useRBAC.tsx     # Role-based access control
│   └── usePermissions.tsx # Permission management
├── integrations/
│   └── supabase/       # Supabase client & types
├── lib/                # Utility functions
└── App.tsx             # Root component with routing

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions (if any)
              `}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Terminal, Database, Code, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function SetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Development Setup Guide
          </CardTitle>
          <CardDescription>
            Complete guide to set up the development environment and understand the codebase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This system uses Lovable (React + Vite + TypeScript) with Supabase backend. 
              All deployment is handled through Lovable platform.
            </AlertDescription>
          </Alert>

          <Accordion type="multiple" defaultValue={['prereq', 'project']} className="w-full">
            <AccordionItem value="prereq">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Prerequisites
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Required Software</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Node.js 18+ and npm/bun</li>
                      <li>• Git for version control</li>
                      <li>• VS Code or preferred IDE</li>
                      <li>• Supabase account</li>
                      <li>• Lovable account</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recommended VS Code Extensions</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• ES7+ React/Redux/React-Native snippets</li>
                      <li>• Tailwind CSS IntelliSense</li>
                      <li>• Prettier - Code formatter</li>
                      <li>• ESLint</li>
                      <li>• Supabase</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="project">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Project Structure Understanding
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs">
                    <pre>{`project-root/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base Shadcn components
│   │   ├── layout/         # Layout components
│   │   ├── admin/          # Admin-specific components
│   │   ├── assignments/    # Assignment feature components
│   │   ├── developer-docs/ # This documentation
│   │   └── [feature]/      # Other feature components
│   │
│   ├── pages/              # Route page components
│   │   ├── Dashboard.tsx
│   │   ├── StudentsPage.tsx
│   │   └── ...
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication
│   │   ├── useRBAC.tsx     # Access control
│   │   └── usePermissions.tsx
│   │
│   ├── integrations/
│   │   └── supabase/       # Supabase integration
│   │       ├── client.ts   # Supabase client
│   │       └── types.ts    # Auto-generated types
│   │
│   ├── lib/                # Utility functions
│   │   └── utils.ts
│   │
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── supabase/
│   └── migrations/         # Database migrations
│
├── public/                 # Static assets
├── components.json         # Shadcn config
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── package.json            # Dependencies`}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="database">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Setup
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Supabase Configuration</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Create a Supabase project at supabase.com</li>
                      <li>2. Note your project URL and anon key</li>
                      <li>3. Set environment variables in Lovable project settings</li>
                      <li>4. Run migrations from supabase/migrations/ directory</li>
                    </ol>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded">
                    <p className="text-xs mb-2"># Run migrations in Supabase SQL Editor</p>
                    <pre className="text-xs">{`-- Or use Supabase CLI
supabase db push

-- Generate TypeScript types
supabase gen types typescript --local > src/integrations/supabase/types.ts`}</pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Initial Data Setup</h4>
                    <pre className="bg-muted p-3 rounded text-xs">{`-- Create first super admin
INSERT INTO profiles (user_id, email, first_name, last_name)
VALUES (
  'auth-user-id', 
  'admin@system.com', 
  'Super', 
  'Admin'
);

INSERT INTO user_roles (user_id, role, is_active)
VALUES ('auth-user-id', 'super_admin', true);`}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="development">
              <AccordionTrigger className="text-lg font-semibold">
                Development Workflow
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Development Server</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Lovable provides automatic hot-reload development environment. 
                      Changes are reflected immediately.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Adding New Features</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. <strong>Database Changes:</strong> Create migration in supabase/migrations/</li>
                      <li>2. <strong>Types:</strong> Regenerate types from Supabase schema</li>
                      <li>3. <strong>Components:</strong> Create feature components in src/components/[feature]/</li>
                      <li>4. <strong>Pages:</strong> Add page component in src/pages/</li>
                      <li>5. <strong>Routes:</strong> Register route in src/App.tsx</li>
                      <li>6. <strong>Navigation:</strong> Add to AppSidebar.tsx if needed</li>
                      <li>7. <strong>Permissions:</strong> Configure in role_module_permissions table</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Code Style Guidelines</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Use TypeScript for type safety</li>
                      <li>• Follow React hooks best practices</li>
                      <li>• Keep components small and focused</li>
                      <li>• Use Tailwind CSS semantic tokens from index.css</li>
                      <li>• Never use direct colors - always use design system</li>
                      <li>• Extract reusable logic into custom hooks</li>
                      <li>• Write clear component and function names</li>
                      <li>• Add comments for complex business logic</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Security Best Practices
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>CRITICAL:</strong> Never store roles in localStorage or check admin status client-side. 
                      Always enforce security at database level with RLS.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h4 className="font-semibold mb-2">Security Checklist</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>RLS Policies:</strong> Every table must have RLS enabled and policies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Separate user_roles table:</strong> Roles stored separately, never in profiles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>SECURITY DEFINER functions:</strong> Use for permission checks to avoid recursion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Multi-layer validation:</strong> Validate at DB, API, and UI levels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>School isolation:</strong> Users can only access their assigned school data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Sensitive data:</strong> Extra policies for safeguarding, financial data</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Example Secure Pattern</h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs">{`-- ❌ WRONG: Checking role in client
if (user.role === 'admin') {
  // This can be manipulated!
}

-- ✅ CORRECT: Using RLS and SECURITY DEFINER
-- Database function
CREATE FUNCTION is_super_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Bypasses RLS for the check
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid
    AND role = 'super_admin'
    AND is_active = true
  );
$$;

-- RLS Policy
CREATE POLICY "Only admins can delete"
ON students FOR DELETE
USING (is_super_admin(auth.uid()));`}</pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-lg font-semibold">
                Common Issues & Troubleshooting
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Issue: "Row Level Security policy violation"</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Cause:</strong> User doesn't have required role or RLS policy is too restrictive
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solution:</strong> Check user_roles table for correct role assignment. 
                      Verify RLS policy logic in Supabase.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Issue: "Infinite recursion detected"</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Cause:</strong> RLS policy calls function that queries same table
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solution:</strong> Use SECURITY DEFINER functions to break recursion
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Issue: "Types not matching database schema"</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Cause:</strong> Database schema changed but types not regenerated
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solution:</strong> Run <code className="bg-muted px-1 rounded">supabase gen types typescript</code>
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Issue: User sees modules they shouldn't</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Cause:</strong> school_modules table not configured for their school
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Solution:</strong> Configure module access in Module Features page (super admin only)
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

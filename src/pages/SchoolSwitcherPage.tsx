import { useRBAC } from '@/hooks/useRBAC';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Check } from 'lucide-react';

export default function SchoolSwitcherPage() {
  const { schools, currentSchool, switchSchool, isSuperAdmin } = useRBAC();

  console.log('🏫 SchoolSwitcher Page:', {
    isSuperAdmin: isSuperAdmin(),
    schoolsCount: schools.length,
    schools: schools,
    currentSchool: currentSchool
  });

  if (!isSuperAdmin()) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need super admin privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>School Switcher</CardTitle>
          <CardDescription>
            Switch between schools. You are currently viewing: <strong>{currentSchool?.name || 'None'}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Total schools: {schools.length}
          </div>
          
          {schools.length === 0 ? (
            <p className="text-muted-foreground">No schools found in the system.</p>
          ) : (
            <div className="grid gap-3">
              {schools.map((school) => (
                <Button
                  key={school.id}
                  variant={currentSchool?.id === school.id ? "default" : "outline"}
                  className="justify-start h-auto py-4"
                  onClick={() => {
                    console.log('🔄 Switching to school:', school);
                    switchSchool(school);
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Building2 className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{school.name}</div>
                      <div className="text-xs opacity-70">{school.code}</div>
                    </div>
                    {currentSchool?.id === school.id && (
                      <Check className="h-5 w-5" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

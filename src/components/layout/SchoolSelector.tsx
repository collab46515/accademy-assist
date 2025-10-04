import { useRBAC } from '@/hooks/useRBAC';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export function SchoolSelector() {
  const { schools, currentSchool, switchSchool, loading, isSuperAdmin } = useRBAC();

  console.log('🏫 SchoolSelector Debug:', {
    isSuperAdmin: isSuperAdmin(),
    schoolsCount: schools.length,
    schools: schools,
    currentSchool: currentSchool,
    loading: loading
  });

  // Always show for super admins, or if there are multiple schools
  if (!isSuperAdmin() && schools.length <= 1) {
    console.log('❌ SchoolSelector hidden: Not super admin and <= 1 school');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card">
        <Building2 className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading schools...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
      <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
      <Select
        value={currentSchool?.id || ''}
        onValueChange={(value) => {
          const school = schools.find(s => s.id === value);
          if (school) {
            console.log('🔄 Switching to school:', school);
            switchSchool(school);
          }
        }}
      >
        <SelectTrigger className="w-56 border-0 focus:ring-0 focus:ring-offset-0 bg-transparent hover:bg-transparent">
          <SelectValue placeholder="Select school">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium truncate">{currentSchool?.name || "No school selected"}</span>
              {schools.length > 1 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {schools.length} schools
                </Badge>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[100] bg-popover border shadow-lg min-w-[280px]">
          {schools.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              No schools available
            </div>
          ) : (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                Switch School
              </div>
              {schools.map((school) => (
                <SelectItem 
                  key={school.id} 
                  value={school.id}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col py-1">
                    <span className="font-medium">{school.name}</span>
                    <span className="text-xs text-muted-foreground">{school.code}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
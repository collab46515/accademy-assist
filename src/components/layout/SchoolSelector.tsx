import { useRBAC } from '@/hooks/useRBAC';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown } from 'lucide-react';

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

  console.log('✅ SchoolSelector RENDERING');

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-primary/20 bg-card hover:border-primary/40 hover:bg-accent transition-all cursor-pointer shadow-sm">
      <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
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
        <SelectTrigger className="h-auto w-auto min-w-[200px] border-0 focus:ring-0 focus:ring-offset-0 bg-transparent hover:bg-transparent p-0">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">{currentSchool?.name || "No school"}</span>
              <span className="text-xs text-muted-foreground">{currentSchool?.code || "Select school"}</span>
            </div>
            <div className="flex items-center gap-1">
              {schools.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {schools.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="z-[100] bg-popover border shadow-lg min-w-[280px]">
          {schools.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              No schools available
            </div>
          ) : (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Switch School
              </div>
              {schools.map((school) => (
                <SelectItem 
                  key={school.id} 
                  value={school.id}
                  className="cursor-pointer hover:bg-accent"
                >
                  <div className="flex flex-col py-1">
                    <span className="font-medium text-sm">{school.name}</span>
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
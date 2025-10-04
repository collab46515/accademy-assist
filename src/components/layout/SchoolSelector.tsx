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
    <div className="w-full">
      <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
        Current School
      </div>
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
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex flex-col items-start flex-1 text-left">
              <span className="font-medium text-sm">{currentSchool?.name || "No school"}</span>
              <span className="text-xs text-muted-foreground">{currentSchool?.code || "Select school"}</span>
            </div>
            {schools.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                {schools.length}
              </Badge>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="z-[200] bg-popover border shadow-lg w-full">
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
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <div className="flex flex-col py-1">
                      <span className="font-medium text-sm">{school.name}</span>
                      <span className="text-xs text-muted-foreground">{school.code}</span>
                    </div>
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
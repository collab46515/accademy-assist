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

  // Don't hide for super admins - always show
  if (!isSuperAdmin()) {
    if (schools.length <= 1) {
      console.log('❌ SchoolSelector hidden: Not super admin and <= 1 school');
      return null;
    }
  }

  console.log('✅ SchoolSelector RENDERING for super admin or multi-school user');

  return (
    <div className="w-full space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase">
        Switch School
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 animate-pulse" />
          <span>Loading schools...</span>
        </div>
      ) : schools.length === 0 ? (
        <div className="text-sm text-muted-foreground">No schools found</div>
      ) : (
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
                <span className="font-medium text-sm">{currentSchool?.name || "Select a school"}</span>
                {currentSchool?.code && (
                  <span className="text-xs text-muted-foreground">{currentSchool.code}</span>
                )}
              </div>
              {schools.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {schools.length}
                </Badge>
              )}
            </div>
          </SelectTrigger>
          <SelectContent className="z-[200] bg-popover border shadow-lg w-full">
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
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
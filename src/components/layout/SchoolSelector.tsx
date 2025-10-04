import { useRBAC } from '@/hooks/useRBAC';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export function SchoolSelector() {
  const { schools, currentSchool, switchSchool, getCurrentSchoolRoles, isSuperAdmin } = useRBAC();

  // Always show for super admins, or if there are multiple schools
  if (!isSuperAdmin() && schools.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card">
      <Building2 className="h-4 w-4 text-primary" />
      <Select
        value={currentSchool?.id || ''}
        onValueChange={(value) => {
          const school = schools.find(s => s.id === value);
          if (school) switchSchool(school);
        }}
      >
        <SelectTrigger className="w-56 border-0 focus:ring-0 bg-transparent">
          <SelectValue placeholder="Select school">
            <span className="font-medium">{currentSchool?.name || "No school selected"}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[100] bg-popover border shadow-lg">
          {schools.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No schools available
            </div>
          ) : (
            schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{school.name}</span>
                  <span className="text-xs text-muted-foreground">{school.code}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
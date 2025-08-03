import { useRBAC } from '@/hooks/useRBAC';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export function SchoolSelector() {
  const { schools, currentSchool, switchSchool, getCurrentSchoolRoles, isSuperAdmin } = useRBAC();

  if (schools.length <= 1 && !isSuperAdmin()) {
    return null;
  }

  const currentRoles = getCurrentSchoolRoles();

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currentSchool?.id || ''}
        onValueChange={(value) => {
          const school = schools.find(s => s.id === value);
          if (school) switchSchool(school);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select school">
            {currentSchool?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {schools.map((school) => (
            <SelectItem key={school.id} value={school.id}>
              <div className="flex flex-col">
                <span>{school.name}</span>
                <span className="text-sm text-muted-foreground">{school.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {currentRoles.length > 0 && (
        <div className="flex gap-1">
          {currentRoles.map((userRole, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {userRole.role.replace('_', ' ').toUpperCase()}
              {userRole.department && ` - ${userRole.department}`}
              {userRole.year_group && ` - Year ${userRole.year_group}`}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
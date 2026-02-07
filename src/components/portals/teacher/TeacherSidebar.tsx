import { usePermissions } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  User,
  DollarSign,
  PlaneTakeoff,
  BookOpen,
  CheckSquare,
  Clipboard,
  FileText,
  Calendar,
  Users,
  Award,
  BookMarked,
  Bus,
  Library,
  Target,
  Heart,
  Activity,
  AlertCircle,
  Shield,
  Sparkles,
  UserPlus,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Clipboard,
  FileText,
  Calendar,
  Users,
  Award,
  BookMarked,
  Bus,
  Library,
  Target,
  Heart,
  Activity,
  AlertCircle,
  Shield,
  Sparkles,
  UserPlus,
  GraduationCap,
  DollarSign,
};

interface TeacherSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const portalTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
  { id: 'hr-details', label: 'HR Details', icon: User },
  { id: 'payroll', label: 'Payroll', icon: DollarSign },
  { id: 'leave', label: 'Leave Management', icon: PlaneTakeoff },
];

export function TeacherSidebar({ activeView, onViewChange }: TeacherSidebarProps) {
  const { getAccessibleModules, loading } = usePermissions();
  const navigate = useNavigate();

  const accessibleModules = getAccessibleModules().filter(
    (m) => m.name !== 'Dashboard' && m.name !== 'HOD Dashboard'
  );

  const handleModuleClick = (route: string) => {
    // Navigate to the full module page
    const routeMap: Record<string, string> = {
      '/assignments': '/academics/assignments',
      '/attendance': '/attendance',
      '/curriculum': '/academics/curriculum',
      '/gradebook': '/academics/gradebook',
      '/exams': '/academics/exams',
      '/students': '/students',
      '/reports': '/academics/report-cards',
    };
    navigate(routeMap[route] || route);
  };

  const getModuleIcon = (iconName?: string): LucideIcon => {
    if (iconName && iconMap[iconName]) return iconMap[iconName];
    return FileText;
  };

  return (
    <aside className="w-60 shrink-0 border-r bg-card/50 min-h-[calc(100vh-4rem)]">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            My Portal
          </p>
          {portalTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={cn(
                'flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeView === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>

        {accessibleModules.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="p-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Modules
              </p>
              {accessibleModules.map((mod) => {
                const Icon = getModuleIcon(mod.icon || undefined);
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod.route)}
                    className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {mod.name}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {loading && accessibleModules.length === 0 && (
          <>
            <Separator className="my-2" />
            <div className="p-4">
              <p className="text-xs text-muted-foreground px-3">Loading modules...</p>
            </div>
          </>
        )}
      </ScrollArea>
    </aside>
  );
}

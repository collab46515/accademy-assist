import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  Calendar,
  BookOpen,
  Calculator,
  BarChart3,
  MessageSquare,
  CreditCard,
  FileText,
  Shield,
  Globe,
  Settings,
  Bot,
  Activity,
  Building2,
  ChevronDown,
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  ClipboardCheck,
  UserCheck,
  Award,
  BookCheck,
  GraduationCap as GradCap,
  Target,
  UserCog,
  TrendingUp,
  Briefcase,
  MapPin,
  DollarSign,
  PieChart,
  ClipboardList,
  Folder,
  Package,
  Timer,
  Plane,
  Receipt,
  MessageCircle
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SchoolSelector } from "@/components/layout/SchoolSelector";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Main navigation items
const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
];

// Student management items
const studentItems = [
  { title: "Students", url: "/students", icon: Users },
  { title: "Unified Admissions", url: "/admissions", icon: UserPlus },
  { title: "Attendance", url: "/attendance", icon: Calendar },
];

// Academic items
const academicItems = [
  { title: "Curriculum", url: "/curriculum", icon: BookOpen },
  { title: "Timetable", url: "/timetable", icon: Clock },
  { title: "Gradebook", url: "/gradebook", icon: Calculator },
  { title: "Exams", url: "/exams", icon: FileText },
];

// Staff and operations items
const operationsItems = [
  { title: "Staff", url: "/staff", icon: Users },
  { title: "HR Management", url: "/hr-management", icon: UserCheck },
  { title: "Accounting", url: "/accounting", icon: Calculator },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Communications", url: "/communication", icon: MessageSquare },
  { title: "Finance", url: "/finance", icon: CreditCard },
];

// HR Management sub-items (only show when on HR page)
const hrItems = [
  { title: "Employee Directory", url: "/hr-management?tab=employees", icon: Users },
  { title: "Performance Management", url: "/hr-management?tab=performance", icon: Target },
  { title: "Recruitment", url: "/hr-management?tab=recruitment", icon: UserCog },
  { title: "Training & Development", url: "/hr-management?tab=training", icon: GraduationCap },
  { title: "Benefits Management", url: "/hr-management?tab=benefits", icon: Award },
  { title: "Document Management", url: "/hr-management?tab=documents", icon: Folder },
  { title: "Asset Management", url: "/hr-management?tab=assets", icon: Package },
  { title: "Time Tracking", url: "/hr-management?tab=timeTracking", icon: Timer },
  { title: "Travel & Expenses", url: "/hr-management?tab=travelExpenses", icon: Plane },
  { title: "Employee Engagement", url: "/hr-management?tab=engagement", icon: MessageCircle },
  { title: "Payroll & Benefits", url: "/hr-management?tab=payroll", icon: DollarSign },
  { title: "Leave Management", url: "/hr-management?tab=leave", icon: Calendar },
  { title: "Attendance Tracking", url: "/hr-management?tab=attendance", icon: Clock },
];

// Additional features
const featuresItems = [
  { title: "Events", url: "/events", icon: Activity },
  { title: "Activities", url: "/activities", icon: Activity },
  { title: "Safeguarding", url: "/safeguarding", icon: Shield },
  { title: "Portals", url: "/portals", icon: Globe },
];

// System items
const systemItems = [
  { title: "Admin Management", url: "/admin-management", icon: Shield },
  { title: "AI Suite", url: "/ai-suite", icon: Bot },
  { title: "Integrations", url: "/integrations", icon: Settings },
  { title: "User Management", url: "/user-management", icon: Users },
];

// Admission Process Stages (detailed workflow stages)
const admissionStages = [
  { title: "Application Submitted", url: "/admissions?stage=0", icon: Send },
  { title: "Document Verification", url: "/admissions?stage=1", icon: FileText },
  { title: "Application Review", url: "/admissions?stage=2", icon: Eye },
  { title: "Assessment/Interview", url: "/admissions?stage=3", icon: ClipboardCheck },
  { title: "Admission Decision", url: "/admissions?stage=4", icon: CheckCircle },
  { title: "Fee Payment", url: "/admissions?stage=5", icon: CreditCard },
  { title: "Enrollment Confirmation", url: "/admissions?stage=6", icon: UserCheck },
  { title: "Welcome & Onboarding", url: "/admissions?stage=7", icon: Users },
];

interface SidebarGroupItemsProps {
  title: string;
  items: Array<{ title: string; url: string; icon: any }>;
  defaultOpen?: boolean;
}

function SidebarGroupItems({ title, items, defaultOpen = false }: SidebarGroupItemsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  
  // Check if any item in this group is active - include query parameters for admission stages
  const hasActiveItem = items.some(item => {
    if (item.url.includes('?')) {
      return location.pathname + location.search === item.url;
    }
    return location.pathname === item.url;
  });
  
  const getNavClassName = (isActive: boolean) => 
    isActive ? "bg-gradient-to-r from-primary/10 to-primary-glow/5 text-primary font-medium border-r-2 border-primary" : "";

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/70 rounded-lg px-2 py-1.5 transition-colors flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>{title}</span>
            {state !== "collapsed" && (
              isOpen ? <ChevronDown className="h-3 w-3 opacity-60" /> : <ChevronRight className="h-3 w-3 opacity-60" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url.includes('?') 
                  ? location.pathname + location.search === item.url
                  : location.pathname === item.url;
                  
                const handleClick = () => {
                  if (item.url.includes('?')) {
                    // For admission stages with filters, use programmatic navigation
                    navigate(item.url);
                  }
                };
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild={!item.url.includes('?')}
                      isActive={isActive}
                      tooltip={state === "collapsed" ? item.title : undefined}
                      onClick={item.url.includes('?') ? handleClick : undefined}
                    >
                      {item.url.includes('?') ? (
                        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${getNavClassName(isActive)}`}>
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{item.title}</span>
                        </div>
                      ) : (
                        <NavLink 
                          to={item.url}
                          className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${getNavClassName(isActive)}`}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{item.title}</span>
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  
  const getNavClassName = (isActive: boolean) => 
    isActive ? "bg-gradient-to-r from-primary/10 to-primary-glow/5 text-primary font-medium border-r-2 border-primary" : "";

  return (
    <Sidebar collapsible="icon" className="border-r shadow-lg">
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-sm">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">School Manager</span>
              <span className="text-xs text-muted-foreground">Education Platform</span>
            </div>
          )}
        </div>
        {state !== "collapsed" && <SchoolSelector />}
      </SidebarHeader>
      
      <SidebarContent className="gap-0">
        {/* Main Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${getNavClassName(isActive)}`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Student Management */}
        <SidebarGroupItems 
          title="Student Management" 
          items={studentItems} 
          defaultOpen={studentItems.some(item => location.pathname === item.url)}
        />

        {/* Admission Process Stages - Only show when on admissions page */}
        {location.pathname === '/admissions' && (
          <SidebarGroupItems 
            title="Admission Stages" 
            items={admissionStages}
            defaultOpen={true}
          />
        )}

        {/* HR Management sub-items - Only show when on HR page */}
        {location.pathname === '/hr-management' && (
          <SidebarGroupItems 
            title="HR Features" 
            items={hrItems}
            defaultOpen={true}
          />
        )}

        {/* Academic */}
        <SidebarGroupItems 
          title="Academic" 
          items={academicItems}
          defaultOpen={academicItems.some(item => location.pathname === item.url)}
        />

        {/* Operations */}
        <SidebarGroupItems 
          title="Operations" 
          items={operationsItems}
          defaultOpen={operationsItems.some(item => location.pathname === item.url)}
        />

        {/* Additional Features */}
        <SidebarGroupItems 
          title="Features" 
          items={featuresItems}
          defaultOpen={featuresItems.some(item => location.pathname === item.url)}
        />

        {/* System */}
        <SidebarGroupItems 
          title="System" 
          items={systemItems}
          defaultOpen={systemItems.some(item => location.pathname === item.url)}
        />
      </SidebarContent>
    </Sidebar>
  );
}
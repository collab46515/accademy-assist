import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  GraduationCap as GradCap
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
  { title: "Gradebook", url: "/gradebook", icon: Calculator },
  { title: "Exams", url: "/exams", icon: FileText },
];

// Staff and operations items
const operationsItems = [
  { title: "Staff", url: "/staff", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Communications", url: "/communication", icon: MessageSquare },
  { title: "Finance", url: "/finance", icon: CreditCard },
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

// Admission Process Stages (high-level workflow overview)
const admissionStages = [
  { title: "New Applications", url: "/admissions?tab=management&filter=submitted", icon: Send },
  { title: "Under Review", url: "/admissions?tab=management&filter=under_review", icon: Eye },
  { title: "Assessment Stage", url: "/admissions?tab=management&filter=assessment_scheduled", icon: ClipboardCheck },
  { title: "Interview Stage", url: "/admissions?tab=management&filter=interview_scheduled", icon: UserCheck },
  { title: "Decision Pending", url: "/admissions?tab=management&filter=pending_approval", icon: Clock },
  { title: "Approved Applications", url: "/admissions?tab=management&filter=approved", icon: CheckCircle },
  { title: "Requires Attention", url: "/admissions?tab=management&filter=requires_override", icon: AlertTriangle },
];

interface SidebarGroupItemsProps {
  title: string;
  items: Array<{ title: string; url: string; icon: any }>;
  defaultOpen?: boolean;
}

function SidebarGroupItems({ title, items, defaultOpen = false }: SidebarGroupItemsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const { state } = useSidebar();
  
  // Check if any item in this group is active - include query parameters for admission stages
  const hasActiveItem = items.some(item => {
    if (item.url.includes('?')) {
      return location.pathname + location.search === item.url;
    }
    return location.pathname === item.url;
  });
  
  const getNavClassName = (isActive: boolean) => 
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "";

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md flex items-center justify-between">
            <span>{title}</span>
            {state !== "collapsed" && (
              isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
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
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(isActive)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
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
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <Building2 className="h-6 w-6 text-primary" />
          {state !== "collapsed" && (
            <span className="font-semibold text-sidebar-foreground">School Manager</span>
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
                        className={getNavClassName(isActive)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
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
import React, { useState, useMemo, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  Calendar,
  CalendarDays,
  BookOpen,
  Calculator,
  CreditCard,
  MessageSquare,
  Heart,
  UserCheck,
  BarChart3,
  Settings,
  Library,
  Truck,
  Shield,
  Target,
  FileText,
  DollarSign,
  Database,
  Globe,
  ExternalLink,
  UserCog,
  CheckSquare,
  ClipboardList,
  ClipboardCheck,
  Clock,
  Receipt,
  Building2,
  PieChart,
  Building,
  Route,
  MapPin,
  BookOpenCheck,
  Bookmark,
  ChevronDown,
  ChevronRight,
  LogOut,
  Send,
  Eye,
  CheckCircle,
  UserMinus,
  PenTool,
  Plus,
  AlertTriangle,
  Monitor,
  Bot,
  ShoppingCart,
  Brain
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Logical Business-Focused ERP Module Structure
const erpModules = [
  {
    title: "EDU ERP",
    url: "/dashboard",
    icon: LayoutDashboard,
    subItems: []
  },
  {
    title: "Academic Operations",
    url: "/academic-operations",
    icon: GraduationCap,
    subItems: [
      { title: "Dashboard", url: "/academic-operations", icon: LayoutDashboard },
      { title: "Admissions Workflow", url: "/admissions", icon: UserPlus },
      { title: "Curriculum & Lessons", url: "/curriculum", icon: BookOpen },
      { title: "Academic Management", url: "/academic-management", icon: GraduationCap },
      { title: "Timetable Management", url: "/timetable", icon: Clock },
      
      { title: "Exams & Assessment", url: "/exams", icon: ClipboardCheck },
      { title: "Assignments", url: "/academics/assignments", icon: ClipboardList },
      { title: "Report Cards", url: "/academics/reports", icon: FileText },
      { title: "Gradebook", url: "/gradebook", icon: BookOpenCheck },
      { title: "HOD Dashboard", url: "/hod-dashboard", icon: Target },
    ]
  },
  {
    title: "Student Services",
    url: "/student-services",
    icon: Users,
    subItems: [
      { title: "Dashboard", url: "/student-services", icon: LayoutDashboard },
      { title: "Student Directory", url: "/students", icon: Users },
      { title: "Attendance Tracking", url: "/attendance", icon: CheckSquare },
      { title: "Library Services", url: "/library", icon: Library },
      { title: "Transport Management", url: "/transport", icon: Truck },
      { title: "Behavior Tracking", url: "/behavior-tracking", icon: Target },
      { title: "Student Welfare", url: "/student-welfare", icon: Heart },
      { title: "Activities & Events", url: "/activities", icon: Calendar },
      { title: "Communication", url: "/communication", icon: MessageSquare },
    ]
  },
  {
    title: "Staff & HR",
    url: "/staff-hr",
    icon: UserCheck,
    subItems: [
      { title: "Dashboard", url: "/staff-hr", icon: LayoutDashboard },
      { title: "Employee Management", url: "/hr-management", icon: Users },
      { title: "Staff Directory", url: "/staff", icon: UserCheck },
      { title: "Recruitment", url: "/hr-management?tab=recruitment", icon: UserPlus },
      { title: "Employee Exit", url: "/hr-management?tab=employee-exit", icon: UserMinus },
      { title: "Performance & Training", url: "/hr-management?tab=performance", icon: Target },
      { title: "Payroll & Benefits", url: "/hr-management?tab=payroll", icon: DollarSign },
      { title: "Time & Attendance", url: "/hr-management?tab=timeTracking", icon: Clock },
    ]
  },
  {
    title: "Finance & Operations",
    url: "/finance-operations",
    icon: Calculator,
    subItems: [
      { title: "Dashboard", url: "/finance-operations", icon: LayoutDashboard },
      { title: "Fee Management", url: "/school-management/fee-management", icon: CreditCard },
      { title: "Accounting", url: "/accounting", icon: Calculator },
      { title: "Financial Reports", url: "/accounting/reports", icon: BarChart3 },
      { title: "Budget Planning", url: "/accounting/budget", icon: Target },
      { title: "Vendor Management", url: "/accounting/vendors", icon: Building2 },
      { title: "Purchase Orders", url: "/accounting/purchase-orders", icon: ShoppingCart },
    ]
  },
  {
    title: "AI Suite",
    url: "/ai-suite",
    icon: Bot,
    subItems: [
      { title: "Dashboard", url: "/ai-suite", icon: LayoutDashboard },
      { title: "AI Classroom", url: "/ai-classroom", icon: Monitor },
      { title: "AI Assistants", url: "/ai-suite", icon: Brain },
      { title: "AI Timetable Generator", url: "/ai-suite/timetable", icon: Clock },
      { title: "Lesson Planner", url: "/ai-suite/lesson-planner", icon: BookOpen },
      { title: "AI Grading Assistant", url: "/ai-suite/grading", icon: CheckCircle },
      { title: "Comment Generator", url: "/ai-suite/comments", icon: PenTool },
      { title: "Predictive Analytics", url: "/ai-suite/insights", icon: BarChart3 },
      { title: "AI Settings", url: "/ai-suite/settings", icon: Settings },
    ]
  },
  {
    title: "Analytics & Reports",
    url: "/analytics",
    icon: BarChart3,
    subItems: []
  },
  {
    title: "Administration",
    url: "/administration",
    icon: Settings,
    subItems: [
      { title: "Dashboard", url: "/administration", icon: LayoutDashboard },
      { title: "School Settings", url: "/school-settings", icon: Building },
      { title: "User Management", url: "/user-management", icon: UserCog },
      { title: "System Settings", url: "/admin-management", icon: Settings },
      { title: "Master Data", url: "/master-data", icon: Database },
      { title: "Integrations", url: "/integrations", icon: Globe },
      { title: "Portals", url: "/portals", icon: ExternalLink },
    ]
  },
];

function getCurrentModule(pathname: string) {
  if (pathname === '/dashboard') return 'EDU ERP';
  
  if (pathname.startsWith('/academic-operations') || 
      pathname.startsWith('/admissions') || 
      pathname.startsWith('/curriculum') || 
      pathname.startsWith('/academic-management') ||
      pathname.startsWith('/timetable') || 
      pathname.startsWith('/exams') || 
      pathname.startsWith('/academics') ||
      pathname.startsWith('/hod-dashboard')) return 'Academic Operations';
  
  if (pathname.startsWith('/student-services') || 
      pathname.startsWith('/students') || 
      pathname.startsWith('/attendance') || 
      pathname.startsWith('/library') || 
      pathname.startsWith('/transport') || 
      pathname.startsWith('/student-welfare') ||
      pathname.startsWith('/safeguarding') || 
      pathname.startsWith('/activities') || 
      pathname.startsWith('/communication')) return 'Student Services';
  
  if (pathname.startsWith('/staff-hr') || 
      pathname.startsWith('/hr-management') || 
      pathname.startsWith('/staff')) return 'Staff & HR';
  
  if (pathname.startsWith('/finance-operations') || 
      pathname.startsWith('/school-management/fee-management') || 
      pathname.startsWith('/accounting')) return 'Finance & Operations';
  
  if (pathname.startsWith('/ai-suite') || pathname.startsWith('/ai-classroom')) return 'AI Suite';
  
  if (pathname.startsWith('/analytics')) return 'Analytics & Reports';
  
  if (pathname.startsWith('/administration') || 
      pathname.startsWith('/school-settings') ||
      pathname.startsWith('/admin-management') || 
      pathname.startsWith('/user-management') || 
      pathname.startsWith('/master-data') || 
      pathname.startsWith('/integrations') || 
      pathname.startsWith('/portals')) return 'Administration';
  
  return 'EDU ERP';
}

interface SidebarGroupItemsProps {
  title: string;
  items: Array<{
    title: string;
    url: string;
    icon: any;
    subItems?: Array<{
      title: string;
      url: string;
      icon: any;
    }>;
  }>;
  defaultOpen?: boolean;
}

function SidebarGroupItems({ title, items, defaultOpen = false }: SidebarGroupItemsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="group/collapsible text-sm font-medium text-muted-foreground hover:text-foreground">
            {title}
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="ml-4 space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.subItems && item.subItems.some(subItem => location.pathname === subItem.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="text-sm hover:bg-accent/80 hover:text-accent-foreground"
                    >
                      {item.subItems && item.subItems.length > 0 ? (
                        <div className="w-full">
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center gap-3 w-full cursor-pointer">
                                <item.icon className="h-4 w-4" />
                                <span className="text-sm flex-1">{item.title}</span>
                                <ChevronDown className="h-3 w-3" />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-6 mt-2 space-y-1">
                                {item.subItems.map((subItem) => (
                                  <NavLink 
                                    key={subItem.title} 
                                    to={subItem.url} 
                                    className="flex items-center gap-2 p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                                  >
                                    <subItem.icon className="h-3 w-3" />
                                    {subItem.title}
                                  </NavLink>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ) : (
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm" style={{ fontSize: '15px' }}>{item.title}</span>
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
  const { signOut, user } = useAuth();
  const { currentSchool } = useRBAC();
  
  // Memoize current module calculation
  const currentModule = useMemo(() => getCurrentModule(location.pathname), [location.pathname]);
  const currentModuleData = useMemo(() => 
    erpModules.find(module => module.title === currentModule), 
    [currentModule]
  );

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b bg-gradient-to-r from-primary/5 to-primary-glow/5 h-20 overflow-hidden">
        <div className="flex items-center gap-3 px-3 py-3 h-full">
          <img 
            src={(currentSchool as any)?.logo_url || "/lovable-uploads/0a977b5c-549a-4597-a296-a9e51592864a.png"} 
            alt={`${currentSchool?.name || 'Pappaya Academy'} Logo`} 
            className="h-12 w-12 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/lovable-uploads/0a977b5c-549a-4597-a296-a9e51592864a.png";
            }}
          />
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="text-base font-bold">{currentSchool?.name || 'Pappaya AI Suite'}</span>
              <span className="text-sm text-muted-foreground font-bold">{currentModule}</span>
            </div>
          )}
        </div>
        
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {erpModules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={module.title === currentModule}
                    tooltip={state === "collapsed" ? module.title : undefined}
                    className="h-11 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group"
                  >
                    <NavLink to={module.url} className="flex items-center gap-3 px-3 py-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                        <module.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground text-base">{module.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentModuleData && currentModuleData.subItems.length > 0 && (
          <SidebarGroupItems 
            title="Features"
            items={currentModuleData.subItems}
            defaultOpen={true}
          />
        )}
        
      </SidebarContent>
    </Sidebar>
  );
}
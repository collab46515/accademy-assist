import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  Calendar,
  CalendarDays,
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
  Database,
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
  Target,
  DollarSign,
  Receipt,
  Bell,
  PenTool,
  ClipboardList,
  CheckSquare,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

// ERP Module Structure
const erpModules = [
  {
    title: "School Management",
    url: "/",
    icon: GraduationCap,
    subItems: [
      { 
        title: "Admissions", 
        url: "/admissions", 
        icon: UserPlus,
        subItems: [
          { title: "New Applications", url: "/admissions/new", icon: UserPlus },
          { title: "Application Submitted", url: "/admissions?stage=0", icon: Send },
          { title: "Document Verification", url: "/admissions?stage=1", icon: FileText },
          { title: "Application Review", url: "/admissions?stage=2", icon: Eye },
          { title: "Assessment/Interview", url: "/admissions?stage=3", icon: ClipboardCheck },
          { title: "Admission Decision", url: "/admissions?stage=4", icon: CheckCircle },
          { title: "Fee Payment", url: "/admissions?stage=5", icon: CreditCard },
          { title: "Enrollment Confirmation", url: "/admissions?stage=6", icon: UserCheck },
          { title: "Welcome & Onboarding", url: "/admissions?stage=7", icon: Users },
        ]
      },
      { 
        title: "Academics", 
        url: "/academics", 
        icon: BookOpen,
        subItems: [
          { title: "HOD Dashboard", url: "/hod-dashboard", icon: Target },
          { title: "Lesson Planning", url: "/academics/lesson-planning", icon: PenTool },
          { title: "Timetable", url: "/academics/timetable", icon: Clock },
          { title: "Assignments & Homework", url: "/academics/assignments", icon: ClipboardList },
          { title: "Attendance (by Period)", url: "/academics/attendance", icon: CheckSquare },
          { title: "Exams", url: "/academics/exams", icon: FileText },
          { title: "Gradebook", url: "/academics/gradebook", icon: Calculator },
          { title: "Reports", url: "/academics/reports", icon: BarChart3 },
        ]
      },
      { 
        title: "Fee Management", 
        url: "/school-management/fee-management", 
        icon: CreditCard,
        subItems: [
          { title: "Dashboard", url: "/school-management/fee-management", icon: LayoutDashboard },
          { title: "Collections", url: "/school-management/fee-management/collections", icon: CreditCard },
          { title: "Invoices", url: "/school-management/fee-management/invoices", icon: FileText },
          { title: "Payments", url: "/school-management/fee-management/payments", icon: CreditCard },
          { title: "Installments", url: "/school-management/fee-management/installments", icon: Calendar },
          { title: "Discounts", url: "/school-management/fee-management/discounts", icon: Receipt },
          { title: "Outstanding", url: "/school-management/fee-management/outstanding", icon: AlertTriangle },
          { title: "Reports", url: "/school-management/fee-management/reports", icon: BarChart3 },
          { title: "Calendar", url: "/school-management/fee-management/calendar", icon: CalendarDays },
          { title: "Reminders", url: "/school-management/fee-management/reminders", icon: Bell }
        ]
      },
      { 
        title: "Student Welfare", 
        url: "/student-welfare", 
        icon: Shield,
        subItems: [
          { title: "Infirmary", url: "/student-welfare/infirmary", icon: Activity },
          { title: "Complaints", url: "/student-welfare/complaints", icon: MessageSquare },
          { title: "Safeguarding", url: "/student-welfare/safeguarding", icon: Shield },
        ]
      },
      { title: "Communications", url: "/communication", icon: MessageSquare },
      { title: "Events", url: "/events", icon: Activity },
      { title: "Activities", url: "/activities", icon: Activity },
      { title: "Portals", url: "/portals", icon: Globe },
    ]
  },
  {
    title: "HR Management",
    url: "/hr-management",
    icon: UserCheck,
    subItems: [
      { title: "Dashboard", url: "/hr-management", icon: LayoutDashboard },
      { title: "Employees", url: "/hr-management?tab=employees", icon: Users },
      { title: "Performance", url: "/hr-management?tab=performance", icon: Target },
      { title: "Recruitment", url: "/hr-management?tab=recruitment", icon: UserCheck },
      { title: "Training", url: "/hr-management?tab=training", icon: GraduationCap },
      { title: "Benefits", url: "/hr-management?tab=benefits", icon: Shield },
      { title: "Documents", url: "/hr-management?tab=documents", icon: FileText },
      { title: "Assets", url: "/hr-management?tab=assets", icon: Database },
      { title: "Time Tracking", url: "/hr-management?tab=timeTracking", icon: Clock },
      { title: "Expenses", url: "/hr-management?tab=travelExpenses", icon: CreditCard },
      { title: "Engagement", url: "/hr-management?tab=engagement", icon: MessageSquare },
      { title: "Payroll", url: "/hr-management?tab=payroll", icon: DollarSign },
      { title: "Leave", url: "/hr-management?tab=leave", icon: Calendar },
      { title: "Attendance", url: "/hr-management?tab=attendance", icon: Clock },
    ]
  },
  {
    title: "Accounting",
    url: "/accounting",
    icon: Calculator,
    subItems: [
      { title: "Dashboard", url: "/accounting", icon: LayoutDashboard },
      { title: "Invoices", url: "/accounting/invoices", icon: FileText },
      { title: "Bills", url: "/accounting/bills", icon: Receipt },
      { title: "Vendors", url: "/accounting/vendors", icon: Building2 },
      { title: "Purchase Orders", url: "/accounting/purchase-orders", icon: FileText },
      { title: "Reports", url: "/accounting/reports", icon: BarChart3 },
      { title: "Accounts", url: "/accounting/accounts", icon: Database },
      { title: "Budget", url: "/accounting/budget", icon: Target },
      { title: "Settings", url: "/accounting/settings", icon: Settings },
    ]
  },
  {
    title: "Analytics",
    url: "/analytics", 
    icon: BarChart3,
    subItems: [
      { title: "Dashboard", url: "/analytics", icon: BarChart3 },
    ]
  },
  {
    title: "System",
    url: "/admin-management",
    icon: Settings,
    subItems: [
      { title: "Admin", url: "/admin-management", icon: Shield },
      { title: "AI Suite", url: "/ai-suite", icon: Bot },
      { title: "Integrations", url: "/integrations", icon: Settings },
      { title: "Users", url: "/user-management", icon: Users },
      { title: "Master Data", url: "/master-data", icon: Database },
    ]
  }
];

function getCurrentModule(pathname: string) {
  if (pathname.startsWith('/hr-management')) return 'HR Management';
  if (pathname.startsWith('/accounting')) return 'Accounting';
  if (pathname.startsWith('/analytics')) return 'Analytics';
  if (pathname.startsWith('/admin-management') || pathname.startsWith('/ai-suite') || 
      pathname.startsWith('/integrations') || pathname.startsWith('/user-management') || 
      pathname.startsWith('/master-data')) return 'System';
  return 'School Management';
}

interface SidebarGroupItemsProps {
  title: string;
  items: Array<{ title: string; url: string; icon: any; subItems?: Array<{ title: string; url: string; icon: any }> }>;
  defaultOpen?: boolean;
}

function SidebarGroupItems({ title, items, defaultOpen = false }: SidebarGroupItemsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  
  const isActive = (url: string) => url.includes('?') 
    ? location.pathname + location.search === url
    : location.pathname === url;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 py-2 text-sm font-bold text-foreground uppercase tracking-wider">
        <span>{title}</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const itemActive = isActive(item.url);

            if (item.subItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild={!item.url.includes('?')}
                    isActive={itemActive}
                    tooltip={state === "collapsed" ? item.title : undefined}
                    onClick={item.url.includes('?') ? () => navigate(item.url) : undefined}
                  >
                    {item.url.includes('?') ? (
                      <div className="flex items-center gap-3 w-full py-2">
                        <item.icon className="h-6 w-6" />
                        <span className="flex-1 text-sm font-semibold">{item.title}</span>
                      </div>
                    ) : (
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => `flex items-center gap-3 w-full py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                            : 'hover:bg-sidebar-accent/70'
                        }`}
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="flex-1 text-sm font-semibold">{item.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                  
                  <SidebarMenu className="ml-4 border-l border-sidebar-border mt-1">
                    {item.subItems.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton 
                          asChild={!subItem.url.includes('?')}
                          isActive={isActive(subItem.url)}
                          tooltip={state === "collapsed" ? subItem.title : undefined}
                          onClick={subItem.url.includes('?') ? () => navigate(subItem.url) : undefined}
                          size="sm"
                        >
                          {subItem.url.includes('?') ? (
                            <div className="flex items-center gap-3 py-1.5">
                              <subItem.icon className="h-5 w-5" />
                              <span className="text-sm font-medium">{subItem.title}</span>
                            </div>
                          ) : (
                            <NavLink 
                              to={subItem.url} 
                              className={({ isActive }) => `flex items-center gap-3 py-1.5 rounded-md transition-colors ${
                                isActive 
                                  ? 'bg-primary/20 text-primary font-semibold border-l-2 border-primary pl-2' 
                                  : 'hover:bg-sidebar-accent/50 pl-2'
                              }`}
                            >
                              <subItem.icon className="h-5 w-5" />
                              <span className="text-sm font-medium">{subItem.title}</span>
                            </NavLink>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarMenuItem>
              );
            }
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild={!item.url.includes('?')}
                  isActive={itemActive}
                  tooltip={state === "collapsed" ? item.title : undefined}
                  onClick={item.url.includes('?') ? () => navigate(item.url) : undefined}
                >
                  {item.url.includes('?') ? (
                    <div className="flex items-center gap-3 py-2">
                      <item.icon className="h-6 w-6" />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </div>
                  ) : (
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `flex items-center gap-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                          : 'hover:bg-sidebar-accent/70'
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </NavLink>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { signOut, user } = useAuth();
  
  const currentModule = getCurrentModule(location.pathname);
  const currentModuleData = erpModules.find(module => module.title === currentModule);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="text-sm font-bold">ERP System</span>
              <span className="text-xs text-muted-foreground">{currentModule}</span>
            </div>
          )}
        </div>
        {state !== "collapsed" && <SchoolSelector />}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-bold text-foreground uppercase tracking-wider px-2 py-2">Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {erpModules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={module.title === currentModule}
                    tooltip={state === "collapsed" ? module.title : undefined}
                    className="py-3"
                  >
                    <NavLink 
                      to={module.url} 
                      className={({ isActive }) => `flex items-center gap-3 w-full py-2 rounded-md transition-colors ${
                        module.title === currentModule 
                          ? 'bg-primary text-primary-foreground font-bold shadow-lg scale-105' 
                          : 'hover:bg-sidebar-accent/70'
                      }`}
                    >
                      <module.icon className="h-5 w-5" />
                      <span className="text-sm font-semibold">{module.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentModuleData && (
          <SidebarGroupItems 
            title="Features"
            items={currentModuleData.subItems}
            defaultOpen={true}
          />
        )}
        
        {/* User section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  tooltip={state === "collapsed" ? "Sign Out" : undefined}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 py-2"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    {state !== "collapsed" && <span className="text-sm font-medium">Sign Out</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
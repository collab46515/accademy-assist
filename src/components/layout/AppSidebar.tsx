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
      { title: "Students", url: "/students", icon: Users },
      { title: "Admissions", url: "/admissions", icon: UserPlus },
      { title: "Academics", url: "/academics", icon: BookOpen },
      { title: "Fee Management", url: "/school-management/fee-management", icon: CreditCard },
      { title: "Student Welfare", url: "/student-welfare", icon: Shield },
      { title: "Communications", url: "/communication", icon: MessageSquare },
      { title: "Events & Activities", url: "/events", icon: Activity },
      { title: "Portals", url: "/portals", icon: Globe },
    ]
  },
  {
    title: "HR Management",
    url: "/hr-management",
    icon: UserCheck,
    subItems: [
      { title: "Employees", url: "/hr-management?tab=employees", icon: Users },
      { title: "Recruitment", url: "/hr-management?tab=recruitment", icon: UserPlus },
      { title: "Performance", url: "/hr-management?tab=performance", icon: Target },
      { title: "Payroll & Benefits", url: "/hr-management?tab=payroll", icon: DollarSign },
      { title: "Attendance", url: "/hr-management?tab=attendance", icon: Clock },
      { title: "Leave Management", url: "/hr-management?tab=leave", icon: Calendar },
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
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  
  const isActive = (url: string) => url.includes('?') 
    ? location.pathname + location.search === url
    : location.pathname === url;

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/70 rounded-lg px-2 py-1.5 transition-colors flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                const itemActive = isActive(item.url);

                if (item.subItems) {
                  const hasActiveSubItem = item.subItems.some(subItem => isActive(subItem.url));
                  const shouldExpand = itemActive || hasActiveSubItem;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible defaultOpen={shouldExpand}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            asChild={!item.url.includes('?')}
                            isActive={itemActive}
                            tooltip={state === "collapsed" ? item.title : undefined}
                            onClick={item.url.includes('?') ? () => navigate(item.url) : undefined}
                          >
                            {item.url.includes('?') ? (
                              <div className="flex items-center gap-3 w-full">
                                <item.icon className="h-4 w-4" />
                                <span className="flex-1">{item.title}</span>
                                <ChevronRight className="h-3 w-3 transition-transform ui-expanded:rotate-90" />
                              </div>
                            ) : (
                              <NavLink to={item.url} className="flex items-center gap-3 w-full">
                                <item.icon className="h-4 w-4" />
                                <span className="flex-1">{item.title}</span>
                                <ChevronRight className="h-3 w-3 transition-transform ui-expanded:rotate-90" />
                              </NavLink>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenu className="ml-4 border-l border-sidebar-border">
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
                                    <div className="flex items-center gap-3">
                                      <subItem.icon className="h-3 w-3" />
                                      <span className="text-xs">{subItem.title}</span>
                                    </div>
                                  ) : (
                                    <NavLink to={subItem.url} className="flex items-center gap-3">
                                      <subItem.icon className="h-3 w-3" />
                                      <span className="text-xs">{subItem.title}</span>
                                    </NavLink>
                                  )}
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </Collapsible>
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
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {erpModules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={module.title === currentModule}
                    tooltip={state === "collapsed" ? module.title : undefined}
                  >
                    <NavLink to={module.url} className="flex items-center gap-3">
                      <module.icon className="h-4 w-4" />
                      <span>{module.title}</span>
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
                  className="text-destructive hover:text-destructive"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" />
                    {state !== "collapsed" && <span>Sign Out</span>}
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
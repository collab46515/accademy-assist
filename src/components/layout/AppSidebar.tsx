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
  MessageCircle,
  ShoppingCart
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

// ERP Module Structure
const erpModules = [
  {
    title: "School Management",
    url: "/",
    icon: GraduationCap,
    subItems: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Students", url: "/students", icon: Users },
      { 
        title: "Unified Admissions", 
        url: "/admissions", 
        icon: UserPlus,
        subItems: [
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
      { title: "Attendance", url: "/attendance", icon: Calendar },
      { title: "Curriculum", url: "/curriculum", icon: BookOpen },
      { title: "Timetable", url: "/timetable", icon: Clock },
      { title: "Gradebook", url: "/gradebook", icon: Calculator },
      { title: "Exams", url: "/exams", icon: FileText },
      { 
        title: "Fee Management", 
        url: "/school-management/fee-management", 
        icon: CreditCard,
        subItems: [
          { title: "Fee Structure", url: "/school-management/fee-management", icon: Settings },
          { title: "Invoices", url: "/school-management/fee-management/invoices", icon: FileText },
          { title: "Payments", url: "/school-management/fee-management/payments", icon: CreditCard },
          { title: "Installment Plans", url: "/school-management/fee-management/installments", icon: Calendar },
          { title: "Discounts & Waivers", url: "/school-management/fee-management/discounts", icon: Receipt },
          { title: "Outstanding Fees", url: "/school-management/fee-management/outstanding", icon: AlertTriangle },
          { title: "Fee Reports", url: "/school-management/fee-management/reports", icon: BarChart3 },
          { title: "Fee Calendar", url: "/school-management/fee-management/calendar", icon: CalendarDays },
          { title: "Reminders & Alerts", url: "/school-management/fee-management/reminders", icon: Bell }
        ]
      },
      { title: "Staff", url: "/staff", icon: Users },
      { title: "Communications", url: "/communication", icon: MessageSquare },
      { title: "Events", url: "/events", icon: Activity },
      { title: "Activities", url: "/activities", icon: Activity },
      { title: "Safeguarding", url: "/safeguarding", icon: Shield },
      { title: "Portals", url: "/portals", icon: Globe },
    ]
  },
  {
    title: "HR Management",
    url: "/hr-management",
    icon: UserCheck,
    subItems: [
      { title: "HR Dashboard", url: "/hr-management", icon: LayoutDashboard },
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
    ]
  },
  {
    title: "Accounting",
    url: "/accounting",
    icon: Calculator,
    subItems: [
      { title: "Accounting Dashboard", url: "/accounting", icon: LayoutDashboard },
      { title: "Invoices", url: "/accounting/invoices", icon: FileText },
      { title: "Bills & Expenses", url: "/accounting/bills", icon: Receipt },
      { title: "Vendors", url: "/accounting/vendors", icon: Building2 },
      { title: "Purchase Orders", url: "/accounting/purchase-orders", icon: ShoppingCart },
      { title: "Reports", url: "/accounting/reports", icon: BarChart3 },
      { title: "Chart of Accounts", url: "/accounting/accounts", icon: PieChart },
      { title: "Budget Planning", url: "/accounting/budget", icon: Target },
      { title: "Settings", url: "/accounting/settings", icon: Settings },
    ]
  },
  {
    title: "Analytics",
    url: "/analytics", 
    icon: BarChart3,
    subItems: [
      { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      // Add more analytics sub-items as needed
    ]
  },
  {
    title: "System",
    url: "/admin-management",
    icon: Settings,
    subItems: [
      { title: "Admin Management", url: "/admin-management", icon: Shield },
      { title: "AI Suite", url: "/ai-suite", icon: Bot },
      { title: "Integrations", url: "/integrations", icon: Settings },
      { title: "User Management", url: "/user-management", icon: Users },
      { title: "Master Data", url: "/master-data", icon: Database },
    ]
  }
];

// Get current module based on pathname
function getCurrentModule(pathname: string) {
  if (pathname.startsWith('/hr-management')) return 'HR Management';
  if (pathname.startsWith('/accounting') || pathname.startsWith('/finance')) return 'Accounting';
  if (pathname.startsWith('/analytics')) return 'Analytics';
  if (pathname.startsWith('/admin-management') || pathname.startsWith('/ai-suite') || 
      pathname.startsWith('/integrations') || pathname.startsWith('/user-management') || pathname.startsWith('/master-data')) return 'System';
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
                    navigate(item.url);
                  }
                };

                // If item has subItems (like Unified Admissions), render as collapsible
                if (item.subItems) {
                  const hasActiveSubItem = item.subItems.some(subItem => 
                    subItem.url.includes('?') 
                      ? location.pathname + location.search === subItem.url
                      : location.pathname === subItem.url
                  );
                  const isMainActive = location.pathname === item.url.split('?')[0];
                  const shouldExpand = isMainActive || hasActiveSubItem;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible defaultOpen={shouldExpand}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            asChild={!item.url.includes('?')}
                            isActive={isMainActive}
                            tooltip={state === "collapsed" ? item.title : undefined}
                            onClick={item.url.includes('?') ? handleClick : undefined}
                          >
                            {item.url.includes('?') ? (
                              <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 w-full ${getNavClassName(isMainActive)}`}>
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm flex-1">{item.title}</span>
                                <ChevronRight className="h-3 w-3 opacity-60 transition-transform ui-expanded:rotate-90" />
                              </div>
                            ) : (
                              <NavLink 
                                to={item.url}
                                className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 w-full ${getNavClassName(isMainActive)}`}
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm flex-1">{item.title}</span>
                                <ChevronRight className="h-3 w-3 opacity-60 transition-transform ui-expanded:rotate-90" />
                              </NavLink>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenu className="ml-4 border-l border-sidebar-border">
                            {item.subItems.map((subItem) => {
                              const isSubActive = subItem.url.includes('?') 
                                ? location.pathname + location.search === subItem.url
                                : location.pathname === subItem.url;
                              
                              const handleSubClick = () => {
                                if (subItem.url.includes('?')) {
                                  navigate(subItem.url);
                                }
                              };

                              return (
                                <SidebarMenuItem key={subItem.title}>
                                  <SidebarMenuButton 
                                    asChild={!subItem.url.includes('?')}
                                    isActive={isSubActive}
                                    tooltip={state === "collapsed" ? subItem.title : undefined}
                                    onClick={subItem.url.includes('?') ? handleSubClick : undefined}
                                    size="sm"
                                  >
                                    {subItem.url.includes('?') ? (
                                      <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${getNavClassName(isSubActive)}`}>
                                        <subItem.icon className="h-3 w-3 flex-shrink-0" />
                                        <span className="text-xs">{subItem.title}</span>
                                      </div>
                                    ) : (
                                      <NavLink 
                                        to={subItem.url}
                                        className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${getNavClassName(isSubActive)}`}
                                      >
                                        <subItem.icon className="h-3 w-3 flex-shrink-0" />
                                        <span className="text-xs">{subItem.title}</span>
                                      </NavLink>
                                    )}
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }
                
                // Regular menu item without subItems
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
  const navigate = useNavigate();
  const { state } = useSidebar();
  
  const currentModule = getCurrentModule(location.pathname);
  const currentModuleData = erpModules.find(module => module.title === currentModule);
  
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
              <span className="text-sm font-bold text-sidebar-foreground">ERP System</span>
              <span className="text-xs text-muted-foreground">{currentModule}</span>
            </div>
          )}
        </div>
        {state !== "collapsed" && <SchoolSelector />}
      </SidebarHeader>
      
      <SidebarContent className="gap-0">
        {/* Module Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {erpModules.map((module) => {
                const isActive = module.title === currentModule;
                return (
                  <SidebarMenuItem key={module.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={state === "collapsed" ? module.title : undefined}
                    >
                      <NavLink 
                        to={module.url} 
                        className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${getNavClassName(isActive)}`}
                      >
                        <module.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{module.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Module Features */}
        {currentModuleData && (
          <SidebarGroupItems 
            title={`${currentModule} Features`}
            items={currentModuleData.subItems}
            defaultOpen={true}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
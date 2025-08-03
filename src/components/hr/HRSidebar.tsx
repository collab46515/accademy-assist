import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Target,
  UserCog,
  GraduationCap,
  Award,
  Folder,
  Package,
  Timer,
  Plane,
  MessageCircle,
  DollarSign,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Building2,
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

// Main HR navigation items
const hrMainItems = [
  { title: "HR Dashboard", url: "/hr-management", icon: LayoutDashboard },
];

// HR Management features
const hrFeatureItems = [
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

interface HRSidebarGroupItemsProps {
  title: string;
  items: Array<{ title: string; url: string; icon: any }>;
  defaultOpen?: boolean;
}

function HRSidebarGroupItems({ title, items, defaultOpen = false }: HRSidebarGroupItemsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  
  // Check if any item in this group is active - include query parameters
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

export function HRSidebar() {
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
              <span className="text-sm font-bold text-sidebar-foreground">HR Management</span>
              <span className="text-xs text-muted-foreground">Human Resources</span>
            </div>
          )}
        </div>
        {state !== "collapsed" && <SchoolSelector />}
      </SidebarHeader>
      
      <SidebarContent className="gap-0">
        {/* Main HR Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {hrMainItems.map((item) => {
                const isActive = location.pathname === item.url && !location.search;
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

        {/* HR Features */}
        <HRSidebarGroupItems 
          title="HR Features" 
          items={hrFeatureItems}
          defaultOpen={true}
        />
      </SidebarContent>
    </Sidebar>
  );
}
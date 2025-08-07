import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { Button } from "@/components/ui/button";
import { SchoolSelector } from "./SchoolSelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  GraduationCap, 
  Menu, 
  X,
  Database,
  UserPlus,
  User,
  Clock,
  Calendar,
  BarChart3,
  FileText,
  Trophy,
  Shield,
  MessageSquare,
  CreditCard,
  Users,
  CalendarDays,
  TrendingUp,
  Bot,
  Settings,
  LogOut
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Database },
  { name: "Admissions", href: "/admissions", icon: UserPlus },
  { name: "Students", href: "/students", icon: User },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Curriculum", href: "/curriculum", icon: Calendar },
  { name: "Assessment", href: "/assessment", icon: BarChart3 },
  { name: "Gradebook", href: "/gradebook", icon: FileText },
  { name: "Exams", href: "/exams", icon: Trophy },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Communication", href: "/communication", icon: MessageSquare },
  { name: "Portals", href: "/portals", icon: User },
  { name: "Finance", href: "/finance", icon: CreditCard },
  { name: "Activities", href: "/activities", icon: Trophy },
  { name: "Safeguarding", href: "/safeguarding", icon: Shield },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "AI Suite", href: "/ai-suite", icon: Bot },
  { name: "User Management", href: "/user-management", icon: Settings },
  { name: "Integrations", href: "/integrations", icon: Settings },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { hasRole, isSuperAdmin, currentSchool } = useRBAC();

  const handleSignOut = async () => {
    await signOut();
  };

  // Filter navigation items based on user roles
  const getFilteredNavItems = () => {
    if (isSuperAdmin()) return navigationItems;
    
    const filteredItems = navigationItems.filter(item => {
      switch (item.href) {
        case '/safeguarding':
          return hasRole('dsl', currentSchool?.id);
        case '/staff':
          return hasRole('school_admin', currentSchool?.id) || hasRole('super_admin');
        case '/finance':
          return hasRole('school_admin', currentSchool?.id) || hasRole('super_admin');
        case '/admissions':
          return hasRole('school_admin', currentSchool?.id) || hasRole('super_admin');
        case '/user-management':
          return hasRole('super_admin');
        case '/integrations':
          return hasRole('school_admin', currentSchool?.id) || hasRole('super_admin');
        default:
          return true; // Allow access to other modules for all authenticated users
      }
    });
    
    return filteredItems;
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-card border-b border-border shadow-[var(--shadow-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-40">
          <div className="flex items-center w-full">
            <Link to="/" className="flex items-center">
              <div 
                className="bg-contain bg-no-repeat bg-center min-w-[800px] h-32"
                style={{ backgroundImage: 'url(/assets/logo.png)' }}
              />
            </Link>
            <SchoolSelector />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {getFilteredNavItems().slice(0, 8).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-[var(--transition-smooth)] ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentSchool?.name || 'No school selected'}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
            {getFilteredNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-[var(--transition-smooth)] ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile User Menu */}
            <div className="border-t border-border pt-2 mt-2">
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {user?.email}
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
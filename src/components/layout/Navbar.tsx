import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Settings
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
  { name: "Integrations", href: "/integrations", icon: Settings },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-card border-b border-border shadow-[var(--shadow-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                EduSIS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 8).map((item) => {
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
            {navigationItems.map((item) => {
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
          </div>
        </div>
      )}
    </nav>
  );
};
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { getCurrentSchoolRoles } = useRBAC();
  
  const currentRoles = getCurrentSchoolRoles();

  const handleLogout = async () => {
    try {
      await signOut();
      // Force redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    return parts.map(part => part[0]?.toUpperCase()).join('').slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Display username and roles */}
      <div className="hidden sm:flex flex-col items-end">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {user?.email?.split('@')[0] || 'User'}
          </span>
          {currentRoles.length > 0 && (
            <div className="flex gap-1">
              {currentRoles.map((userRole, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {userRole.role.replace('_', ' ').toUpperCase()}
                  {userRole.department && ` - ${userRole.department}`}
                  {userRole.year_group && ` - Year ${userRole.year_group}`}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {user?.email || 'user@example.com'}
        </span>
      </div>

      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border hover:border-primary/50 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={""} alt={user?.email || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.email ? getUserInitials(user.email) : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-3 border-b">
            <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 mt-1">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
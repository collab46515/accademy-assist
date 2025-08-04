import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  customBackPath?: string;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
}

// Navigation hierarchy mapping
const navigationHierarchy = {
  '/': { label: 'Dashboard', parent: null },
  '/academics': { label: 'Academics', parent: '/' },
  '/academics/curriculum': { label: 'Curriculum', parent: '/academics' },
  '/academics/timetable': { label: 'Timetable', parent: '/academics' },
  '/academics/gradebook': { label: 'Gradebook', parent: '/academics' },
  '/academics/exams': { label: 'Exams', parent: '/academics' },
  '/academics/attendance': { label: 'Attendance', parent: '/academics' },
  '/hr-management': { label: 'HR Management', parent: '/' },
  '/accounting': { label: 'Accounting', parent: '/' },
  '/school-management/fee-management': { label: 'Fee Management', parent: '/' },
  '/student-welfare': { label: 'Student Welfare', parent: '/' },
  '/student-welfare/infirmary': { label: 'Infirmary', parent: '/student-welfare' },
  '/student-welfare/complaints': { label: 'Complaints', parent: '/student-welfare' },
  '/student-welfare/safeguarding': { label: 'Safeguarding', parent: '/student-welfare' },
  '/admissions': { label: 'Admissions', parent: '/' },
  '/students': { label: 'Students', parent: '/' },
  '/communication': { label: 'Communication', parent: '/' },
  '/events': { label: 'Events', parent: '/' },
  '/activities': { label: 'Activities', parent: '/' },
  '/portals': { label: 'Portals', parent: '/' },
  '/analytics': { label: 'Analytics', parent: '/' },
  '/ai-suite': { label: 'AI Suite', parent: '/' },
  '/integrations': { label: 'Integrations', parent: '/' },
  '/user-management': { label: 'User Management', parent: '/' },
  '/master-data': { label: 'Master Data', parent: '/' },
  '/admin-management': { label: 'Admin Management', parent: '/' },
};

function generateBreadcrumbs(pathname: string): Array<{ label: string; href?: string }> {
  const breadcrumbs: Array<{ label: string; href?: string }> = [];
  let currentPath = pathname;

  // Handle dynamic paths like fee management sub-routes
  if (currentPath.startsWith('/school-management/fee-management/')) {
    const subRoute = currentPath.replace('/school-management/fee-management/', '');
    const subRouteLabel = subRoute.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    breadcrumbs.unshift({ label: subRouteLabel });
    currentPath = '/school-management/fee-management';
  }

  // Handle accounting sub-routes
  if (currentPath.startsWith('/accounting/') && currentPath !== '/accounting') {
    const subRoute = currentPath.replace('/accounting/', '');
    const subRouteLabel = subRoute.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    breadcrumbs.unshift({ label: subRouteLabel });
    currentPath = '/accounting';
  }

  // Handle HR sub-routes with query parameters
  if (currentPath === '/hr-management' && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      const tabLabel = tab.split(/(?=[A-Z])/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      breadcrumbs.unshift({ label: tabLabel });
    }
  }

  // Build breadcrumb chain
  while (currentPath && navigationHierarchy[currentPath as keyof typeof navigationHierarchy]) {
    const navItem = navigationHierarchy[currentPath as keyof typeof navigationHierarchy];
    breadcrumbs.unshift({
      label: navItem.label,
      href: navItem.parent ? currentPath : undefined
    });
    currentPath = navItem.parent || '';
  }

  return breadcrumbs;
}

export function PageHeader({ 
  title, 
  description, 
  showBackButton = true, 
  customBackPath,
  breadcrumbItems,
  actions 
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (customBackPath) {
      navigate(customBackPath);
    } else {
      // Try to get parent from navigation hierarchy
      const currentNav = navigationHierarchy[location.pathname as keyof typeof navigationHierarchy];
      if (currentNav?.parent) {
        navigate(currentNav.parent);
      } else {
        // Fallback to browser history or dashboard
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Use custom breadcrumbs if provided, otherwise generate from current path
  const breadcrumbs = breadcrumbItems || generateBreadcrumbs(location.pathname);

  return (
    <div className="flex flex-col gap-4 p-6 border-b bg-gradient-to-r from-background to-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="w-px h-6 bg-border" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink 
                      onClick={() => navigate(crumb.href!)}
                      className="cursor-pointer hover:text-foreground"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Page Title and Description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}
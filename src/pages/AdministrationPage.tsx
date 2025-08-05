import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCog, 
  Settings, 
  Database, 
  Globe, 
  ExternalLink,
  Shield,
  Users,
  Activity,
  Server
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AdministrationPage() {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "User Management",
      description: "System user accounts, roles, and permissions management",
      icon: UserCog,
      url: "/user-management",
      stats: "45 system users",
      color: "bg-blue-500",
      features: ["User Accounts", "Role Management", "Permission Control", "Access Logs"]
    },
    {
      title: "System Settings",
      description: "Core system configuration and administrative controls",
      icon: Settings,
      url: "/admin-management",
      stats: "12 configurations",
      color: "bg-green-500",
      features: ["System Config", "Security Settings", "Backup Management", "Audit Trails"]
    },
    {
      title: "Master Data",
      description: "Core data management and reference information",
      icon: Database,
      url: "/master-data",
      stats: "8 data sets",
      color: "bg-purple-500",
      features: ["Academic Data", "Fee Structures", "HR Master Data", "System References"]
    }
  ];

  const adminStats = [
    { label: "System Users", value: "45", trend: "+3 this month", icon: Users },
    { label: "Active Sessions", value: "23", trend: "Current online", icon: Activity },
    { label: "System Uptime", value: "99.9%", trend: "Last 30 days", icon: Server },
    { label: "Data Integrity", value: "100%", trend: "All checks passed", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="System Administration" 
        description="System management, configuration, and administrative controls"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-success">{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.url)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-lg ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{module.stats}</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-sm">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="space-y-2">
                    {module.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.url);
                    }}
                  >
                    Access {module.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status?: "active" | "beta" | "coming-soon";
  stats?: { label: string; value: string | number }[];
}

export const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  status = "active",
  stats = []
}: ModuleCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "beta":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Beta</Badge>;
      case "coming-soon":
        return <Badge variant="outline" className="text-muted-foreground">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-[var(--shadow-module)] transition-[var(--transition-smooth)] border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-[var(--transition-smooth)]">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-[var(--transition-smooth)]">
                {title}
              </CardTitle>
              {getStatusBadge() && (
                <div className="mt-1">{getStatusBadge()}</div>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant={status === "coming-soon" ? "outline" : "default"} 
          className="w-full group-hover:shadow-md transition-[var(--transition-smooth)]"
          disabled={status === "coming-soon"}
          onClick={() => {
            if (status !== "coming-soon") {
              window.location.href = href;
            }
          }}
        >
          {status === "coming-soon" ? "Coming Soon" : "Open Module"}
        </Button>
      </CardContent>
    </Card>
  );
};
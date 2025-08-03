import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

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
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          onClick={() => {
            if (status !== "coming-soon") {
              window.location.href = href;
            }
          }}>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-4 space-y-4">
        {/* Header with icon and badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-primary group-hover:text-primary transition-colors duration-300" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                {title}
              </CardTitle>
              {getStatusBadge()}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-muted-foreground/90 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative pt-0 space-y-4">
        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/20 rounded-lg border border-border/30">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="text-xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {status === "coming-soon" ? "Coming Soon" : "Open Module"}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </CardContent>
    </Card>
  );
};
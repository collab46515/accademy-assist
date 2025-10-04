import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinancialDashboard } from "@/components/finance/FinancialDashboard";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { useSchoolFilter } from "@/hooks/useSchoolFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calculator,
  BarChart3,
  Target,
  Building2,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  FileText,
  ArrowRight,
  Plus,
  Settings
} from "lucide-react";

const FinancePage = () => {
  const navigate = useNavigate();
  const { currentSchool } = useSchoolFilter();

  const financeModules = [
    {
      title: "Fee Management",
      description: "Complete student fee collection and payment tracking",
      icon: CreditCard,
      url: "/school-management/fee-management",
      stats: "1,247 students",
      color: "bg-blue-500",
      features: ["Fee Collection", "Payment Plans", "Invoice Generation", "Outstanding Tracking"]
    },
    {
      title: "General Accounting",
      description: "Professional accounting with chart of accounts",
      icon: Calculator,
      url: "/accounting",
      stats: "15 accounts",
      color: "bg-green-500",
      features: ["General Ledger", "AP/AR", "Financial Statements", "Multi-Currency"]
    },
    {
      title: "Budget Planning",
      description: "Budget management and variance analysis",
      icon: Target,
      url: "/accounting/budget",
      stats: "87% utilized",
      color: "bg-purple-500",
      features: ["Budget Creation", "Variance Analysis", "Department Budgets", "Forecasting"]
    },
    {
      title: "Vendor Management",
      description: "Supplier and vendor relationship management",
      icon: Building2,
      url: "/accounting/vendors",
      stats: "45 vendors",
      color: "bg-orange-500",
      features: ["Vendor Database", "Purchase Orders", "Payment Terms", "Performance Tracking"]
    },
    {
      title: "Financial Reports",
      description: "Comprehensive reporting and analytics",
      icon: BarChart3,
      url: "/accounting/reports",
      stats: "12 reports",
      color: "bg-indigo-500",
      features: ["P&L Statements", "Balance Sheets", "Cash Flow", "Custom Reports"]
    },
    {
      title: "Purchase Orders",
      description: "Procurement and purchase management",
      icon: ShoppingCart,
      url: "/accounting/purchase-orders",
      stats: "23 active",
      color: "bg-teal-500",
      features: ["PO Creation", "Approval Workflow", "Delivery Tracking", "Spend Analysis"]
    }
  ];


  return (
    <ModuleGuard moduleName="Finance">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <PageHeader 
          title={`Finance & Fee Management Hub - ${currentSchool?.name || ''}`}
          description="Comprehensive financial management system with automated processes and real-time analytics"
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Finance" }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </div>
          }
        />
      
      <div className="p-6 space-y-8">
        {/* Financial Dashboard */}
        <FinancialDashboard />

        {/* Finance Modules Grid */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Finance Modules</h2>
            <p className="text-muted-foreground">Access specialized financial management tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financeModules.map((module, index) => (
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
                    <div className="grid grid-cols-2 gap-2">
                      {module.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary group-hover:shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(module.url);
                      }}
                    >
                      Access Module
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ModuleGuard>
  );
};

export default FinancePage;
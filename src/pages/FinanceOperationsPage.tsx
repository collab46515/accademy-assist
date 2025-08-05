import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  PieChart
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function FinanceOperationsPage() {
  const navigate = useNavigate();

  const financeModules = [
    {
      title: "Fee Management",
      description: "Student fee collection, invoicing, and payment tracking",
      icon: CreditCard,
      url: "/school-management/fee-management",
      stats: "£2.4M collected",
      color: "bg-blue-500",
      features: ["Fee Collection", "Payment Plans", "Invoice Generation", "Outstanding Tracking"]
    },
    {
      title: "Accounting",
      description: "Complete financial accounting and bookkeeping system",
      icon: Calculator,
      url: "/accounting",
      stats: "15 accounts active",
      color: "bg-green-500",
      features: ["General Ledger", "Accounts Payable", "Accounts Receivable", "Financial Statements"]
    },
    {
      title: "Financial Reports",
      description: "Comprehensive financial reporting and analytics",
      icon: BarChart3,
      url: "/accounting/reports",
      stats: "12 reports generated",
      color: "bg-purple-500",
      features: ["P&L Statements", "Balance Sheets", "Cash Flow", "Budget Variance"]
    }
  ];

  const financeStats = [
    { label: "Monthly Revenue", value: "£245K", trend: "+12.5%", icon: DollarSign },
    { label: "Outstanding Fees", value: "£45K", trend: "-8.2%", icon: CreditCard },
    { label: "Budget Utilization", value: "87%", trend: "+5.1%", icon: Target },
    { label: "Vendor Payments", value: "£125K", trend: "+3.8%", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="Finance & Operations" 
        description="Complete financial management and operational excellence"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {financeStats.map((stat, index) => (
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

        {/* Finance Modules */}
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
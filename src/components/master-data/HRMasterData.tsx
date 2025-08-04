import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Shield,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Master HR Data Definitions
const MASTER_DEPARTMENTS = [
  {
    name: "Administration",
    description: "School administration and management",
    cost_center: "ADM001"
  },
  {
    name: "Teaching Staff",
    description: "Academic teaching personnel",
    cost_center: "TEACH001"
  },
  {
    name: "Support Staff",
    description: "Non-teaching support personnel", 
    cost_center: "SUPP001"
  },
  {
    name: "Maintenance",
    description: "Facilities and maintenance staff",
    cost_center: "MAINT001"
  },
  {
    name: "IT Services",
    description: "Information technology support",
    cost_center: "IT001"
  },
  {
    name: "Finance",
    description: "Financial management and accounting",
    cost_center: "FIN001"
  },
  {
    name: "Human Resources",
    description: "Personnel management and development",
    cost_center: "HR001"
  }
];

const MASTER_POSITIONS = [
  // Senior Leadership
  { title: "Head Teacher", department: "Administration", level: "Executive", is_management: true },
  { title: "Deputy Head Teacher", department: "Administration", level: "Senior Management", is_management: true },
  { title: "Assistant Head Teacher", department: "Administration", level: "Middle Management", is_management: true },
  
  // Academic Staff
  { title: "Head of Department", department: "Teaching Staff", level: "Middle Management", is_management: true },
  { title: "Senior Teacher", department: "Teaching Staff", level: "Senior", is_management: false },
  { title: "Teacher", department: "Teaching Staff", level: "Standard", is_management: false },
  { title: "Teaching Assistant", department: "Teaching Staff", level: "Support", is_management: false },
  { title: "Supply Teacher", department: "Teaching Staff", level: "Temporary", is_management: false },
  
  // Support Staff
  { title: "Office Manager", department: "Administration", level: "Middle Management", is_management: true },
  { title: "School Secretary", department: "Administration", level: "Support", is_management: false },
  { title: "Receptionist", department: "Administration", level: "Support", is_management: false },
  { title: "Librarian", department: "Support Staff", level: "Standard", is_management: false },
  { title: "IT Technician", department: "IT Services", level: "Standard", is_management: false },
  { title: "Finance Officer", department: "Finance", level: "Standard", is_management: false },
  { title: "HR Coordinator", department: "Human Resources", level: "Standard", is_management: false },
  
  // Facilities & Maintenance
  { title: "Facilities Manager", department: "Maintenance", level: "Middle Management", is_management: true },
  { title: "Caretaker", department: "Maintenance", level: "Support", is_management: false },
  { title: "Cleaner", department: "Maintenance", level: "Support", is_management: false },
  { title: "Groundskeeper", department: "Maintenance", level: "Support", is_management: false },
  
  // Specialized Roles
  { title: "Nurse", department: "Support Staff", level: "Standard", is_management: false },
  { title: "Counselor", department: "Support Staff", level: "Standard", is_management: false },
  { title: "Security Officer", department: "Support Staff", level: "Support", is_management: false }
];

const MASTER_ASSET_CATEGORIES = [
  {
    category_name: "IT Equipment",
    description: "Computers, laptops, tablets, and IT hardware",
    depreciation_rate: 20.0
  },
  {
    category_name: "Furniture",
    description: "Desks, chairs, cabinets, and office furniture",
    depreciation_rate: 10.0
  },
  {
    category_name: "Vehicles",
    description: "School buses, cars, and other vehicles",
    depreciation_rate: 15.0
  },
  {
    category_name: "Teaching Equipment",
    description: "Interactive whiteboards, projectors, and educational tools",
    depreciation_rate: 12.0
  },
  {
    category_name: "Kitchen Equipment",
    description: "Cooking appliances and kitchen tools",
    depreciation_rate: 8.0
  },
  {
    category_name: "Sports Equipment",
    description: "Gym equipment, sports gear, and recreational items",
    depreciation_rate: 15.0
  }
];

const MASTER_BENEFIT_PLANS = [
  {
    plan_name: "Basic Health Insurance",
    plan_type: "health",
    plan_description: "Basic medical coverage for employees",
    provider_name: "NHS Plus",
    employer_contribution: 500.00,
    employee_contribution: 100.00,
    is_active: true,
    coverage_details: {
      medical: true,
      dental: false,
      vision: false,
      prescription: true
    }
  },
  {
    plan_name: "Comprehensive Health Insurance",
    plan_type: "health",
    plan_description: "Full medical, dental, and vision coverage",
    provider_name: "NHS Plus Premium",
    employer_contribution: 800.00,
    employee_contribution: 200.00,
    is_active: true,
    coverage_details: {
      medical: true,
      dental: true,
      vision: true,
      prescription: true
    }
  },
  {
    plan_name: "Pension Scheme",
    plan_type: "pension",
    plan_description: "Teachers' Pension Scheme contribution",
    provider_name: "Teachers' Pensions",
    employer_contribution: 23.68,
    employee_contribution: 7.4,
    is_active: true,
    coverage_details: {
      retirement_age: 65,
      contribution_percentage: true
    }
  },
  {
    plan_name: "Life Insurance",
    plan_type: "life",
    plan_description: "Basic life insurance coverage",
    provider_name: "Aviva Education",
    employer_contribution: 50.00,
    employee_contribution: 0.00,
    is_active: true,
    coverage_details: {
      coverage_amount: 50000,
      beneficiaries_allowed: 3
    }
  }
];

const MASTER_DOCUMENT_CATEGORIES = [
  {
    category_name: "Employment Contracts",
    description: "Employment agreements and contract documents",
    is_confidential: true,
    retention_period_months: 84 // 7 years
  },
  {
    category_name: "Personnel Files",
    description: "Employee personal information and records",
    is_confidential: true,
    retention_period_months: 84
  },
  {
    category_name: "Training Records",
    description: "Professional development and training documentation",
    is_confidential: false,
    retention_period_months: 60 // 5 years
  },
  {
    category_name: "Performance Reviews",
    description: "Annual performance evaluations and assessments",
    is_confidential: true,
    retention_period_months: 60
  },
  {
    category_name: "Payroll Documents",
    description: "Salary, tax, and payroll related documents",
    is_confidential: true,
    retention_period_months: 84
  },
  {
    category_name: "Health & Safety",
    description: "Incident reports, risk assessments, and safety documentation",
    is_confidential: false,
    retention_period_months: 36 // 3 years
  }
];

export function HRMasterData() {
  const [existingDepartments, setExistingDepartments] = useState<string[]>([]);
  const [existingAssetCategories, setExistingAssetCategories] = useState<string[]>([]);
  const [existingBenefitPlans, setExistingBenefitPlans] = useState<string[]>([]);
  const [existingDocumentCategories, setExistingDocumentCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const [
        departmentsResult,
        assetCategoriesResult,
        benefitPlansResult,
        documentCategoriesResult
      ] = await Promise.all([
        supabase.from('departments').select('name'),
        supabase.from('asset_categories').select('category_name'),
        supabase.from('benefit_plans').select('plan_name'),
        supabase.from('document_categories').select('category_name')
      ]);

      setExistingDepartments(departmentsResult.data?.map(d => d.name) || []);
      setExistingAssetCategories(assetCategoriesResult.data?.map(a => a.category_name) || []);
      setExistingBenefitPlans(benefitPlansResult.data?.map(b => b.plan_name) || []);
      setExistingDocumentCategories(documentCategoriesResult.data?.map(d => d.category_name) || []);
    } catch (error) {
      console.error('Error fetching existing HR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const installMasterData = async () => {
    setInstalling(true);
    try {
      // Install departments
      const newDepartments = MASTER_DEPARTMENTS.filter(dept => 
        !existingDepartments.includes(dept.name)
      );
      if (newDepartments.length > 0) {
        await supabase.from('departments').insert(newDepartments);
      }

      // Install positions (we don't have a positions table, this would need to be created)
      // For now, we'll skip this step

      // Install asset categories
      const newAssetCategories = MASTER_ASSET_CATEGORIES.filter(cat => 
        !existingAssetCategories.includes(cat.category_name)
      );
      if (newAssetCategories.length > 0) {
        await supabase.from('asset_categories').insert(newAssetCategories);
      }

      // Install benefit plans
      const newBenefitPlans = MASTER_BENEFIT_PLANS.filter(plan => 
        !existingBenefitPlans.includes(plan.plan_name)
      );
      if (newBenefitPlans.length > 0) {
        await supabase.from('benefit_plans').insert(newBenefitPlans);
      }

      // Install document categories
      const newDocumentCategories = MASTER_DOCUMENT_CATEGORIES.filter(cat => 
        !existingDocumentCategories.includes(cat.category_name)
      );
      if (newDocumentCategories.length > 0) {
        await supabase.from('document_categories').insert(newDocumentCategories);
      }

      toast({
        title: "Master HR Data Installed",
        description: "All HR master data has been successfully installed.",
      });

      // Refresh data
      await fetchExistingData();
    } catch (error) {
      console.error('Error installing HR master data:', error);
      toast({
        title: "Installation Failed",
        description: "There was an error installing the HR master data.",
        variant: "destructive",
      });
    } finally {
      setInstalling(false);
    }
  };

  const installIndividualItem = async (type: string, item: any) => {
    try {
      switch (type) {
        case 'departments':
          await supabase.from('departments').insert([item]);
          setExistingDepartments([...existingDepartments, item.name]);
          break;
        case 'asset_categories':
          await supabase.from('asset_categories').insert([item]);
          setExistingAssetCategories([...existingAssetCategories, item.category_name]);
          break;
        case 'benefit_plans':
          await supabase.from('benefit_plans').insert([item]);
          setExistingBenefitPlans([...existingBenefitPlans, item.plan_name]);
          break;
        case 'document_categories':
          await supabase.from('document_categories').insert([item]);
          setExistingDocumentCategories([...existingDocumentCategories, item.category_name]);
          break;
      }

      toast({
        title: "Item Installed",
        description: `${item.name || item.plan_name || item.category_name} has been installed.`,
      });
    } catch (error) {
      console.error(`Error installing ${type}:`, error);
      toast({
        title: "Installation Failed",
        description: `Failed to install ${item.name || item.plan_name || item.category_name}.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">Loading HR master data...</div>
      </div>
    );
  }

  const totalMasterItems = MASTER_DEPARTMENTS.length + MASTER_ASSET_CATEGORIES.length + 
                          MASTER_BENEFIT_PLANS.length + MASTER_DOCUMENT_CATEGORIES.length;
  const installedItems = existingDepartments.length + existingAssetCategories.length + 
                        existingBenefitPlans.length + existingDocumentCategories.length;
  const availableItems = totalMasterItems - installedItems;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">HR Master Data</h2>
          <p className="text-muted-foreground">Install essential HR data for your school</p>
        </div>
        <Button onClick={installMasterData} disabled={installing || availableItems === 0}>
          {installing ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Installing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Install All HR Data
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="assets">Asset Categories</TabsTrigger>
          <TabsTrigger value="benefits">Benefit Plans</TabsTrigger>
          <TabsTrigger value="documents">Document Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingDepartments.map((dept, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{dept}</span>
                        </div>
                      ))}
                      {existingDepartments.length === 0 && (
                        <p className="text-muted-foreground">No departments installed yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_DEPARTMENTS.filter(dept => !existingDepartments.includes(dept.name)).map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium">{dept.name}</div>
                            <div className="text-sm text-muted-foreground">{dept.description}</div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('departments', dept)}
                          >
                            Install
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Asset Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingAssetCategories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_ASSET_CATEGORIES.filter(cat => !existingAssetCategories.includes(cat.category_name)).map((cat, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium">{cat.category_name}</div>
                            <div className="text-sm text-muted-foreground">{cat.description}</div>
                            <div className="text-sm text-muted-foreground">Depreciation: {cat.depreciation_rate}%</div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('asset_categories', cat)}
                          >
                            Install
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Benefit Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingBenefitPlans.map((plan, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{plan}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_BENEFIT_PLANS.filter(plan => !existingBenefitPlans.includes(plan.plan_name)).map((plan, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium">{plan.plan_name}</div>
                            <div className="text-sm text-muted-foreground">{plan.plan_description}</div>
                            <div className="text-sm text-muted-foreground">
                              Employer: £{plan.employer_contribution} | Employee: £{plan.employee_contribution}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('benefit_plans', plan)}
                          >
                            Install
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingDocumentCategories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_DOCUMENT_CATEGORIES.filter(cat => !existingDocumentCategories.includes(cat.category_name)).map((cat, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium">{cat.category_name}</div>
                            <div className="text-sm text-muted-foreground">{cat.description}</div>
                            <div className="text-sm text-muted-foreground">
                              Retention: {Math.floor(cat.retention_period_months / 12)} years
                              {cat.is_confidential && <Badge variant="outline" className="ml-2">Confidential</Badge>}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('document_categories', cat)}
                          >
                            Install
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Installation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total HR Master Data Items</span>
              <Badge>{totalMasterItems}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Installed</span>
              <Badge variant="outline">{installedItems}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Available to Install</span>
              <Badge variant="secondary">{availableItems}</Badge>
            </div>
            <Progress value={(installedItems / totalMasterItems) * 100} />
            <p className="text-sm text-muted-foreground">
              This HR master data includes essential departments, asset categories, benefit plans, 
              and document categories commonly used in educational institutions. Installing this 
              data will set up your HR management system with standard configurations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
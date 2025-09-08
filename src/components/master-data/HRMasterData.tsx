import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Clock,
  Plus,
  Archive,
  ArchiveRestore
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
  const [existingDepartments, setExistingDepartments] = useState<any[]>([]);
  const [existingAssetCategories, setExistingAssetCategories] = useState<any[]>([]);
  const [existingBenefitPlans, setExistingBenefitPlans] = useState<any[]>([]);
  const [existingDocumentCategories, setExistingDocumentCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [showAddBenefitForm, setShowAddBenefitForm] = useState(false);
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    cost_center: '',
    is_active: true
  });
  const [newAssetCategory, setNewAssetCategory] = useState({
    category_name: '',
    description: '',
    depreciation_rate: 10.0
  });
  const [newBenefitPlan, setNewBenefitPlan] = useState({
    plan_name: '',
    plan_type: 'health',
    plan_description: '',
    provider_name: '',
    employer_contribution: 0,
    employee_contribution: 0,
    is_active: true
  });
  const [newDocumentCategory, setNewDocumentCategory] = useState({
    category_name: '',
    description: '',
    is_confidential: false,
    retention_period_months: 12
  });
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
        supabase.from('departments').select('*').order('name'),
        supabase.from('asset_categories').select('*').order('category_name'),
        supabase.from('benefit_plans').select('*').order('plan_name'),
        supabase.from('document_categories').select('*').order('category_name')
      ]);

      setExistingDepartments(departmentsResult.data || []);
      setExistingAssetCategories(assetCategoriesResult.data || []);
      setExistingBenefitPlans(benefitPlansResult.data || []);
      setExistingDocumentCategories(documentCategoriesResult.data || []);
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
        !existingDepartments.some(existing => existing.name === dept.name)
      );
      if (newDepartments.length > 0) {
        await supabase.from('departments').insert(newDepartments);
      }

      // Install positions (we don't have a positions table, this would need to be created)
      // For now, we'll skip this step

      // Install asset categories
      const newAssetCategories = MASTER_ASSET_CATEGORIES.filter(cat => 
        !existingAssetCategories.some(existing => existing.category_name === cat.category_name)
      );
      if (newAssetCategories.length > 0) {
        await supabase.from('asset_categories').insert(newAssetCategories);
      }

      // Install benefit plans
      const newBenefitPlans = MASTER_BENEFIT_PLANS.filter(plan => 
        !existingBenefitPlans.some(existing => existing.plan_name === plan.plan_name)
      );
      if (newBenefitPlans.length > 0) {
        await supabase.from('benefit_plans').insert(newBenefitPlans);
      }

      // Install document categories
      const newDocumentCategories = MASTER_DOCUMENT_CATEGORIES.filter(cat => 
        !existingDocumentCategories.some(existing => existing.category_name === cat.category_name)
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
          await fetchExistingData(); // Refresh full data including new item
          break;
        case 'asset_categories':
          await supabase.from('asset_categories').insert([item]);
          await fetchExistingData();
          break;
        case 'benefit_plans':
          await supabase.from('benefit_plans').insert([item]);
          await fetchExistingData();
          break;
        case 'document_categories':
          await supabase.from('document_categories').insert([item]);
          await fetchExistingData();
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

  const addNewDepartment = async () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from('departments').insert([newDepartment]);
      
      toast({
        title: "Success",
        description: "Department added successfully.",
      });
      
      setNewDepartment({
        name: '',
        description: '',
        cost_center: '',
        is_active: true
      });
      setShowAddForm(false);
      await fetchExistingData();
    } catch (error) {
      console.error('Error adding department:', error);
      toast({
        title: "Error",
        description: "Failed to add department.",
        variant: "destructive",
      });
    }
  };

  const toggleDepartmentStatus = async (departmentId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('departments')
        .update({ is_active: !currentStatus })
        .eq('id', departmentId);
      
      toast({
        title: "Success",
        description: `Department ${!currentStatus ? 'activated' : 'archived'} successfully.`,
      });
      
      await fetchExistingData();
    } catch (error) {
      console.error('Error updating department status:', error);
      toast({
        title: "Error",
        description: "Failed to update department status.",
        variant: "destructive",
      });
    }
  };

  const addNewAssetCategory = async () => {
    if (!newAssetCategory.category_name.trim()) {
      toast({
        title: "Error",
        description: "Asset category name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from('asset_categories').insert([newAssetCategory]);
      
      toast({
        title: "Success",
        description: "Asset category added successfully.",
      });
      
      setNewAssetCategory({
        category_name: '',
        description: '',
        depreciation_rate: 10.0
      });
      setShowAddAssetForm(false);
      await fetchExistingData();
    } catch (error) {
      console.error('Error adding asset category:', error);
      toast({
        title: "Error",
        description: "Failed to add asset category.",
        variant: "destructive",
      });
    }
  };

  const toggleAssetCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    // Archive/restore functionality will be available after database migration
    toast({
      title: "Info",
      description: "Archive functionality will be available after database migration is complete.",
    });
  };

  const addNewBenefitPlan = async () => {
    if (!newBenefitPlan.plan_name.trim()) {
      toast({
        title: "Error",
        description: "Benefit plan name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from('benefit_plans').insert([newBenefitPlan]);
      
      toast({
        title: "Success",
        description: "Benefit plan added successfully.",
      });
      
      setNewBenefitPlan({
        plan_name: '',
        plan_type: 'health',
        plan_description: '',
        provider_name: '',
        employer_contribution: 0,
        employee_contribution: 0,
        is_active: true
      });
      setShowAddBenefitForm(false);
      await fetchExistingData();
    } catch (error) {
      console.error('Error adding benefit plan:', error);
      toast({
        title: "Error",
        description: "Failed to add benefit plan.",
        variant: "destructive",
      });
    }
  };

  const toggleBenefitPlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('benefit_plans')
        .update({ is_active: !currentStatus })
        .eq('id', planId);
      
      toast({
        title: "Success",
        description: `Benefit plan ${!currentStatus ? 'activated' : 'archived'} successfully.`,
      });
      
      await fetchExistingData();
    } catch (error) {
      console.error('Error updating benefit plan status:', error);
      toast({
        title: "Error",
        description: "Failed to update benefit plan status.",
        variant: "destructive",
      });
    }
  };

  const addNewDocumentCategory = async () => {
    if (!newDocumentCategory.category_name.trim()) {
      toast({
        title: "Error",
        description: "Document category name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from('document_categories').insert([newDocumentCategory]);
      
      toast({
        title: "Success",
        description: "Document category added successfully.",
      });
      
      setNewDocumentCategory({
        category_name: '',
        description: '',
        is_confidential: false,
        retention_period_months: 12
      });
      setShowAddDocumentForm(false);
      await fetchExistingData();
    } catch (error) {
      console.error('Error adding document category:', error);
      toast({
        title: "Error",
        description: "Failed to add document category.",
        variant: "destructive",
      });
    }
  };

  const toggleDocumentCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    // Archive/restore functionality will be available after database migration
    toast({
      title: "Info",
      description: "Archive functionality will be available after database migration is complete.",
    });
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
  const installedItems = existingDepartments.length + existingAssetCategories.length + existingBenefitPlans.length + existingDocumentCategories.length;
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
          {/* Add New Department Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Add New Department
                </div>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddForm ? 'Cancel' : 'Add Department'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showAddForm && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name*</Label>
                    <Input
                      id="name"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      placeholder="e.g., Science Department"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost_center">Cost Center</Label>
                    <Input
                      id="cost_center"
                      value={newDepartment.cost_center}
                      onChange={(e) => setNewDepartment({...newDepartment, cost_center: e.target.value})}
                      placeholder="e.g., SCI001"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                    placeholder="Brief description of the department"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={newDepartment.is_active}
                    onCheckedChange={(checked) => setNewDepartment({...newDepartment, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active Department</Label>
                </div>
                <Button onClick={addNewDepartment} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Existing Departments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Departments Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingDepartments.filter(dept => dept.is_active !== false).map((dept, index) => (
                        <div key={dept.id || index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">{dept.name}</div>
                              {dept.description && (
                                <div className="text-sm text-muted-foreground">{dept.description}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleDepartmentStatus(dept.id, dept.is_active)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {existingDepartments.filter(dept => dept.is_active !== false).length === 0 && (
                        <p className="text-muted-foreground">No active departments yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Master Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_DEPARTMENTS.filter(dept => !existingDepartments.some(existing => existing.name === dept.name)).map((dept, index) => (
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
                      {MASTER_DEPARTMENTS.filter(dept => !existingDepartments.some(existing => existing.name === dept.name)).length === 0 && (
                        <p className="text-muted-foreground">All master templates installed.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Archived Departments */}
              {existingDepartments.some(dept => dept.is_active === false) && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Archived Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingDepartments.filter(dept => dept.is_active === false).map((dept, index) => (
                        <div key={dept.id || index} className="flex items-center justify-between p-2 border rounded bg-muted/50">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="font-medium text-muted-foreground">{dept.name}</div>
                              {dept.description && (
                                <div className="text-sm text-muted-foreground">{dept.description}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleDepartmentStatus(dept.id, dept.is_active)}
                          >
                            <ArchiveRestore className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          {/* Add New Asset Category Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Add New Asset Category
                </div>
                <Button
                  onClick={() => setShowAddAssetForm(!showAddAssetForm)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddAssetForm ? 'Cancel' : 'Add Category'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showAddAssetForm && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category_name">Category Name*</Label>
                    <Input
                      id="category_name"
                      value={newAssetCategory.category_name}
                      onChange={(e) => setNewAssetCategory({...newAssetCategory, category_name: e.target.value})}
                      placeholder="e.g., Laboratory Equipment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depreciation_rate">Depreciation Rate (%)</Label>
                    <Input
                      id="depreciation_rate"
                      type="number"
                      value={newAssetCategory.depreciation_rate}
                      onChange={(e) => setNewAssetCategory({...newAssetCategory, depreciation_rate: parseFloat(e.target.value)})}
                      placeholder="10"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssetCategory.description}
                    onChange={(e) => setNewAssetCategory({...newAssetCategory, description: e.target.value})}
                    placeholder="Brief description of the asset category"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="depreciation_rate">Depreciation Rate (%): {newAssetCategory.depreciation_rate}</Label>
                </div>
                <Button onClick={addNewAssetCategory} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset Category
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Asset Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Asset Categories Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingAssetCategories.map((cat, index) => (
                        <div key={cat.id || index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">{cat.category_name}</div>
                              {cat.description && (
                                <div className="text-sm text-muted-foreground">{cat.description}</div>
                              )}
                              <div className="text-sm text-muted-foreground">Depreciation: {cat.depreciation_rate}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {existingAssetCategories.length === 0 && (
                        <p className="text-muted-foreground">No categories yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Master Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_ASSET_CATEGORIES.filter(cat => !existingAssetCategories.some(existing => existing.category_name === cat.category_name)).map((cat, index) => (
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
                      {MASTER_ASSET_CATEGORIES.filter(cat => !existingAssetCategories.some(existing => existing.category_name === cat.category_name)).length === 0 && (
                        <p className="text-muted-foreground">All master templates installed.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Future: Archived Asset Categories section will be available after database migration */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          {/* Add New Benefit Plan Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Add New Benefit Plan
                </div>
                <Button
                  onClick={() => setShowAddBenefitForm(!showAddBenefitForm)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddBenefitForm ? 'Cancel' : 'Add Plan'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showAddBenefitForm && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plan_name">Plan Name*</Label>
                    <Input
                      id="plan_name"
                      value={newBenefitPlan.plan_name}
                      onChange={(e) => setNewBenefitPlan({...newBenefitPlan, plan_name: e.target.value})}
                      placeholder="e.g., Premium Health Plan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan_type">Plan Type</Label>
                    <select
                      id="plan_type"
                      value={newBenefitPlan.plan_type}
                      onChange={(e) => setNewBenefitPlan({...newBenefitPlan, plan_type: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="health">Health</option>
                      <option value="dental">Dental</option>
                      <option value="vision">Vision</option>
                      <option value="life">Life Insurance</option>
                      <option value="pension">Pension</option>
                      <option value="disability">Disability</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider_name">Provider Name</Label>
                  <Input
                    id="provider_name"
                    value={newBenefitPlan.provider_name}
                    onChange={(e) => setNewBenefitPlan({...newBenefitPlan, provider_name: e.target.value})}
                    placeholder="e.g., NHS Plus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan_description">Description</Label>
                  <Textarea
                    id="plan_description"
                    value={newBenefitPlan.plan_description}
                    onChange={(e) => setNewBenefitPlan({...newBenefitPlan, plan_description: e.target.value})}
                    placeholder="Brief description of the benefit plan"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employer_contribution">Employer Contribution (£)</Label>
                    <Input
                      id="employer_contribution"
                      type="number"
                      value={newBenefitPlan.employer_contribution}
                      onChange={(e) => setNewBenefitPlan({...newBenefitPlan, employer_contribution: parseFloat(e.target.value)})}
                      placeholder="500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee_contribution">Employee Contribution (£)</Label>
                    <Input
                      id="employee_contribution"
                      type="number"
                      value={newBenefitPlan.employee_contribution}
                      onChange={(e) => setNewBenefitPlan({...newBenefitPlan, employee_contribution: parseFloat(e.target.value)})}
                      placeholder="100"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={newBenefitPlan.is_active}
                    onCheckedChange={(checked) => setNewBenefitPlan({...newBenefitPlan, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active Plan</Label>
                </div>
                <Button onClick={addNewBenefitPlan} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit Plan
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Benefit Plans Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Benefit Plans Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingBenefitPlans.filter(plan => plan.is_active !== false).map((plan, index) => (
                        <div key={plan.id || index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">{plan.plan_name}</div>
                              {plan.plan_description && (
                                <div className="text-sm text-muted-foreground">{plan.plan_description}</div>
                              )}
                              <div className="text-sm text-muted-foreground">
                                Employer: £{plan.employer_contribution} | Employee: £{plan.employee_contribution}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleBenefitPlanStatus(plan.id, plan.is_active)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {existingBenefitPlans.filter(plan => plan.is_active !== false).length === 0 && (
                        <p className="text-muted-foreground">No active plans yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Master Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_BENEFIT_PLANS.filter(plan => !existingBenefitPlans.some(existing => existing.plan_name === plan.plan_name)).map((plan, index) => (
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
                      {MASTER_BENEFIT_PLANS.filter(plan => !existingBenefitPlans.some(existing => existing.plan_name === plan.plan_name)).length === 0 && (
                        <p className="text-muted-foreground">All master templates installed.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Archived Benefit Plans */}
              {existingBenefitPlans.some(plan => plan.is_active === false) && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Archived Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingBenefitPlans.filter(plan => plan.is_active === false).map((plan, index) => (
                        <div key={plan.id || index} className="flex items-center justify-between p-2 border rounded bg-muted/50">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="font-medium text-muted-foreground">{plan.plan_name}</div>
                              {plan.plan_description && (
                                <div className="text-sm text-muted-foreground">{plan.plan_description}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleBenefitPlanStatus(plan.id, plan.is_active)}
                          >
                            <ArchiveRestore className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Add New Document Category Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Add New Document Category
                </div>
                <Button
                  onClick={() => setShowAddDocumentForm(!showAddDocumentForm)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddDocumentForm ? 'Cancel' : 'Add Category'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showAddDocumentForm && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category_name">Category Name*</Label>
                    <Input
                      id="category_name"
                      value={newDocumentCategory.category_name}
                      onChange={(e) => setNewDocumentCategory({...newDocumentCategory, category_name: e.target.value})}
                      placeholder="e.g., Student Records"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention_period">Retention Period (months)</Label>
                    <Input
                      id="retention_period"
                      type="number"
                      value={newDocumentCategory.retention_period_months}
                      onChange={(e) => setNewDocumentCategory({...newDocumentCategory, retention_period_months: parseInt(e.target.value)})}
                      placeholder="12"
                      min="1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDocumentCategory.description}
                    onChange={(e) => setNewDocumentCategory({...newDocumentCategory, description: e.target.value})}
                    placeholder="Brief description of the document category"
                    rows={3}
                  />
                </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_confidential"
                      checked={newDocumentCategory.is_confidential}
                      onCheckedChange={(checked) => setNewDocumentCategory({...newDocumentCategory, is_confidential: checked})}
                    />
                    <Label htmlFor="is_confidential">Confidential Category</Label>
                  </div>
                <Button onClick={addNewDocumentCategory} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document Category
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Document Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Categories Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingDocumentCategories.map((cat, index) => (
                        <div key={cat.id || index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">{cat.category_name}</div>
                              {cat.description && (
                                <div className="text-sm text-muted-foreground">{cat.description}</div>
                              )}
                              <div className="text-sm text-muted-foreground">
                                Retention: {Math.floor(cat.retention_period_months / 12)} years
                                {cat.is_confidential && <Badge variant="outline" className="ml-2">Confidential</Badge>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {existingDocumentCategories.length === 0 && (
                        <p className="text-muted-foreground">No categories yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Master Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_DOCUMENT_CATEGORIES.filter(cat => !existingDocumentCategories.some(existing => existing.category_name === cat.category_name)).map((cat, index) => (
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
                      {MASTER_DOCUMENT_CATEGORIES.filter(cat => !existingDocumentCategories.some(existing => existing.category_name === cat.category_name)).length === 0 && (
                        <p className="text-muted-foreground">All master templates installed.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Future: Archived Document Categories section will be available after database migration */}
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
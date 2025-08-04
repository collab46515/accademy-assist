import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calculator, 
  Building2, 
  FileText, 
  CreditCard,
  Download,
  CheckCircle,
  Clock
} from 'lucide-react';

// Master Accounting Data Definitions
const MASTER_CHART_OF_ACCOUNTS = [
  // Assets
  { account_code: "1000", account_name: "Current Assets", account_type: "Asset", balance_type: "debit", level: 1, parent_account_id: null },
  { account_code: "1100", account_name: "Cash and Cash Equivalents", account_type: "Asset", balance_type: "debit", level: 2 },
  { account_code: "1110", account_name: "Petty Cash", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1120", account_name: "Current Account", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1130", account_name: "Savings Account", account_type: "Asset", balance_type: "debit", level: 3 },
  
  { account_code: "1200", account_name: "Accounts Receivable", account_type: "Asset", balance_type: "debit", level: 2 },
  { account_code: "1210", account_name: "Student Fees Receivable", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1220", account_name: "Other Receivables", account_type: "Asset", balance_type: "debit", level: 3 },
  
  { account_code: "1300", account_name: "Prepaid Expenses", account_type: "Asset", balance_type: "debit", level: 2 },
  { account_code: "1310", account_name: "Prepaid Insurance", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1320", account_name: "Prepaid Utilities", account_type: "Asset", balance_type: "debit", level: 3 },
  
  { account_code: "1400", account_name: "Fixed Assets", account_type: "Asset", balance_type: "debit", level: 2 },
  { account_code: "1410", account_name: "Buildings", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1420", account_name: "Equipment", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1430", account_name: "Vehicles", account_type: "Asset", balance_type: "debit", level: 3 },
  { account_code: "1490", account_name: "Accumulated Depreciation", account_type: "Asset", balance_type: "credit", level: 3 },

  // Liabilities
  { account_code: "2000", account_name: "Current Liabilities", account_type: "Liability", balance_type: "credit", level: 1 },
  { account_code: "2100", account_name: "Accounts Payable", account_type: "Liability", balance_type: "credit", level: 2 },
  { account_code: "2110", account_name: "Trade Creditors", account_type: "Liability", balance_type: "credit", level: 3 },
  { account_code: "2120", account_name: "Utilities Payable", account_type: "Liability", balance_type: "credit", level: 3 },
  
  { account_code: "2200", account_name: "Accrued Expenses", account_type: "Liability", balance_type: "credit", level: 2 },
  { account_code: "2210", account_name: "Salaries Payable", account_type: "Liability", balance_type: "credit", level: 3 },
  { account_code: "2220", account_name: "Benefits Payable", account_type: "Liability", balance_type: "credit", level: 3 },
  
  { account_code: "2300", account_name: "Tax Liabilities", account_type: "Liability", balance_type: "credit", level: 2 },
  { account_code: "2310", account_name: "VAT Payable", account_type: "Liability", balance_type: "credit", level: 3 },
  { account_code: "2320", account_name: "PAYE Payable", account_type: "Liability", balance_type: "credit", level: 3 },
  { account_code: "2330", account_name: "National Insurance Payable", account_type: "Liability", balance_type: "credit", level: 3 },

  // Equity
  { account_code: "3000", account_name: "Equity", account_type: "Equity", balance_type: "credit", level: 1 },
  { account_code: "3100", account_name: "Retained Earnings", account_type: "Equity", balance_type: "credit", level: 2 },
  { account_code: "3200", account_name: "Current Year Earnings", account_type: "Equity", balance_type: "credit", level: 2 },

  // Revenue
  { account_code: "4000", account_name: "Revenue", account_type: "Revenue", balance_type: "credit", level: 1 },
  { account_code: "4100", account_name: "Student Fees", account_type: "Revenue", balance_type: "credit", level: 2 },
  { account_code: "4110", account_name: "Tuition Fees", account_type: "Revenue", balance_type: "credit", level: 3 },
  { account_code: "4120", account_name: "Examination Fees", account_type: "Revenue", balance_type: "credit", level: 3 },
  { account_code: "4130", account_name: "Laboratory Fees", account_type: "Revenue", balance_type: "credit", level: 3 },
  { account_code: "4140", account_name: "Transport Fees", account_type: "Revenue", balance_type: "credit", level: 3 },
  
  { account_code: "4200", account_name: "Other Income", account_type: "Revenue", balance_type: "credit", level: 2 },
  { account_code: "4210", account_name: "Government Grants", account_type: "Revenue", balance_type: "credit", level: 3 },
  { account_code: "4220", account_name: "Donations", account_type: "Revenue", balance_type: "credit", level: 3 },
  { account_code: "4230", account_name: "Investment Income", account_type: "Revenue", balance_type: "credit", level: 3 },

  // Expenses
  { account_code: "5000", account_name: "Operating Expenses", account_type: "Expense", balance_type: "debit", level: 1 },
  { account_code: "5100", account_name: "Staff Costs", account_type: "Expense", balance_type: "debit", level: 2 },
  { account_code: "5110", account_name: "Salaries and Wages", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5120", account_name: "Employee Benefits", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5130", account_name: "Training and Development", account_type: "Expense", balance_type: "debit", level: 3 },
  
  { account_code: "5200", account_name: "Facilities and Utilities", account_type: "Expense", balance_type: "debit", level: 2 },
  { account_code: "5210", account_name: "Rent and Rates", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5220", account_name: "Electricity", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5230", account_name: "Water", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5240", account_name: "Gas", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5250", account_name: "Maintenance and Repairs", account_type: "Expense", balance_type: "debit", level: 3 },
  
  { account_code: "5300", account_name: "Educational Resources", account_type: "Expense", balance_type: "debit", level: 2 },
  { account_code: "5310", account_name: "Books and Materials", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5320", account_name: "Laboratory Equipment", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5330", account_name: "IT Equipment", account_type: "Expense", balance_type: "debit", level: 3 },
  
  { account_code: "5400", account_name: "Administrative Expenses", account_type: "Expense", balance_type: "debit", level: 2 },
  { account_code: "5410", account_name: "Office Supplies", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5420", account_name: "Communications", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5430", account_name: "Insurance", account_type: "Expense", balance_type: "debit", level: 3 },
  { account_code: "5440", account_name: "Professional Fees", account_type: "Expense", balance_type: "debit", level: 3 }
];

const MASTER_VENDORS = [
  {
    vendor_code: "VEN001",
    vendor_name: "ABC Educational Supplies",
    contact_person: "John Smith",
    email: "john@abcedu.com",
    phone: "+44 20 1234 5678",
    address: "123 Education Street, London, E1 1AA",
    vendor_type: "Supplier",
    payment_terms: "Net 30",
    is_active: true
  },
  {
    vendor_code: "VEN002",
    vendor_name: "Tech Solutions Ltd",
    contact_person: "Sarah Johnson",
    email: "sarah@techsolutions.co.uk",
    phone: "+44 20 2345 6789",
    address: "456 Technology Park, Manchester, M1 2BB",
    vendor_type: "IT Services",
    payment_terms: "Net 14",
    is_active: true
  },
  {
    vendor_code: "VEN003",
    vendor_name: "Facilities Management Co",
    contact_person: "Mike Wilson",
    email: "mike@facilitiesmgmt.com",
    phone: "+44 20 3456 7890",
    address: "789 Service Road, Birmingham, B1 3CC",
    vendor_type: "Services",
    payment_terms: "Net 30",
    is_active: true
  },
  {
    vendor_code: "VEN004",
    vendor_name: "Green Energy Utilities",
    contact_person: "Emma Brown",
    email: "emma@greenenergy.co.uk",
    phone: "+44 20 4567 8901",
    address: "321 Power Street, Leeds, LS1 4DD",
    vendor_type: "Utilities",
    payment_terms: "Net 14",
    is_active: true
  },
  {
    vendor_code: "VEN005",
    vendor_name: "Office Plus Supplies",
    contact_person: "David Taylor",
    email: "david@officeplus.com",
    phone: "+44 20 5678 9012",
    address: "654 Business Avenue, Liverpool, L1 5EE",
    vendor_type: "Office Supplies",
    payment_terms: "Net 30",
    is_active: true
  }
];

const MASTER_ACCOUNTING_SETTINGS = [
  {
    setting_key: "default_currency",
    setting_value: { value: "GBP", symbol: "£" },
    description: "Default currency for the organization",
    is_system_setting: true
  },
  {
    setting_key: "fiscal_year_start",
    setting_value: { month: 9, day: 1 },
    description: "Start of fiscal year (September 1st for schools)",
    is_system_setting: true
  },
  {
    setting_key: "invoice_number_prefix",
    setting_value: { prefix: "INV", start_number: 1000 },
    description: "Invoice numbering format",
    is_system_setting: false
  },
  {
    setting_key: "bill_number_prefix",
    setting_value: { prefix: "BILL", start_number: 1000 },
    description: "Bill numbering format",
    is_system_setting: false
  },
  {
    setting_key: "po_number_prefix",
    setting_value: { prefix: "PO", start_number: 1000 },
    description: "Purchase order numbering format",
    is_system_setting: false
  },
  {
    setting_key: "vat_rate",
    setting_value: { rate: 20.0, description: "Standard UK VAT rate" },
    description: "Default VAT/Tax rate",
    is_system_setting: false
  },
  {
    setting_key: "payment_terms",
    setting_value: { 
      options: ["Net 7", "Net 14", "Net 30", "Net 60", "Due on Receipt", "2/10 Net 30"] 
    },
    description: "Standard payment terms options",
    is_system_setting: false
  }
];

export function AccountingMasterData() {
  const [existingAccounts, setExistingAccounts] = useState<string[]>([]);
  const [existingVendors, setExistingVendors] = useState<string[]>([]);
  const [existingSettings, setExistingSettings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const [
        accountsResult,
        vendorsResult,
        settingsResult
      ] = await Promise.all([
        supabase.from('chart_of_accounts').select('account_code'),
        supabase.from('vendors').select('vendor_name'),
        supabase.from('accounting_settings').select('setting_key')
      ]);

      setExistingAccounts(accountsResult.data?.map(a => a.account_code) || []);
      setExistingVendors(vendorsResult.data?.map(v => v.vendor_name) || []);
      setExistingSettings(settingsResult.data?.map(s => s.setting_key) || []);
    } catch (error) {
      console.error('Error fetching existing accounting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const installMasterData = async () => {
    setInstalling(true);
    try {
      // Install chart of accounts with parent relationships
      const newAccounts = MASTER_CHART_OF_ACCOUNTS.filter(account => 
        !existingAccounts.includes(account.account_code)
      );
      
      if (newAccounts.length > 0) {
        // First insert accounts without parent references
        const accountsWithoutParent = newAccounts.map(account => ({
          ...account,
          parent_account_id: null,
          is_active: true
        }));
        await supabase.from('chart_of_accounts').insert(accountsWithoutParent);
      }

      // Install vendors
      const newVendors = MASTER_VENDORS.filter(vendor => 
        !existingVendors.includes(vendor.vendor_name)
      );
      if (newVendors.length > 0) {
        await supabase.from('vendors').insert(newVendors);
      }

      // Install accounting settings
      const newSettings = MASTER_ACCOUNTING_SETTINGS.filter(setting => 
        !existingSettings.includes(setting.setting_key)
      );
      if (newSettings.length > 0) {
        await supabase.from('accounting_settings').insert(newSettings);
      }

      toast({
        title: "Master Accounting Data Installed",
        description: "All accounting master data has been successfully installed.",
      });

      // Refresh data
      await fetchExistingData();
    } catch (error) {
      console.error('Error installing accounting master data:', error);
      toast({
        title: "Installation Failed",
        description: "There was an error installing the accounting master data.",
        variant: "destructive",
      });
    } finally {
      setInstalling(false);
    }
  };

  const installIndividualItem = async (type: string, item: any) => {
    try {
      switch (type) {
        case 'accounts':
          await supabase.from('chart_of_accounts').insert([{ ...item, is_active: true }]);
          setExistingAccounts([...existingAccounts, item.account_code]);
          break;
        case 'vendors':
          await supabase.from('vendors').insert([item]);
          setExistingVendors([...existingVendors, item.vendor_name]);
          break;
        case 'settings':
          await supabase.from('accounting_settings').insert([item]);
          setExistingSettings([...existingSettings, item.setting_key]);
          break;
      }

      toast({
        title: "Item Installed",
        description: `${item.account_name || item.vendor_name || item.setting_key} has been installed.`,
      });
    } catch (error) {
      console.error(`Error installing ${type}:`, error);
      toast({
        title: "Installation Failed",
        description: `Failed to install ${item.account_name || item.vendor_name || item.setting_key}.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">Loading accounting master data...</div>
      </div>
    );
  }

  const totalMasterItems = MASTER_CHART_OF_ACCOUNTS.length + MASTER_VENDORS.length + MASTER_ACCOUNTING_SETTINGS.length;
  const installedItems = existingAccounts.length + existingVendors.length + existingSettings.length;
  const availableItems = totalMasterItems - installedItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Accounting Master Data Management</h2>
        <Button onClick={installMasterData} disabled={installing || availableItems === 0}>
          {installing ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Installing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Install All Accounting Data
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Chart of Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Accounts ({existingAccounts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {existingAccounts.slice(0, 10).map((account, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{account}</span>
                        </div>
                      ))}
                      {existingAccounts.length > 10 && (
                        <div className="text-sm text-muted-foreground">
                          And {existingAccounts.length - 10} more...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {MASTER_CHART_OF_ACCOUNTS.filter(acc => !existingAccounts.includes(acc.account_code)).slice(0, 5).map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{account.account_code} - {account.account_name}</div>
                            <div className="text-xs text-muted-foreground">{account.account_type}</div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('accounts', account)}
                          >
                            Install
                          </Button>
                        </div>
                      ))}
                      <div className="text-sm text-muted-foreground">
                        {MASTER_CHART_OF_ACCOUNTS.filter(acc => !existingAccounts.includes(acc.account_code)).length} accounts available
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Vendors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingVendors.map((vendor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{vendor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Vendors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_VENDORS.filter(vendor => !existingVendors.includes(vendor.vendor_name)).map((vendor, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{vendor.vendor_name}</div>
                            <div className="text-xs text-muted-foreground">{vendor.vendor_type}</div>
                            <div className="text-xs text-muted-foreground">{vendor.payment_terms}</div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('vendors', vendor)}
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

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Accounting Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Installed Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {existingSettings.map((setting, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{setting}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {MASTER_ACCOUNTING_SETTINGS.filter(setting => !existingSettings.includes(setting.setting_key)).map((setting, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{setting.setting_key}</div>
                            <div className="text-xs text-muted-foreground">{setting.description}</div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => installIndividualItem('settings', setting)}
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
              <span>Total Accounting Master Data Items</span>
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
              This accounting master data includes a comprehensive chart of accounts for educational institutions, 
              common vendors, and essential accounting settings. Installing this data will set up your 
              accounting system with standard UK education sector configurations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
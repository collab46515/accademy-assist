import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';

// Types for accounting data
export interface ChartOfAccount {
  id: string;
  account_code: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_account_id?: string;
  is_active: boolean;
  description?: string;
  balance_type: 'debit' | 'credit';
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  vendor_code: string;
  vendor_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address: any;
  tax_number?: string;
  payment_terms: string;
  currency: string;
  is_active: boolean;
  notes?: string;
  bank_details: any;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_address: any;
  invoice_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  terms_conditions?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  created_at: string;
}

export interface Bill {
  id: string;
  bill_number: string;
  vendor_id?: string;
  vendor_name: string;
  bill_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  category?: string;
  description?: string;
  notes?: string;
  attachment_url?: string;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id?: string;
  vendor_name: string;
  order_date: string;
  expected_delivery_date?: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'received' | 'cancelled';
  delivery_address: any;
  notes?: string;
  terms_conditions?: string;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderLineItem {
  id: string;
  purchase_order_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  received_quantity: number;
  created_at: string;
}

export interface Budget {
  id: string;
  budget_name: string;
  fiscal_year: string;
  account_id?: string;
  department?: string;
  period_type: 'monthly' | 'quarterly' | 'annually';
  budgeted_amount: number;
  actual_amount: number;
  variance: number;
  variance_percentage: number;
  currency: string;
  is_active: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountingSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  is_system_setting: boolean;
  created_at: string;
  updated_at: string;
}

export function useAccountingData() {
  const { currentSchoolId } = useSchoolFilter();
  const [isLoading, setIsLoading] = useState(false);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceLineItems, setInvoiceLineItems] = useState<InvoiceLineItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [purchaseOrderLineItems, setPurchaseOrderLineItems] = useState<PurchaseOrderLineItem[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accountingSettings, setAccountingSettings] = useState<AccountingSetting[]>([]);
  const { toast } = useToast();

  // Fetch all accounting data
  const fetchAllData = async () => {
    if (!currentSchoolId) {
      console.warn('No school context - skipping accounting data fetch');
      return;
    }
    
    setIsLoading(true);
    try {
      const [
        chartResponse,
        vendorResponse,
        invoiceResponse,
        invoiceLineResponse,
        billResponse,
        poResponse,
        poLineResponse,
        budgetResponse,
        settingsResponse
      ] = await Promise.all([
        supabase.from('chart_of_accounts').select('*').order('account_code'),
        supabase.from('vendors').select('*').order('vendor_name'),
        supabase.from('invoices').select('*').order('invoice_date', { ascending: false }),
        supabase.from('invoice_line_items').select('*'),
        supabase.from('bills').select('*').order('bill_date', { ascending: false }),
        supabase.from('purchase_orders').select('*').order('order_date', { ascending: false }),
        supabase.from('purchase_order_line_items').select('*'),
        supabase.from('budgets').select('*').order('fiscal_year', { ascending: false }),
        supabase.from('accounting_settings').select('*').order('setting_key')
      ]);

      if (chartResponse.error) throw chartResponse.error;
      if (vendorResponse.error) throw vendorResponse.error;
      if (invoiceResponse.error) throw invoiceResponse.error;
      if (invoiceLineResponse.error) throw invoiceLineResponse.error;
      if (billResponse.error) throw billResponse.error;
      if (poResponse.error) throw poResponse.error;
      if (poLineResponse.error) throw poLineResponse.error;
      if (budgetResponse.error) throw budgetResponse.error;
      if (settingsResponse.error) throw settingsResponse.error;

      setChartOfAccounts(chartResponse.data as ChartOfAccount[] || []);
      setVendors(vendorResponse.data as Vendor[] || []);
      setInvoices(invoiceResponse.data as Invoice[] || []);
      setInvoiceLineItems(invoiceLineResponse.data as InvoiceLineItem[] || []);
      setBills(billResponse.data as Bill[] || []);
      setPurchaseOrders(poResponse.data as PurchaseOrder[] || []);
      setPurchaseOrderLineItems(poLineResponse.data as PurchaseOrderLineItem[] || []);
      setBudgets(budgetResponse.data as Budget[] || []);
      setAccountingSettings(settingsResponse.data as AccountingSetting[] || []);

      toast({
        title: "Success",
        description: "Accounting data loaded successfully",
      });
    } catch (error: any) {
      console.error('Error fetching accounting data:', error);
      toast({
        title: "Error",
        description: "Failed to load accounting data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create functions
  const createAccount = async (accountData: Omit<ChartOfAccount, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .insert([accountData])
        .select()
        .single();

      if (error) throw error;

      setChartOfAccounts(prev => [...prev, data as ChartOfAccount]);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createVendor = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => [...prev, data as Vendor]);
      toast({
        title: "Success",
        description: "Vendor created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;

      setInvoices(prev => [...prev, data as Invoice]);
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createBill = async (billData: Omit<Bill, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([billData])
        .select()
        .single();

      if (error) throw error;

      setBills(prev => [...prev, data as Bill]);
      toast({
        title: "Success",
        description: "Bill created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createPurchaseOrder = async (poData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert([poData])
        .select()
        .single();

      if (error) throw error;

      setPurchaseOrders(prev => [...prev, data as PurchaseOrder]);
      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createBudget = async (budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([budgetData])
        .select()
        .single();

      if (error) throw error;

      setBudgets(prev => [...prev, data as Budget]);
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update functions
  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => prev.map(vendor => vendor.id === id ? data as Vendor : vendor));
      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInvoices(prev => prev.map(invoice => invoice.id === id ? data as Invoice : invoice));
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAccountingSetting = async (settingKey: string, settingValue: any) => {
    try {
      const { data, error } = await supabase
        .from('accounting_settings')
        .update({ setting_value: settingValue })
        .eq('setting_key', settingKey)
        .select()
        .single();

      if (error) throw error;

      setAccountingSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey ? data as AccountingSetting : setting
      ));
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Utility functions
  const formatCurrency = (amount: number, currency: string = 'INR') => {
    const currencyMap: { [key: string]: string } = {
      'INR': '₹',
      'EUR': '€',
      'GBP': '£'
    };
    return `${currencyMap[currency] || '£'}${amount.toLocaleString()}`;
  };

  const getNextInvoiceNumber = () => {
    const settings = accountingSettings.find(s => s.setting_key === 'invoice_prefix');
    const prefix = settings?.setting_value?.prefix || 'INV';
    const nextNumber = settings?.setting_value?.next_number || 1001;
    return `${prefix}${nextNumber}`;
  };

  const getNextBillNumber = () => {
    const settings = accountingSettings.find(s => s.setting_key === 'bill_prefix');
    const prefix = settings?.setting_value?.prefix || 'BILL';
    const nextNumber = settings?.setting_value?.next_number || 1001;
    return `${prefix}${nextNumber}`;
  };

  const getNextPONumber = () => {
    const settings = accountingSettings.find(s => s.setting_key === 'po_prefix');
    const prefix = settings?.setting_value?.prefix || 'PO';
    const nextNumber = settings?.setting_value?.next_number || 1001;
    return `${prefix}${nextNumber}`;
  };

  const refreshData = () => {
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    isLoading,
    chartOfAccounts,
    vendors,
    invoices,
    invoiceLineItems,
    bills,
    purchaseOrders,
    purchaseOrderLineItems,
    budgets,
    accountingSettings,
    createAccount,
    createVendor,
    createInvoice,
    createBill,
    createPurchaseOrder,
    createBudget,
    updateVendor,
    updateInvoice,
    updateAccountingSetting,
    formatCurrency,
    getNextInvoiceNumber,
    getNextBillNumber,
    getNextPONumber,
    refreshData
  };
}
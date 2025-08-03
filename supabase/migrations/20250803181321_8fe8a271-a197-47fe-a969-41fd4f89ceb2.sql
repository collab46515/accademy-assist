-- Create accounting database schema

-- Chart of Accounts table
CREATE TABLE public.chart_of_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_code TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_account_id UUID REFERENCES public.chart_of_accounts(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  balance_type TEXT NOT NULL CHECK (balance_type IN ('debit', 'credit')) DEFAULT 'debit',
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_code TEXT NOT NULL UNIQUE,
  vendor_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  tax_number TEXT,
  payment_terms TEXT DEFAULT 'net_30',
  currency TEXT NOT NULL DEFAULT 'GBP',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  bank_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_address JSONB DEFAULT '{}'::jsonb,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance_due DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  terms_conditions TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoice line items
CREATE TABLE public.invoice_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  line_total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bills table
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES public.vendors(id),
  vendor_name TEXT NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance_due DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'overdue', 'cancelled')),
  category TEXT,
  description TEXT,
  notes TEXT,
  attachment_url TEXT,
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase Orders table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  vendor_id UUID REFERENCES public.vendors(id),
  vendor_name TEXT NOT NULL,
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  currency TEXT NOT NULL DEFAULT 'GBP',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'sent', 'received', 'cancelled')),
  delivery_address JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  terms_conditions TEXT,
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase Order line items
CREATE TABLE public.purchase_order_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  line_total DECIMAL(12,2) NOT NULL,
  received_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Budget table
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_name TEXT NOT NULL,
  fiscal_year TEXT NOT NULL,
  account_id UUID REFERENCES public.chart_of_accounts(id),
  department TEXT,
  period_type TEXT NOT NULL DEFAULT 'monthly' CHECK (period_type IN ('monthly', 'quarterly', 'annually')),
  budgeted_amount DECIMAL(12,2) NOT NULL,
  actual_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  variance DECIMAL(12,2) NOT NULL DEFAULT 0,
  variance_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GBP',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Accounting Settings table
CREATE TABLE public.accounting_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  is_system_setting BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_chart_of_accounts_parent ON public.chart_of_accounts(parent_account_id);
CREATE INDEX idx_chart_of_accounts_type ON public.chart_of_accounts(account_type);
CREATE INDEX idx_vendors_active ON public.vendors(is_active);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_bills_vendor ON public.bills(vendor_id);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_purchase_orders_vendor ON public.purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX idx_budgets_account ON public.budgets(account_id);
CREATE INDEX idx_budgets_fiscal_year ON public.budgets(fiscal_year);

-- Add triggers for updated_at columns
CREATE TRIGGER update_chart_of_accounts_updated_at
  BEFORE UPDATE ON public.chart_of_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounting_settings_updated_at
  BEFORE UPDATE ON public.accounting_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
CREATE POLICY "Accounting users can manage chart of accounts" 
ON public.chart_of_accounts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage vendors" 
ON public.vendors 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage invoices" 
ON public.invoices 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage invoice line items" 
ON public.invoice_line_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage bills" 
ON public.bills 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage purchase orders" 
ON public.purchase_orders 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage purchase order line items" 
ON public.purchase_order_line_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage budgets" 
ON public.budgets 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Accounting users can manage settings" 
ON public.accounting_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

-- Insert default chart of accounts
INSERT INTO public.chart_of_accounts (account_code, account_name, account_type, balance_type, level) VALUES
-- Assets
('1000', 'Current Assets', 'asset', 'debit', 1),
('1100', 'Cash and Cash Equivalents', 'asset', 'debit', 2),
('1110', 'Petty Cash', 'asset', 'debit', 3),
('1120', 'Bank Current Account', 'asset', 'debit', 3),
('1130', 'Bank Savings Account', 'asset', 'debit', 3),
('1200', 'Accounts Receivable', 'asset', 'debit', 2),
('1210', 'Student Fees Receivable', 'asset', 'debit', 3),
('1220', 'Other Receivables', 'asset', 'debit', 3),
('1300', 'Inventory', 'asset', 'debit', 2),
('1400', 'Prepaid Expenses', 'asset', 'debit', 2),
('1500', 'Fixed Assets', 'asset', 'debit', 1),
('1510', 'Buildings', 'asset', 'debit', 2),
('1520', 'Equipment', 'asset', 'debit', 2),
('1530', 'Furniture and Fixtures', 'asset', 'debit', 2),
('1540', 'Accumulated Depreciation', 'asset', 'credit', 2),

-- Liabilities
('2000', 'Current Liabilities', 'liability', 'credit', 1),
('2100', 'Accounts Payable', 'liability', 'credit', 2),
('2200', 'Accrued Expenses', 'liability', 'credit', 2),
('2300', 'Short-term Loans', 'liability', 'credit', 2),
('2400', 'Tax Payable', 'liability', 'credit', 2),
('2500', 'Long-term Liabilities', 'liability', 'credit', 1),
('2510', 'Long-term Loans', 'liability', 'credit', 2),
('2520', 'Mortgage Payable', 'liability', 'credit', 2),

-- Equity
('3000', 'Equity', 'equity', 'credit', 1),
('3100', 'Retained Earnings', 'equity', 'credit', 2),
('3200', 'Current Year Earnings', 'equity', 'credit', 2),

-- Revenue
('4000', 'Revenue', 'revenue', 'credit', 1),
('4100', 'Tuition Fees', 'revenue', 'credit', 2),
('4200', 'Boarding Fees', 'revenue', 'credit', 2),
('4300', 'Activity Fees', 'revenue', 'credit', 2),
('4400', 'Transport Fees', 'revenue', 'credit', 2),
('4500', 'Meal Fees', 'revenue', 'credit', 2),
('4600', 'Other Income', 'revenue', 'credit', 2),

-- Expenses
('5000', 'Operating Expenses', 'expense', 'debit', 1),
('5100', 'Salaries and Wages', 'expense', 'debit', 2),
('5200', 'Benefits', 'expense', 'debit', 2),
('5300', 'Utilities', 'expense', 'debit', 2),
('5400', 'Maintenance and Repairs', 'expense', 'debit', 2),
('5500', 'Office Supplies', 'expense', 'debit', 2),
('5600', 'Insurance', 'expense', 'debit', 2),
('5700', 'Professional Services', 'expense', 'debit', 2),
('5800', 'Depreciation Expense', 'expense', 'debit', 2);

-- Insert default accounting settings
INSERT INTO public.accounting_settings (setting_key, setting_value, description, is_system_setting) VALUES
('default_currency', '{"currency": "GBP", "symbol": "£"}', 'Default system currency', true),
('tax_rates', '{"standard": 20, "reduced": 5, "zero": 0}', 'Standard tax rates', false),
('fiscal_year_start', '{"month": 9, "day": 1}', 'Fiscal year start date (September 1st)', false),
('invoice_prefix', '{"prefix": "INV", "next_number": 1001}', 'Invoice numbering settings', false),
('bill_prefix', '{"prefix": "BILL", "next_number": 1001}', 'Bill numbering settings', false),
('po_prefix', '{"prefix": "PO", "next_number": 1001}', 'Purchase order numbering settings', false),
('payment_terms', '{"net_15": "Net 15 Days", "net_30": "Net 30 Days", "net_60": "Net 60 Days", "due_on_receipt": "Due on Receipt"}', 'Available payment terms', false),
('currencies', '[{"code": "GBP", "name": "British Pound", "symbol": "£"}, {"code": "USD", "name": "US Dollar", "symbol": "$"}, {"code": "EUR", "name": "Euro", "symbol": "€"}]', 'Supported currencies', false);
-- Update default currency from GBP to OMR in bills table
ALTER TABLE bills ALTER COLUMN currency SET DEFAULT 'OMR';

-- Update default currency from GBP to OMR in budgets table  
ALTER TABLE budgets ALTER COLUMN currency SET DEFAULT 'OMR';
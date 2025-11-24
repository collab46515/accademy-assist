-- Add year_group_amounts to fee_structures for class-specific pricing
ALTER TABLE fee_structures
ADD COLUMN year_group_amounts JSONB DEFAULT '{}'::jsonb;

-- Add index for better query performance
CREATE INDEX idx_fee_structures_year_group_amounts ON fee_structures USING GIN(year_group_amounts);

-- Add comment for documentation
COMMENT ON COLUMN fee_structures.year_group_amounts IS 'Stores different amounts per year group as {"Year 7": 100000, "Year 8": 110000}. If empty, uses total_amount for all year groups.';
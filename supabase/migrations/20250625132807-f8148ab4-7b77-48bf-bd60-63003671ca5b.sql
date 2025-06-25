
-- Create table to store COT reports data
CREATE TABLE public.cot_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date DATE NOT NULL,
  asset_symbol VARCHAR(20) NOT NULL,
  asset_name TEXT NOT NULL,
  commercial_long BIGINT NOT NULL DEFAULT 0,
  commercial_short BIGINT NOT NULL DEFAULT 0,
  commercial_net BIGINT NOT NULL DEFAULT 0,
  non_commercial_long BIGINT NOT NULL DEFAULT 0,
  non_commercial_short BIGINT NOT NULL DEFAULT 0,
  non_commercial_net BIGINT NOT NULL DEFAULT 0,
  total_open_interest BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique records per asset per date
  UNIQUE(report_date, asset_symbol)
);

-- Create index for faster queries
CREATE INDEX idx_cot_reports_asset_date ON public.cot_reports(asset_symbol, report_date DESC);
CREATE INDEX idx_cot_reports_date ON public.cot_reports(report_date DESC);

-- Enable Row Level Security (RLS) - make data publicly readable
ALTER TABLE public.cot_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to COT data
CREATE POLICY "Public read access to COT reports" 
  ON public.cot_reports 
  FOR SELECT 
  USING (true);

-- Create policy to allow service role to insert/update COT data
CREATE POLICY "Service role can manage COT data" 
  ON public.cot_reports 
  FOR ALL 
  USING (auth.role() = 'service_role');

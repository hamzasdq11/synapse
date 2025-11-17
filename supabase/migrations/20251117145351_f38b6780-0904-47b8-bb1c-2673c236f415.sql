-- Enable public access to campaigns table (no authentication required)
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;

-- Enable public access to personas table (no authentication required)
ALTER TABLE public.personas DISABLE ROW LEVEL SECURITY;

-- Enable public access to simulations table (no authentication required)
ALTER TABLE public.simulations DISABLE ROW LEVEL SECURITY;
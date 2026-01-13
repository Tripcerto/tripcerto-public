-- Create interest_registrations table
CREATE TABLE IF NOT EXISTS public.interest_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_interest_registrations_email ON public.interest_registrations(email);

-- Create index on registered_at for sorting
CREATE INDEX idx_interest_registrations_registered_at ON public.interest_registrations(registered_at DESC);

-- Enable Row Level Security
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert and read
CREATE POLICY "Service role can insert interest registrations"
    ON public.interest_registrations
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Service role can read interest registrations"
    ON public.interest_registrations
    FOR SELECT
    TO service_role
    USING (true);

-- Add comment to table
COMMENT ON TABLE public.interest_registrations IS 'Stores user interest registrations from the landing page';

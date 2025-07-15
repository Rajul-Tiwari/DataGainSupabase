-- Supabase Database Setup Script
-- Run this script in your Supabase SQL editor to create the required table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the records table
CREATE TABLE IF NOT EXISTS public.records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    donor TEXT NOT NULL,
    panels TEXT NOT NULL,
    barcode TEXT NOT NULL,
    source TEXT NOT NULL,
    date TEXT NOT NULL,
    amount TEXT NOT NULL,
    observed_by TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Unable to Donate', 'Refused', 'Duplicate/Error', 'Insufficient Donation', 'Approved')),
    is_highlighted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_records_donor ON public.records(donor);
CREATE INDEX IF NOT EXISTS idx_records_barcode ON public.records(barcode);
CREATE INDEX IF NOT EXISTS idx_records_status ON public.records(status);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON public.records(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

-- Create policies for CRUD operations
-- Allow all operations for authenticated users (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON public.records
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.records
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.records
    FOR DELETE USING (true);

-- Insert sample data (optional)
INSERT INTO public.records (donor, panels, barcode, source, date, amount, observed_by, status, is_highlighted) VALUES
('Jenny Taskington', '3 Panel, 12 Panel to CUP', '1785928345', 'medicaid', '07/18/2023', '$0.00', 'Dhawan Vishal', 'Unable to Donate', false),
('Jenny Taskington', '3 Panel, 12 Panel to CUP', '1927447882', 'Self Pay', '07/18/2023', '$7.50', 'Dhawan Vishal', 'Refused', false),
('Jenny Taskington', '3 Panel, 12 Panel to CUP', '1927583508', 'Self Pay', '07/18/2023', '$0.00', 'Dhawan Vishal', 'Duplicate/Error', false),
('TestMidness, Sammidness', '6th Panel, 3 Panel', '1873467961', 'Self Pay', '07/18/2023', '$5.00', 'Dhawan Vishal', 'Insufficient Donation', false),
('TestMidness, Sammidness', '6th, 9th Panel', '1729158643', 'medicaid', '07/18/2023', '$0.00', 'Dhawan Vishal', 'Approved', false),
('Jenny', '625, 823', '1185585615', 'Self Pay', '07/18/2023', '$7.50', 'Mansukhar Bahal', 'Approved', true);

-- Grant necessary permissions to the authenticated role
GRANT ALL ON public.records TO authenticated;
GRANT ALL ON public.records TO anon; 

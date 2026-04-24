-- ============================================================
-- AgriConnect Supabase Database Setup
-- Run this SQL in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. FARMERS TABLE (Registration data)
CREATE TABLE IF NOT EXISTS farmers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    aadhar TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    land_size NUMERIC NOT NULL CHECK (land_size > 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- These allow anonymous users (using the anon key) to INSERT data
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT on farmers
CREATE POLICY "Allow anonymous insert on farmers"
    ON farmers FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous INSERT on contact_messages
CREATE POLICY "Allow anonymous insert on contact_messages"
    ON contact_messages FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous INSERT on service_requests
CREATE POLICY "Allow anonymous insert on service_requests"
    ON service_requests FOR INSERT
    TO anon
    WITH CHECK (true);

-- ============================================================
-- (Optional) Allow SELECT for read-back confirmations
-- Remove these if you don't want anonymous users to read data
-- ============================================================

-- CREATE POLICY "Allow anonymous select on farmers"
--     ON farmers FOR SELECT
--     TO anon
--     USING (true);

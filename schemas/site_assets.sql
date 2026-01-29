-- SQL to create site_assets table in Supabase
-- Run this in your Supabase SQL Editor

-- Create the site_assets table
CREATE TABLE IF NOT EXISTS public.site_assets (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    asset_key text NOT NULL UNIQUE,
    asset_url text NOT NULL,
    alt_text text,
    asset_type text NOT NULL DEFAULT 'image',
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT site_assets_pkey PRIMARY KEY (id),
    CONSTRAINT site_assets_type_check CHECK (
        asset_type = ANY (ARRAY['image'::text, 'favicon'::text, 'logo'::text])
    )
) TABLESPACE pg_default;

-- Create index for faster lookups by asset_key
CREATE INDEX IF NOT EXISTS idx_site_assets_key ON public.site_assets(asset_key);

-- Enable Row Level Security
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on site_assets" 
ON public.site_assets 
FOR SELECT 
USING (true);

-- Insert default assets (update these URLs with your actual Supabase storage URLs or Google Drive URLs)
INSERT INTO public.site_assets (asset_key, asset_url, alt_text, asset_type) VALUES
    ('favicon', 'https://drive.google.com/file/d/YOUR_FAVICON_FILE_ID/view', 'SHRI Lab Favicon', 'favicon'),
    ('institution_logo', 'https://drive.google.com/file/d/YOUR_IIT_PATNA_LOGO_FILE_ID/view', 'IIT Patna Logo', 'logo'),
    ('lab_logo', 'https://drive.google.com/file/d/YOUR_SHRI_LAB_LOGO_FILE_ID/view', 'SHRI Lab Logo', 'logo'),
    ('og_image', 'https://drive.google.com/file/d/YOUR_OG_IMAGE_FILE_ID/view', 'SHRI Lab Preview Image', 'image')
ON CONFLICT (asset_key) DO UPDATE SET
    asset_url = EXCLUDED.asset_url,
    alt_text = EXCLUDED.alt_text,
    updated_at = timezone('utc'::text, now());

-- Example: If you want to update an asset later, use:
-- UPDATE public.site_assets SET asset_url = 'new_url_here' WHERE asset_key = 'favicon';

-- To view all assets:
-- SELECT * FROM public.site_assets WHERE is_active = true;

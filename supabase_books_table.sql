-- Create books table
create table public.books (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  url text null,
  category text null,
  constraint books_pkey primary key (id),
  constraint books_category_check check (
    (
      category = any (
        array[
          'Medical Robotics'::text,
          'Robust Control'::text,
          'Data-Driven Control'::text,
          'Human-Robot Interaction'::text,
          'Rehabilitation Robotics'::text,
          'Bioengineering'::text,
          'Gait Analysis'::text,
          'Generative AI for Time Series Forecasting'::text,
          'Predictive Modeling for Neurodegenerative diseases'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

-- Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON public.books FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.books FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.books FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON public.books TO anon;
GRANT ALL ON public.books TO authenticated;

-- Verify the table was created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books'; 
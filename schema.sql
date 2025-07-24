-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE public.experience_type AS ENUM ('professional', 'administrative');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS public.awards CASCADE;
DROP TABLE IF EXISTS public.book_chapters CASCADE;
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.collaborators CASCADE;
DROP TABLE IF EXISTS public.conference_articles CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.journal_articles CASCADE;
DROP TABLE IF EXISTS public.noticeboard CASCADE;
DROP TABLE IF EXISTS public.patents CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.talks CASCADE;
DROP TABLE IF EXISTS public.teaching CASCADE;

-- Create tables
create table public.awards (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  type text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint awards_pkey primary key (id),
  constraint awards_type_check check (
    (
      type = any (
        array[
          'Honours'::text,
          'Editorial'::text,
          'Reviewer'::text,
          'Technical'::text,
          'Advisory'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.book_chapters (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  url text null,
  category text null,
  constraint book_chapters_pkey primary key (id),
  constraint book_chapters_category_check check (
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

create table public.collaborators (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  department text not null,
  affiliation text not null,
  country text not null,
  url text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint collaborators_pkey primary key (id)
) TABLESPACE pg_default;

create table public.conference_articles (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  url text null,
  category text null,
  constraint conference_articles_pkey primary key (id),
  constraint conference_articles_category_check check (
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

create table public.experiences (
  id uuid not null default gen_random_uuid (),
  type public.experience_type not null,
  title text not null,
  institution text not null,
  start_date date not null,
  end_date date null,
  location text null,
  description text null,
  order_index integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint experiences_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists experiences_type_order_idx on public.experiences using btree (type, order_index) TABLESPACE pg_default;

create table public.gallery (
  id bigint generated by default as identity not null,
  image_url text not null,
  caption text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint gallery_pkey primary key (id)
) TABLESPACE pg_default;

create table public.journal_articles (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  url text null,
  category text null,
  constraint journal_articles_pkey primary key (id),
  constraint journal_articles_category_check check (
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

create table public.noticeboard (
  id bigint generated by default as identity not null,
  title text not null,
  date date not null default CURRENT_DATE,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint noticeboard_pkey primary key (id)
) TABLESPACE pg_default;

create table public.patents (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  url text null,
  category text null,
  constraint patents_pkey primary key (id),
  constraint patents_category_check check (
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

create table public.projects (
  id bigserial not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  image_url text not null,
  title text not null,
  date timestamp with time zone not null,
  constraint projects_pkey primary key (id)
) TABLESPACE pg_default;

create table public.students (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  status text not null,
  year integer null,
  thesis_title text null,
  degree text not null,
  joint_supervisor text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  url text null,
  constraint students_pkey primary key (id),
  constraint students_degree_check check (
    (
      degree = any (
        array[
          'Bachelors'::text,
          'Masters'::text,
          'Doctoral'::text,
          'Intern'::text
        ]
      )
    )
  ),
  constraint students_status_check check (
    (
      status = any (array['present'::text, 'past'::text])
    )
  )
) TABLESPACE pg_default;

create table public.talks (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  year integer not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint talks_pkey primary key (id)
) TABLESPACE pg_default;

create table public.teaching (
  id uuid not null default extensions.uuid_generate_v4 (),
  course_name text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint teaching_pkey primary key (id)
) TABLESPACE pg_default;

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conference_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticeboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can read)
-- Awards table policies
CREATE POLICY "Enable read access for all users" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.awards FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.awards FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.awards FOR DELETE USING (auth.role() = 'authenticated');

-- Book chapters table policies
CREATE POLICY "Enable read access for all users" ON public.book_chapters FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.book_chapters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.book_chapters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.book_chapters FOR DELETE USING (auth.role() = 'authenticated');

-- Books table policies
CREATE POLICY "Enable read access for all users" ON public.books FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.books FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.books FOR DELETE USING (auth.role() = 'authenticated');

-- Collaborators table policies
CREATE POLICY "Enable read access for all users" ON public.collaborators FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.collaborators FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.collaborators FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.collaborators FOR DELETE USING (auth.role() = 'authenticated');

-- Conference articles table policies
CREATE POLICY "Enable read access for all users" ON public.conference_articles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.conference_articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.conference_articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.conference_articles FOR DELETE USING (auth.role() = 'authenticated');

-- Experiences table policies
CREATE POLICY "Enable read access for all users" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.experiences FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery table policies
CREATE POLICY "Enable read access for all users" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.gallery FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.gallery FOR DELETE USING (auth.role() = 'authenticated');

-- Journal articles table policies
CREATE POLICY "Enable read access for all users" ON public.journal_articles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.journal_articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.journal_articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.journal_articles FOR DELETE USING (auth.role() = 'authenticated');

-- Noticeboard table policies
CREATE POLICY "Enable read access for all users" ON public.noticeboard FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.noticeboard FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.noticeboard FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.noticeboard FOR DELETE USING (auth.role() = 'authenticated');

-- Patents table policies
CREATE POLICY "Enable read access for all users" ON public.patents FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.patents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.patents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.patents FOR DELETE USING (auth.role() = 'authenticated');

-- Projects table policies
CREATE POLICY "Enable read access for all users" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

-- Students table policies
CREATE POLICY "Enable read access for all users" ON public.students FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.students FOR DELETE USING (auth.role() = 'authenticated');

-- Talks table policies
CREATE POLICY "Enable read access for all users" ON public.talks FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.talks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.talks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.talks FOR DELETE USING (auth.role() = 'authenticated');

-- Teaching table policies
CREATE POLICY "Enable read access for all users" ON public.teaching FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.teaching FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.teaching FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.teaching FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions to anon and authenticated roles
-- Anon role (public access) - read only
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Authenticated role - full access
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure future tables have the same permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
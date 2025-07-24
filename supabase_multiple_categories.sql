-- Remove category constraints from all publication tables
-- This allows multiple categories separated by commas

-- Books table
ALTER TABLE public.books DROP CONSTRAINT IF EXISTS books_category_check;

-- Journal articles table
ALTER TABLE public.journal_articles DROP CONSTRAINT IF EXISTS journal_articles_category_check;

-- Conference articles table
ALTER TABLE public.conference_articles DROP CONSTRAINT IF EXISTS conference_articles_category_check;

-- Book chapters table
ALTER TABLE public.book_chapters DROP CONSTRAINT IF EXISTS book_chapters_category_check;

-- Patents table
ALTER TABLE public.patents DROP CONSTRAINT IF EXISTS patents_category_check;

-- Verify constraints are removed
SELECT 
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND table_name IN ('books', 'journal_articles', 'conference_articles', 'book_chapters', 'patents')
AND constraint_name LIKE '%category%';

-- Test that we can now insert multiple categories
-- Example: INSERT INTO public.books (title, year, category) VALUES ('Test Book', 2025, 'Medical Robotics, Rehabilitation Robotics'); 
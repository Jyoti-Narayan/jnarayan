-- Update the awards table to change 'Awards' type to 'Honours'
-- First, update existing records
UPDATE public.awards 
SET type = 'Honours' 
WHERE type = 'Awards';

-- Drop the existing check constraint
ALTER TABLE public.awards 
DROP CONSTRAINT IF EXISTS awards_type_check;

-- Add the new check constraint with 'Honours' instead of 'Awards'
ALTER TABLE public.awards 
ADD CONSTRAINT awards_type_check CHECK (
  type = ANY (ARRAY[
    'Honours'::text,
    'Editorial'::text,
    'Reviewer'::text,
    'Technical'::text,
    'Advisory'::text
  ])
);

-- Verify the changes
SELECT DISTINCT type FROM public.awards ORDER BY type; 
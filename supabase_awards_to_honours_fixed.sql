-- Step 1: First, drop the existing check constraint
ALTER TABLE public.awards 
DROP CONSTRAINT IF EXISTS awards_type_check;

-- Step 2: Update existing records from 'Awards' to 'Honours'
UPDATE public.awards 
SET type = 'Honours' 
WHERE type = 'Awards';

-- Step 3: Add the new check constraint with 'Honours' instead of 'Awards'
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

-- Step 4: Verify the changes
SELECT DISTINCT type FROM public.awards ORDER BY type;

-- Step 5: Test that new records can be inserted with 'Honours'
-- (You can run this test query to verify the constraint works)
-- INSERT INTO public.awards (title, year, type) VALUES ('Test Honour', 2025, 'Honours'); 
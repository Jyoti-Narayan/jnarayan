-- Alternative approach: More aggressive constraint handling

-- Step 1: Disable triggers temporarily (if any)
-- ALTER TABLE public.awards DISABLE TRIGGER ALL;

-- Step 2: Drop the constraint with CASCADE to ensure it's completely removed
ALTER TABLE public.awards 
DROP CONSTRAINT IF EXISTS awards_type_check CASCADE;

-- Step 3: Update all existing records
UPDATE public.awards 
SET type = 'Honours' 
WHERE type = 'Awards';

-- Step 4: Create the new constraint
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

-- Step 5: Re-enable triggers (if disabled)
-- ALTER TABLE public.awards ENABLE TRIGGER ALL;

-- Step 6: Verify the changes
SELECT DISTINCT type FROM public.awards ORDER BY type;

-- Step 7: Test insertion (uncomment to test)
-- INSERT INTO public.awards (title, year, type) VALUES ('Test Honour', 2025, 'Honours'); 
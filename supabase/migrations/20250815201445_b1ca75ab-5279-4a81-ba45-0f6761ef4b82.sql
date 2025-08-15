-- Update Delton's class from 7X to 1A (keeping Year 1)
-- Safe targeted update by student id
UPDATE public.students
SET form_class = '1A', updated_at = now()
WHERE id = '22ec0b2f-5ee7-4dc1-9cc3-d46be0609c98';
-- Add Aadhaar and PAN card fields to profiles table for Indian users
ALTER TABLE public.profiles 
ADD COLUMN aadhaar_number text,
ADD COLUMN pan_number text;
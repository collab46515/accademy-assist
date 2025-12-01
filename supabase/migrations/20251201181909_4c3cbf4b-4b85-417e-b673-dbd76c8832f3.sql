-- Add 'admission_decision' status to enrollment_status enum
-- This stage comes after interview_complete and before pending_approval

ALTER TYPE enrollment_status ADD VALUE IF NOT EXISTS 'admission_decision' AFTER 'interview_complete';
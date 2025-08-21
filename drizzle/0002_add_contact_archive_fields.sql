-- Add archived and archivedAt columns to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN archived_at TIMESTAMP;
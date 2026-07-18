-- Add English includes/excludes columns
ALTER TABLE tours ADD COLUMN IF NOT EXISTS includes_en jsonb DEFAULT NULL;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS excludes_en jsonb DEFAULT NULL;

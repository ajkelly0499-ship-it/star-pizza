ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS ordering_paused boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS collection_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS delivery_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS prep_time_minutes integer,
  ADD COLUMN IF NOT EXISTS opening_hours_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS opening_hours jsonb NOT NULL DEFAULT '{"mon":{"enabled":true,"open":"00:00","close":"23:59"},"tue":{"enabled":true,"open":"00:00","close":"23:59"},"wed":{"enabled":true,"open":"00:00","close":"23:59"},"thu":{"enabled":true,"open":"00:00","close":"23:59"},"fri":{"enabled":true,"open":"00:00","close":"23:59"},"sat":{"enabled":true,"open":"00:00","close":"23:59"},"sun":{"enabled":true,"open":"00:00","close":"23:59"}}'::jsonb;

-- Web Push subscriptions and scheduled feeding reminder jobs (PWA)

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

CREATE TABLE IF NOT EXISTS feeding_reminder_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  baby_name text NOT NULL,
  fire_at timestamptz NOT NULL,
  sent_at timestamptz,
  locale text NOT NULL DEFAULT 'sr',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, baby_id)
);

CREATE INDEX IF NOT EXISTS idx_feeding_reminder_jobs_due
  ON feeding_reminder_jobs (fire_at)
  WHERE sent_at IS NULL;

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_reminder_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY push_subscriptions_select_own ON push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY push_subscriptions_insert_own ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY push_subscriptions_update_own ON push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY push_subscriptions_delete_own ON push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY feeding_reminder_jobs_select_own ON feeding_reminder_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY feeding_reminder_jobs_insert_own ON feeding_reminder_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY feeding_reminder_jobs_update_own ON feeding_reminder_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY feeding_reminder_jobs_delete_own ON feeding_reminder_jobs
  FOR DELETE USING (auth.uid() = user_id);

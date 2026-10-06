-- Tracks a simulated "email confirmed" state for the free/organizador signup
-- flow, used only in test mode (when Supabase's own "Confirm email" is off
-- and VITE_TEST_SKIP_EMAIL_CONFIRM is set) to avoid hitting the project's
-- email rate limit while still exercising the same pending-confirmation UX.
-- Defaults to true so invite-based signups (already confirmed via the
-- aceitar-convite-cadastro edge function) and the real production flow are
-- unaffected.
ALTER TABLE public.profiles ADD COLUMN confirmado boolean NOT NULL DEFAULT true;

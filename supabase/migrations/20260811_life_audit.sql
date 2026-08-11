-- AncientAI — Life Audit
-- Adds storage for the onboarding quiz result on the profiles table.
--
-- Apply this against the Supabase project (SQL editor, Supabase MCP, or the
-- Supabase CLI). Until it is applied, saveLifeAudit() falls back to only
-- setting `onboarded = true`, so the app keeps working.

alter table public.profiles
    add column if not exists life_audit jsonb,
    add column if not exists archetype text;

-- Optional: quick lookups / analytics by archetype.
create index if not exists profiles_archetype_idx on public.profiles (archetype);

comment on column public.profiles.life_audit is
    'Full Life Audit result: { track, archetype, scores, winningDimension, rootDimension, closerDimension, answers, completedAt }';
comment on column public.profiles.archetype is
    'Denormalized Life Audit archetype id (overthinking_mind | distracted_seeker | purpose_explorer | disciplined_achiever | lonely_connector).';

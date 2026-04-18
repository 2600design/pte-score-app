-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  question_type text not null,
  question_text text,
  score numeric,
  completed_at timestamptz not null default now(),
  duration_seconds integer,
  transcript text,
  ai_feedback text
);

alter table public.practice_attempts enable row level security;

create policy "Users can insert their own attempts"
on public.practice_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own attempts"
on public.practice_attempts
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own attempts"
on public.practice_attempts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own attempts"
on public.practice_attempts
for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'speaking-recordings',
  'speaking-recordings',
  false,
  10485760,
  array['audio/webm', 'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/x-m4a']
)
on conflict (id) do nothing;

create table if not exists public.speaking_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_type text not null,
  question_text text,
  reference_text text,
  transcript text not null,
  audio_path text not null,
  overall_score numeric not null,
  content_score numeric,
  fluency_score numeric,
  pronunciation_score numeric,
  feedback_summary text,
  feedback_json jsonb,
  prompt_metadata jsonb,
  duration_seconds numeric,
  transcript_word_count integer,
  issue_summary text,
  created_at timestamptz not null default now()
);

create index if not exists speaking_attempts_user_created_at_idx
  on public.speaking_attempts (user_id, created_at desc);

alter table public.speaking_attempts enable row level security;

create policy "Users can view their own speaking attempts"
on public.speaking_attempts
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own speaking attempts"
on public.speaking_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own speaking attempts"
on public.speaking_attempts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own speaking attempts"
on public.speaking_attempts
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users can view their own speaking recordings"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'speaking-recordings'
  and split_part(name, '/', 1) = auth.uid()::text
);

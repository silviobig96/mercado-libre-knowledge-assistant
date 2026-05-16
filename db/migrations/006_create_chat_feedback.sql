create table if not exists chat_feedback (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sources jsonb not null default '[]'::jsonb,
  feedback text not null check (feedback in ('helpful', 'not_helpful')),
  created_at timestamp with time zone default now()
);

create index if not exists chat_feedback_created_at_idx
  on chat_feedback(created_at desc);

create index if not exists chat_feedback_feedback_idx
  on chat_feedback(feedback);

alter table chat_feedback enable row level security;

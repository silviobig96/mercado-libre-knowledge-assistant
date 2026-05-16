create table if not exists chat_queries (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sources jsonb not null default '[]'::jsonb,
  confidence_label text check (confidence_label in ('High', 'Medium', 'Low')),
  top_similarity_score double precision,
  had_fallback boolean not null default false,
  response_time_ms integer not null check (response_time_ms >= 0),
  created_at timestamp with time zone default now()
);

create index if not exists chat_queries_created_at_idx
  on chat_queries(created_at desc);

create index if not exists chat_queries_had_fallback_idx
  on chat_queries(had_fallback);

create index if not exists chat_queries_confidence_label_idx
  on chat_queries(confidence_label);

alter table chat_queries enable row level security;

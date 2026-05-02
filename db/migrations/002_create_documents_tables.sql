create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamp with time zone default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  source text not null,
  chunk_index integer not null,
  embedding vector(768),
  created_at timestamp with time zone default now()
);

create index if not exists document_chunks_document_id_idx
  on document_chunks(document_id);

create index if not exists document_chunks_embedding_idx
  on document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

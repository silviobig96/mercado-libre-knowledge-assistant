drop function if exists match_document_chunks(vector(768), integer, double precision);
drop function if exists match_document_chunks(vector(768), double precision, integer);

create or replace function match_document_chunks (
  query_embedding vector(768),
  match_threshold float default 0.25,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  source text,
  chunk_index integer,
  document_name text,
  similarity float
)
language sql
stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.source,
    dc.chunk_index,
    d.name as document_name,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  join documents d on d.id = dc.document_id
  where 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;

alter table document_chunks
  drop constraint if exists document_chunks_document_id_fkey;

alter table document_chunks
  add constraint document_chunks_document_id_fkey
  foreign key (document_id)
  references documents(id)
  on delete cascade;

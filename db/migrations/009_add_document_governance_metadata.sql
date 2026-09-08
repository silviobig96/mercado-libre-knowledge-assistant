alter table documents
  add column if not exists source_type text,
  add column if not exists country text,
  add column if not exists status text;

alter table documents
  drop constraint if exists documents_source_type_check;

alter table documents
  add constraint documents_source_type_check
  check (
    source_type is null
    or source_type in ('public-reference', 'academic-test', 'simulated-process')
  )
  not valid;

alter table documents
  validate constraint documents_source_type_check;

alter table documents
  drop constraint if exists documents_country_check;

alter table documents
  add constraint documents_country_check
  check (country is null or country = 'Argentina')
  not valid;

alter table documents
  validate constraint documents_country_check;

alter table documents
  drop constraint if exists documents_status_check;

alter table documents
  add constraint documents_status_check
  check (
    status is null
    or status in ('active', 'needs-review', 'legacy', 'inactive')
  )
  not valid;

alter table documents
  validate constraint documents_status_check;

create index if not exists documents_status_idx on documents(status);

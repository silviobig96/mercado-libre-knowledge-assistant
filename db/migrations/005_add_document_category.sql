alter table documents
  add column if not exists category text not null default 'General Policy';

update documents
set category = 'General Policy'
where category is null or trim(category) = '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'documents_category_check'
  ) then
    alter table documents
      add constraint documents_category_check
      check (
        category in (
          'Customer Service',
          'Logistics',
          'Warranties',
          'Returns',
          'Store Operations',
          'General Policy'
        )
      )
      not valid;
  end if;
end $$;

alter table documents
  validate constraint documents_category_check;

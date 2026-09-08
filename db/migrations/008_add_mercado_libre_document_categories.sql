alter table documents
  alter column category set default 'general-policy';

alter table documents
  drop constraint if exists documents_category_check;

alter table documents
  add constraint documents_category_check
  check (
    category in (
      'customer-experience',
      'mercado-envios',
      'claims-buyer-protection',
      'returns-refunds',
      'marketplace-operations',
      'general-policy',
      'Customer Service',
      'Logistics',
      'Warranties',
      'Returns',
      'Store Operations',
      'General Policy'
    )
  )
  not valid;

alter table documents
  validate constraint documents_category_check;

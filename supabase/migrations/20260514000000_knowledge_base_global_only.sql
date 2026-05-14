-- Knowledge base is global to all businesses. Remove any prior per-business scoping.

alter table knowledge_base
  drop column if exists business_id;

-- Drop both possible variants of match_knowledge_base so we can recreate the simple form.
drop function if exists match_knowledge_base(vector, float, int);
drop function if exists match_knowledge_base(vector, float, int, uuid);

create or replace function match_knowledge_base (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

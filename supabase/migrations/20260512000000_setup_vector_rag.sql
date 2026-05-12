-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create a table to store knowledge base chunks
create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  content text not null, -- The actual text content
  embedding vector(768), -- Vector embedding (768 is common for Gemini/OpenAI, adjust if needed)
  metadata jsonb default '{}'::jsonb, -- Additional metadata (source, category, etc)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for knowledge chunks by similarity
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

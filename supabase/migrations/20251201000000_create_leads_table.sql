-- Tabela de Leads para Lista de Espera
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  position text,
  source text default 'course_waitlist', -- origem do lead
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índice para evitar duplicatas de email por source
create unique index leads_email_source_idx on public.leads (email, source);

-- Habilitar RLS
alter table public.leads enable row level security;

-- Qualquer um pode inserir leads (formulário público)
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

-- Apenas admins podem ler leads
create policy "Admins can view leads"
  on public.leads for select
  using (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Apenas admins podem deletar leads
create policy "Admins can delete leads"
  on public.leads for delete
  using (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

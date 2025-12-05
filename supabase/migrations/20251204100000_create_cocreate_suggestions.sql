-- Tabela de Sugestões do Co-Create
create table if not exists public.cocreate_suggestions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text,
  company_segment text,
  email text,
  suggestion text not null,
  votes integer default 0,
  status text default 'voting' check (status in ('voting', 'development', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.cocreate_suggestions enable row level security;

-- Qualquer um pode inserir sugestões (formulário público)
create policy "Anyone can insert suggestions"
  on public.cocreate_suggestions for insert
  with check (true);

-- Qualquer um pode ler sugestões (público)
create policy "Anyone can view suggestions"
  on public.cocreate_suggestions for select
  using (true);

-- Apenas admins podem atualizar/deletar sugestões
create policy "Admins can update suggestions"
  on public.cocreate_suggestions for update
  using (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

create policy "Admins can delete suggestions"
  on public.cocreate_suggestions for delete
  using (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Tabela de Votos (para evitar votos duplicados por IP/sessão)
create table if not exists public.cocreate_votes (
  id uuid default gen_random_uuid() primary key,
  suggestion_id uuid references public.cocreate_suggestions(id) on delete cascade,
  voter_identifier text not null, -- pode ser IP hash ou session ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(suggestion_id, voter_identifier)
);

-- Habilitar RLS
alter table public.cocreate_votes enable row level security;

-- Qualquer um pode inserir votos
create policy "Anyone can insert votes"
  on public.cocreate_votes for insert
  with check (true);

-- Qualquer um pode ler votos
create policy "Anyone can view votes"
  on public.cocreate_votes for select
  using (true);

-- Inserir sugestões iniciais
insert into public.cocreate_suggestions (name, position, company_segment, suggestion, votes, status) values
  ('Comunidade Veltta', 'Comprador', 'Diversos', 'Template de plano de negociação anual', 32, 'voting'),
  ('Comunidade Veltta', 'Gerente de Compras', 'Indústria', 'Simulador de impacto no EBITDA', 54, 'development'),
  ('Comunidade Veltta', 'Analista', 'Varejo', 'Kit de onboarding para novos compradores', 0, 'completed'),
  ('Comunidade Veltta', 'Coordenador', 'Logística', 'Simulador de saving', 28, 'voting'),
  ('Comunidade Veltta', 'Comprador Sênior', 'Indústria', 'Modelo de RFP logística', 19, 'voting'),
  ('Comunidade Veltta', 'Analista', 'Serviços', 'Checklist de fornecedores', 41, 'development'),
  ('Comunidade Veltta', 'Gerente', 'Manufatura', 'Matriz Kraljic interativa', 15, 'voting');

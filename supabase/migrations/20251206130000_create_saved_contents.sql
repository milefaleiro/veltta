-- Tabela de Conteúdos Salvos (Favoritos)
create table if not exists public.saved_contents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content_id uuid references public.contents(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, content_id)
);

-- Habilitar RLS
alter table public.saved_contents enable row level security;

-- Políticas de Segurança (RLS)

-- Usuários podem ver apenas seus próprios conteúdos salvos
create policy "Users can view their own saved contents"
  on public.saved_contents for select
  using (auth.uid() = user_id);

-- Usuários podem adicionar conteúdos aos salvos (apenas para si mesmos)
create policy "Users can insert their own saved contents"
  on public.saved_contents for insert
  with check (auth.uid() = user_id);

-- Usuários podem remover conteúdos dos salvos (apenas seus próprios)
create policy "Users can delete their own saved contents"
  on public.saved_contents for delete
  using (auth.uid() = user_id);

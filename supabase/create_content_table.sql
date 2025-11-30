-- Tabela de Conteúdos
create table if not exists public.contents (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'artigo', 'video', 'ferramenta', 'podcast'
  title text not null,
  description text,
  content text, -- HTML content
  image text, -- URL da imagem de capa
  link text, -- Link externo
  video_url text, -- URL do vídeo (embed)
  download_url text, -- URL do arquivo
  download_name text, -- Nome do arquivo
  file_size text,
  file_type text,
  date date default current_date,
  read_time text,
  author text default 'Equipe Veltta',
  category text,
  tags text[], -- Array de tags
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.contents enable row level security;

-- Políticas de Segurança (RLS)

-- Qualquer um pode ler conteúdos
create policy "Public contents are viewable by everyone"
  on public.contents for select
  using (true);

-- Apenas admins podem inserir, atualizar ou deletar
-- Assumindo que o admin tem a role 'admin' no metadata ou na tabela profiles (se usada)
-- Aqui usaremos a verificação de metadata do auth.users para simplificar, 
-- mas idealmente usaria uma tabela de roles ou claims customizadas.

create policy "Admins can insert contents"
  on public.contents for insert
  with check (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

create policy "Admins can update contents"
  on public.contents for update
  using (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

create policy "Admins can delete contents"
  on public.contents for delete
  using (
    auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Storage para Imagens e Arquivos (Opcional - se for usar Supabase Storage)
-- insert into storage.buckets (id, name, public) values ('content-assets', 'content-assets', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'content-assets' );
-- create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'content-assets' AND ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin' OR auth.jwt() ->> 'email' = 'milenafaleiro@outlook.com') );

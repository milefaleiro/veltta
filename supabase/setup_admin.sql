-- Script para criar o usuário admin e definir permissões
-- Rode este script no SQL Editor do seu painel Supabase

-- 1. Habilitar a extensão pgcrypto se não estiver habilitada
create extension if not exists "pgcrypto";

-- 2. Criar o usuário na tabela auth.users (se não existir)
-- OBS: A senha deve ser fornecida pelo usuário no momento do login pela primeira vez ou via API.
-- Inserir diretamente na tabela auth.users é possível mas requer cuidado com o hash da senha.
-- A maneira mais segura é criar o usuário via painel Authentication > Users ou via código.
-- Mas podemos definir o metadado de admin aqui se o usuário já tiver sido criado.

-- Se você ainda não criou o usuário, vá em Authentication > Users e crie:
-- Email: milenafaleiro@outlook.com
-- Senha: Minhasenha7860@*

-- 3. Após criar o usuário, rode este comando para dar permissão de admin:
UPDATE auth.users
SET raw_user_meta_data = '{"role": "admin"}'
WHERE email = 'milenafaleiro@outlook.com';

-- 4. (Opcional) Se você quiser criar uma tabela de perfis para gerenciar roles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Trigger para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atualizar o perfil do admin
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'milenafaleiro@outlook.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

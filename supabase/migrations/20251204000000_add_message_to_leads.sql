-- Adicionar coluna de mensagem na tabela de leads
alter table public.leads 
add column if not exists message text;

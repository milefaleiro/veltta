-- Função RPC para incrementar votos de forma segura
-- Qualquer um pode chamar, mas só incrementa se o voto for registrado com sucesso

create or replace function public.increment_suggestion_votes(suggestion_uuid uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.cocreate_suggestions
  set votes = votes + 1
  where id = suggestion_uuid;
end;
$$;

-- Permitir que qualquer um execute a função
grant execute on function public.increment_suggestion_votes(uuid) to anon;
grant execute on function public.increment_suggestion_votes(uuid) to authenticated;

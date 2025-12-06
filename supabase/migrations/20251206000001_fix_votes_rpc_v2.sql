-- Recriar a função RPC para incrementar votos de forma robusta
-- Drop se existir e recriar

DROP FUNCTION IF EXISTS public.increment_suggestion_votes(uuid);

CREATE OR REPLACE FUNCTION public.increment_suggestion_votes(suggestion_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_votes integer;
BEGIN
    UPDATE public.cocreate_suggestions
    SET votes = COALESCE(votes, 0) + 1
    WHERE id = suggestion_uuid
    RETURNING votes INTO new_votes;
    
    RETURN json_build_object('success', true, 'new_votes', new_votes);
END;
$$;

-- Garantir permissões
GRANT EXECUTE ON FUNCTION public.increment_suggestion_votes(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_suggestion_votes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_suggestion_votes(uuid) TO service_role;

-- Também garantir que a tabela cocreate_votes tenha política de leitura para anon
DROP POLICY IF EXISTS "Anyone can insert votes" ON public.cocreate_votes;
DROP POLICY IF EXISTS "Anyone can view votes" ON public.cocreate_votes;

CREATE POLICY "Anyone can insert votes"
  ON public.cocreate_votes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes"
  ON public.cocreate_votes FOR SELECT
  TO anon, authenticated
  USING (true);

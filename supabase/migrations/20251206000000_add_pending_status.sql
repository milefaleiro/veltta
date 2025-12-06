-- Adicionar status 'pending' para sugestões aguardando aprovação
-- Atualizar a constraint de status para incluir 'pending'

ALTER TABLE public.cocreate_suggestions 
DROP CONSTRAINT IF EXISTS cocreate_suggestions_status_check;

ALTER TABLE public.cocreate_suggestions 
ADD CONSTRAINT cocreate_suggestions_status_check 
CHECK (status IN ('pending', 'voting', 'development', 'completed'));

-- Comentário explicativo
COMMENT ON COLUMN public.cocreate_suggestions.status IS 
'pending = aguardando aprovação do admin, voting = aprovada e em votação, development = em desenvolvimento, completed = concluída';

-- Script para popular o banco com os conteúdos iniciais (Mockups)
-- Rode este script no SQL Editor do Supabase APÓS criar a tabela 'contents'

INSERT INTO public.contents (type, title, description, content, image, date, read_time, category, tags, featured, author, video_url, download_url, download_name, file_size, file_type)
VALUES
(
    'artigo',
    '5 métricas de Compras que todo C-Level deveria acompanhar',
    'Descubra quais indicadores são essenciais para demonstrar o valor estratégico da área de compras para a alta gestão.',
    '<h2>Introdução</h2><p>A área de compras evoluiu de uma função operacional para um pilar estratégico das organizações. Para demonstrar esse valor, é fundamental acompanhar as métricas certas.</p><h2>1. Savings (Economia Gerada)</h2><p>O indicador mais tradicional, mas ainda relevante. Mede a diferença entre o preço de referência e o preço negociado.</p><blockquote>Dica: Vá além do saving nominal e calcule o saving realizado vs. orçamento.</blockquote><h2>2. Cost Avoidance</h2><p>Muitas vezes esquecido, o cost avoidance captura economias que não aparecem diretamente como redução de preço.</p><h2>3. Spend Under Management</h2><p>Percentual do gasto total que passa pela área de compras. Quanto maior, mais controle e oportunidade de negociação.</p><h2>4. Supplier Performance Score</h2><p>Avaliação consolidada dos fornecedores em critérios como qualidade, prazo e serviço.</p><h2>5. Time-to-Contract</h2><p>Tempo médio desde a requisição até a assinatura do contrato. Impacta diretamente a agilidade do negócio.</p><h2>Conclusão</h2><p>Essas métricas, quando bem comunicadas, transformam a percepção da área de compras perante a alta gestão.</p>',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    '2024-11-20',
    '8 min de leitura',
    'analytics',
    ARRAY['métricas', 'KPIs', 'gestão'],
    true,
    'Equipe Veltta',
    null, null, null, null, null
),
(
    'video',
    'O Futuro do Procurement: Tendências para 2025',
    'Conversamos sobre as principais tendências que vão transformar a área de compras nos próximos anos.',
    '',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',
    '2024-11-18',
    '45 min',
    'tecnologia',
    ARRAY['tendências', 'futuro', 'tecnologia'],
    true,
    'Equipe Veltta',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    null, null, null, null
),
(
    'ferramenta',
    'Planilha de Análise de Fornecedores',
    'Template completo para avaliar e comparar fornecedores com critérios ponderados. Pronto para uso.',
    '<h2>O que está incluso</h2><ul><li>Matriz de avaliação com 15 critérios</li><li>Peso customizável por critério</li><li>Gráfico radar automático</li><li>Comparativo lado a lado</li><li>Histórico de avaliações</li></ul><h2>Como usar</h2><p>1. Baixe o arquivo e abra no Excel ou Google Sheets</p><p>2. Configure os pesos dos critérios na aba "Configuração"</p><p>3. Preencha as avaliações na aba "Avaliação"</p><p>4. Veja o resultado consolidado na aba "Dashboard"</p>',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    '2024-11-22',
    null,
    'gestao',
    ARRAY['planilha', 'fornecedores', 'avaliação'],
    true,
    'Equipe Veltta',
    null,
    '/downloads/analise-fornecedores.xlsx',
    'Planilha_Analise_Fornecedores_Veltta.xlsx',
    '245 KB',
    'xlsx'
);

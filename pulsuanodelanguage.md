# Sistema de Formas (Pulsua Node Shape Language)

Este documento define o padrão técnico para uso de formas customizadas em workflows n8n, com o objetivo de padronizar a identificação visual de nós e facilitar o entendimento do fluxo por qualquer pessoa técnica ou não técnica. Este documento também serve como guia para geração automática desses workflows por IA.

---

## 1. Objetivo do Sistema de Formas

O sistema de formas estabelece um vocabulário visual consistente para representar diferentes tipos de nós em workflows automatizados. Cada forma comunica, imediatamente, a função lógica do nó no fluxo, reduzindo ambiguidade e acelerando a leitura do pipeline.

As formas são independentes do n8n (que não suporta formas nativamente) e podem ser aplicadas em:
- Ferramentas externas de documentação (Whimsical, Mermaid, Draw.io, Excalidraw)
- Sistemas internos de visualização
- Interfaces geradas por IA para documentação complementar
- Diagramas técnicos anexados a PRs e Specs

---

## 2. Princípios do Sistema de Formas

1. **Uma forma representa uma categoria funcional, não um tipo de tecnologia.**  
   Exemplo: Quadrado significa processamento, independente se o nó é Function, Code, ou IF complexo.

2. **A forma deve ser atribuída pelo propósito lógico do nó, e não pelo nome do nó no n8n.**

3. **Os diagramas gerados por IA devem manter a hierarquia de formas e seguir a nomenclatura definida aqui.**

4. **O uso de formas deve ser o mais minimalista possível, evitando iconografia ou cores que prejudiquem acessibilidade.**

---

## 3. Tabela de Formas e Significados

A seguir, a especificação oficial para cada forma suportada pelo Pulsua Node Shape Language.

### 3.1 Retângulo (Process Node)
Representa qualquer nó que processe, transforme ou execute lógica.  
Usos comuns:
- Code / Function
- Transformação de JSON
- Normalização de dados
- Avaliação de regras
- Geração de payload para APIs

O retângulo é o shape mais frequente.

**Regra:**  
Sempre que o nó produzir informação nova a partir de algo recebido, use retângulo.

---

### 3.2 Círculo (I/O Node)
Representa qualquer entrada ou saída do fluxo.  
Usos:
- Webhook In
- Trigger
- Disparo para outro sistema
- Enviar para WhatsApp
- Responder API
- Criar registro em BD (se for só Output puro)

O círculo sempre marca um ponto onde o fluxo entra ou sai do sistema.

---

### 3.3 Losango (Decision Node)
Usado exclusivamente para bifurcação lógica.  
Usos:
- IF
- Switch
- Verificações condicionais
- Qualquer lógica que produza ramos

O losango sempre implica múltiplos caminhos possíveis.

---

### 3.4 Hexágono (Integrations Node)
Representa nós que realizam chamadas externas, APIs, SDKs ou integrações.  
Usos:
- HTTP Request
- Banco externo (quando ele é chamado, e não só recebido)
- OpenAI API
- Serviços terceiros (Slack, CRMs, gateways financeiros)

A ideia do hexágono é simbolizar "parte externa ao fluxo".

---

### 3.5 Documento / Paralelogramo (Data Source)
Representa leitura de fonte de dados persistente.  
Usos:
- Consultas ao banco (SELECT)
- Leitura de arquivo
- Busca em cache
- Obter dados armazenados no próprio sistema

Não deve ser usado para escrita, apenas leitura.

---

### 3.6 Trapézio (Formatter Node)
Representa formatação, limpeza, padronização ou conversão de dados.  
Usos:
- Normalizar texto
- Converter tipos
- Remover acentos
- Regex
- Sanitização

O trapézio identifica operações onde o conteúdo é reorganizado para melhor uso posterior.

---

### 3.7 Octógono (Error/Exception Handler)
Marca nós responsáveis por captura de exceções, validações críticas ou fail-safes.  
Usos:
- Mudança de rota por erro
- Validações cruciais
- Fallbacks

---

## 4. Como Escolher a Forma Correta

### Regra principal
Identifique o papel do nó dentro do processo, não apenas o nome técnico dele no n8n.

### Guideline prático
- Ele **recebe** algo do mundo externo? → Círculo  
- Ele **decide** algo? → Losango  
- Ele **chama** algo fora do fluxo? → Hexágono  
- Ele **consulta** dado armazenado? → Documento  
- Ele **formata** dados? → Trapézio  
- Ele **trata erro**? → Octógono  
- Tudo o mais que **processa** internamente → Retângulo  

---

## 5. Padrões de Nomenclatura

Para compatibilidade com IAs, diagramas e specs técnicas use:

<forma>-<papel>-<descrição-curta>

makefile
Copiar código

Exemplos:

ret-process-normalizar-nome
hex-api-openai-transcrever-audio
los-decision-tipo-lancamento
cir-input-webhook-evolution
doc-db-select-organizacao

yaml
Copiar código

Permite parsing automático tanto por humanos quanto por LLMs.

---

## 6. Exemplos Práticos

### 6.1 Trecho de Fluxo (Desenho Conceitual)

[cir-input-webhook-evolution] →
[hex-api-openai-transcrever-audio] →
[trap-format-normalizar-texto] →
[los-decision-lancamento] →
(sim) → [hex-api-sistema-financeiro-post] →
[cir-output-confirmacao-whatsapp]
(não) → [oct-error-dado-invalido]

yaml
Copiar código

### 6.2 Comentários Técnicos

- A OpenAI é integração externa, logo hexágono.
- Normalização de texto é formatação, logo trapézio.
- Decisão condicional sempre é losango.
- Registros criados em sistema externo são I/O → círculo.

---

## 7. Requisitos para Implementação em IA

Qualquer modelo que gere workflows deverá seguir:

1. **Descrever cada nó com forma explícita**, via prefixo no nome.
2. **Gerar um documento Mermaid/Draw.io/Excalidraw** usando a forma correspondente.
3. **Gerar também uma lista tabular** contendo:
   - id do nó
   - forma
   - função
   - tipo n8n real

Exemplo de tabela:

| Node ID | Forma | Função Lógica | Nó n8n Real |
|--------|--------|----------------|-------------|
| n1 | circle | Entrada WhatsApp | Webhook |
| n2 | hexagon | Transcrição | HTTP Request (OpenAI) |
| n3 | trapezoid | Normalização | Function |
| n4 | diamond | Decisão | IF |
| n5 | hexagon | API Financeira | HTTP Request |
| n6 | circle | Saída WhatsApp | HTTP Request |

---

## 8. Padrões para Ferramentas de Desenho

### 8.1 Mermaid
As formas equivalentes devem ser mapeadas da seguinte forma:

| Forma | Mermaid equivalente |
|-------|----------------------|
| Retângulo | default |
| Círculo | (( )) |
| Losango | { } |
| Hexágono | {{{ }}} (workaround) |
| Documento | [/ ] |
| Trapézio | [/ shape=TBD /] (usar callout notation) |
| Octógono | custom path |

O gerador pode usar estilos com CSS interno do Mermaid.

---

## 9. Extensões Futuras

- Suporte a cores acessíveis (tema claro/escuro)
- Ícones vetoriais opcionais
- Conjunto de shapes adicionais:
  - Conectores especiais
  - Grupos de contexto
  - Blocos de documentação no fluxo

---

## 10. Conclusão

O Sistema de Formas (Pulsua Node Shape Language) padroniza a forma de representar workflows, permitindo que:
- Humanos entendam rapidamente a função de cada nó
- IAs gerem fluxos estruturados com semântica visual consistente
- Documentações fiquem mais legíveis
- Projetos mantenham padrões independentes da ferramenta técnica usada

Este documento serve como base oficial para toda documentação técnica, fluxos e especificações gerados dentro do ecossistema Pulsua.
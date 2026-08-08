# Pacote de execução Codex — Predator Intelligence / DATASET-002

**Projeto:** Predator News — Inteligência Jurídica  
**Versão:** 1.0  
**Data:** 08/08/2026  
**Status:** pronto para abertura da execução técnica  
**Documento-base obrigatório:** `PREDATOR_INTELLIGENCE_EXPANSAO_ACERVO_INGESTAO_JURISPRUDENCIAL.md`

---

## 1. Como utilizar este pacote

Este documento contém três entregáveis coordenados:

1. um prompt-mestre para iniciar uma nova sessão do Codex no repositório do Predator News;
2. um backlog técnico executável, dividido em incrementos e tarefas com critérios de aceite;
3. uma estrutura inicial de arquivos a ser adaptada à arquitetura real encontrada no repositório.

O prompt da seção 2 pode ser copiado integralmente para o Codex. A primeira execução deve concluir apenas o **Incremento A — Fundação operacional**, salvo autorização expressa para prosseguir.

Não fornecer credenciais do JusRatio no prompt, em arquivos versionados ou em mensagens. O acesso externo permanecerá bloqueado enquanto cota, custos e capacidade técnica da fonte não forem confirmados.

---

## 2. Prompt-mestre para o Codex

```text
Trabalhe no repositório atual do Predator News para iniciar a implementação da Predator Intelligence — Expansão de Acervo e Ingestão Jurisprudencial, ciclo DATASET-002.

FONTE DE VERDADE

1. Leia integralmente, antes de alterar qualquer arquivo:
   - AGENTS.md e instruções locais equivalentes, se existirem;
   - toda a documentação permanente relevante em /docs;
   - PREDATOR_INTELLIGENCE_EXPANSAO_ACERVO_INGESTAO_JURISPRUDENCIAL.md;
   - schemas, taxonomia, aliases, teses, fundamentos e registros jurisprudenciais atuais;
   - scripts de validação, testes e build;
   - package.json e arquivos de configuração da stack.
2. Se o documento arquitetural ainda não estiver no repositório, pare e informe a ausência. Não reconstrua suas regras por memória.
3. Preserve integralmente as decisões do ciclo EP01–EP06.1 e o comportamento público existente.

OBJETIVO DESTA EXECUÇÃO

Implementar somente o Incremento A, composto por IN01 e IN02:

- fundação operacional de ingestão;
- schemas de manifesto de lote, candidato, revisão e ledger;
- configuração externa ao código para orçamento e cache;
- fingerprint determinístico de consultas;
- ledger append-only;
- budget guard com reservas, hard stop e falha segura;
- cache local com política explícita;
- testes unitários e de integração local desses componentes.

Não implemente nesta execução:

- chamadas reais ao JusRatio;
- scraping, automação de navegador ou engenharia reversa da fonte;
- coleta de decisões;
- classificação por modelo;
- interface de revisão;
- geração de YAML canônico de decisão;
- alterações no acervo atual;
- DATASET-002 real;
- integração com o Publisher;
- mudanças de layout ou conteúdo editorial.

REGRAS INEGOCIÁVEIS

- JusRatio é origem de recuperação, não fonte jurídica canônica.
- Candidato não revisado nunca entra no diretório canônico de jurisprudência.
- Nenhuma chamada externa pode contornar o budget guard.
- Na ausência de monthly_limit, custos confiáveis ou hard_stop válido, chamadas externas ficam bloqueadas.
- Reexecuções devem ser idempotentes e não podem consumir cota novamente quando houver cache elegível.
- O ledger é append-only; ajustes usam lançamentos compensatórios.
- Dados brutos, estados operacionais e relatórios não podem entrar no build público.
- Não criar automaticamente tese, fundamento, alias, enum ou taxonomia.
- Não alterar, renumerar ou reformatar registros jurídicos atuais sem necessidade técnica demonstrada.
- Não armazenar credenciais, cookies, tokens ou cabeçalhos sensíveis.
- Não inventar API, endpoint, plano, cota ou custo do JusRatio.
- Integração com Publisher permanece desligada.

MODO DE TRABALHO

Fase 1 — inspeção somente leitura:

1. Mapeie a estrutura real do repositório.
2. Identifique linguagem, runtime, gerenciador de pacotes, convenções e comandos oficiais.
3. Localize o acervo canônico e confirme como ele é excluído ou incluído no build.
4. Localize schemas, validações e os 36 testes preexistentes citados no ciclo anterior.
5. Verifique alterações locais existentes e preserve tudo que não pertence a esta tarefa.
6. Produza um breve relatório de compatibilidade entre a estrutura proposta e a estrutura real.

Fase 2 — plano antes da edição:

1. Apresente os arquivos que pretende criar ou modificar.
2. Explique adaptações necessárias à estrutura sugerida.
3. Confirme que nenhuma chamada externa será feita.
4. Se houver decisão estrutural material não coberta pela documentação, pare e solicite decisão; não escolha silenciosamente.

Fase 3 — implementação:

1. Crie a menor fundação coerente com a stack existente.
2. Prefira módulos puros e adaptadores injetáveis.
3. Modele consumo em unidades abstratas configuráveis, sem fixar preços.
4. Garanta escrita atômica ou mecanismo equivalente para reserva/reconciliação do orçamento.
5. Faça o fingerprint a partir de representação canônica versionada, com testes para equivalência e diferença material.
6. Implemente cache semântico somente para aliases explicitamente declarados; não use equivalência inferida livremente.
7. Impeça importação acidental de artefatos de ingestion pelo gerador público.
8. Inclua configurações de exemplo sem valores operacionais reais.

Fase 4 — validação:

Execute os comandos oficiais do projeto e registre resultados. No mínimo, valide:

- lint/format, se existentes;
- testes preexistentes;
- novos testes do pipeline;
- validação de schemas;
- build completo;
- ausência de alteração nos arquivos canônicos;
- ausência de segredos;
- comportamento fail-closed com orçamento nulo;
- idempotência de fingerprint, cache e ledger;
- preservação das reservas e bloqueio no hard stop;
- artefatos de ingestão ausentes da saída pública.

TESTES MÍNIMOS NOVOS

1. duas consultas equivalentes por ordem de filtros geram o mesmo fingerprint;
2. mudança material de tribunal, data ou versão gera fingerprint diferente;
3. alias só é normalizado quando declarado;
4. cache válido evita autorização de nova unidade;
5. cache expirado exige nova autorização;
6. monthly_limit nulo bloqueia operação onerosa;
7. custo desconhecido bloqueia operação onerosa;
8. saldo insuficiente bloqueia antes da chamada ao adaptador;
9. reservas não são consumidas pela operação ordinária;
10. reconciliação registra consumo real sem apagar o lançamento inicial;
11. retry autorizado referencia a tentativa anterior;
12. repetição do mesmo comando não duplica manifesto nem corrompe o ledger;
13. arquivos intermediários não aparecem no build;
14. os testes jurídicos e páginas existentes continuam válidos.

ENTREGA

Ao final, apresente:

- resumo do que foi implementado;
- árvore dos arquivos criados e modificados;
- decisões técnicas e adaptações à arquitetura real;
- testes e build executados, com resultados;
- riscos e parâmetros ainda pendentes;
- confirmação de que nenhuma consulta ao JusRatio foi realizada;
- confirmação de que acervo, taxonomia, teses, fundamentos, Publisher e conteúdo editorial não foram alterados;
- proposta objetiva para o Incremento B, sem iniciá-lo.

Não faça commit, push, PR ou publicação sem autorização expressa. Não avance para IN03/IN04 nesta mesma execução.
```

---

## 3. Backlog técnico executável

### Visão dos incrementos

| Incremento | Escopo | Prioridade | Dependência | Saída principal |
| --- | --- | --- | --- | --- |
| A | IN01 + IN02 | P0 | arquitetura aprovada | fundação, schemas, budget, ledger e cache |
| B | IN03 + IN04 | P0 | A concluído | adaptador JusRatio e deduplicação multicamada |
| C | IN05 + IN06 | P0/P1 | B concluído | classificação assistida e revisão humana |
| D | IN07 | P0 | C concluído | geração YAML, gates e integração controlada |
| E | IN08 | P0 | D concluído + parâmetros | execução e relatório do DATASET-002 |
| F | IN09 | P2 | aceite formal do E | ponte opcional com Publisher |

### Incremento A — Fundação operacional

#### A-01 — Inventário técnico e mapa de compatibilidade

**Objetivo:** adaptar a arquitetura conceitual à estrutura real sem criar uma segunda arquitetura paralela.

**Tarefas:**

- localizar acervo, schemas, taxonomia, testes e build;
- registrar stack, convenções e comandos oficiais;
- identificar diretórios excluídos do build;
- mapear cada caminho proposto para um caminho real;
- confirmar baseline dos testes antes das alterações.

**Aceite:** relatório curto versionado; baseline reproduzível; nenhuma mutação jurídica ou editorial.

#### A-02 — Estrutura operacional isolada

**Objetivo:** criar os limites físicos e lógicos da ingestão.

**Tarefas:**

- criar diretórios de configuração, schemas, estado, lotes, cache e relatórios;
- adicionar arquivos de preservação apenas quando necessários;
- configurar exclusão de snapshots, cache e estado efêmero do Git;
- confirmar que nenhum artefato operacional entra no build.

**Aceite:** diretórios intermediários isolados do acervo e da saída pública; documentação do que é versionado e do que é efêmero.

#### A-03 — Contratos e schemas operacionais

**Objetivo:** validar os quatro documentos operacionais básicos.

**Tarefas:**

- schema do manifesto de lote;
- schema do candidato;
- schema do registro de revisão;
- schema de entrada do ledger;
- fixtures válidas e inválidas;
- comando único de validação local.

**Aceite:** schemas rejeitam estados, IDs, datas e consumos inválidos; não alteram o schema canônico de jurisprudência.

#### A-04 — Canonicalização e fingerprint de consulta

**Objetivo:** identificar reexecuções e equivalências declaradas.

**Tarefas:**

- representação canônica versionada;
- ordenação determinística de filtros;
- normalização de datas, tribunais e valores padrão;
- aliases somente a partir de configuração explícita;
- hash estável;
- testes de equivalência e distinção material.

**Aceite:** mesma intenção declarada produz mesmo hash; alteração material produz hash diferente; versão do plano participa do fingerprint.

#### A-05 — Ledger append-only

**Objetivo:** preservar a trilha de autorização, consumo e compensação.

**Tarefas:**

- eventos de reserva, confirmação, falha, estorno e compensação;
- IDs estáveis e referência a tentativa anterior;
- escrita segura contra truncamento e concorrência compatível com a stack;
- sumarização derivada sem editar eventos anteriores.

**Aceite:** nenhuma API de atualização/exclusão de evento; saldo reconstruível apenas pelo ledger; arquivo corrompido falha de modo seguro.

#### A-06 — Budget guard

**Objetivo:** tornar impossível uma operação onerosa sem autorização prévia.

**Tarefas:**

- carregar limite, hard stop, reservas e custo por operação;
- calcular saldo confirmado, reservado e disponível;
- reservar antes da execução;
- reconciliar consumo real;
- bloquear em configuração ausente, inválida ou insuficiente;
- emitir alertas configuráveis sem ultrapassar hard stop.

**Aceite:** todos os cenários fail-closed testados; reservas protegidas; adaptador externo só pode ser chamado com autorização válida.

#### A-07 — Cache e política de reexecução

**Objetivo:** reutilizar resultados elegíveis sem consumo redundante.

**Tarefas:**

- chave por fingerprint e versão;
- metadados de criação, expiração e escopo;
- distinção entre cache válido, expirado e invalidado;
- reexecução forçada com motivo;
- cache hit registrado no ledger com consumo zero.

**Aceite:** cache válido evita reserva onerosa; cache expirado não é apagado e não autoriza reutilização automática; reexecução forçada é auditável.

#### A-08 — Gate de regressão do Incremento A

**Objetivo:** demonstrar que a fundação não afeta o produto atual.

**Tarefas:**

- rodar testes anteriores e novos;
- rodar build;
- comparar acervo canônico antes/depois;
- verificar saída pública;
- executar scanner de segredos disponível no projeto;
- produzir relatório do incremento.

**Aceite:** baseline preservado; novos testes aprovados; zero consulta externa; zero alteração jurídica/editorial; build válido.

### Incremento B — Coleta em duas fases e deduplicação

#### B-01 — Contrato do adaptador JusRatio

- confirmar capacidade técnica e contratual real;
- modelar interface de listagem, paginação e detalhe sem acoplar domínio ao provedor;
- criar adaptador simulado para testes;
- exigir autorização do budget guard em toda chamada onerosa.

#### B-02 — Paginação retomável e snapshots

- persistir cursor e página concluída;
- impedir repetição silenciosa;
- separar resposta bruta de dados normalizados;
- aplicar política de retenção confirmada.

#### B-03 — Pré-deduplicação

- comparar metadados de listagem com lote e acervo;
- bloquear detalhe por chave forte já conhecida;
- enviar correspondências prováveis para revisão.

#### B-04 — Normalização e deduplicação completa

- normalizar CNJ e metadados;
- implementar chaves fortes e auxiliares;
- distinguir decisões diferentes no mesmo processo;
- executar gate final contra a versão atual do acervo.

**Gate do Incremento B:** somente adaptador simulado até cota, custos, termos e acesso serem confirmados. Uma consulta real exige autorização separada.

### Incremento C — Classificação e revisão

#### C-01 — Classificação assistida restrita

- sugerir apenas valores previstos na taxonomia vigente;
- anexar evidência, localizador e confiança por campo;
- marcar lacuna e contradição sem preenchimento inferido;
- produzir proposta separada para nova taxonomia.

#### C-02 — Avaliação da classificação

- fixtures jurídicas representativas;
- métricas por família de campo;
- registro de aceitação, edição e rejeição humana;
- limiares configuráveis usados apenas para ordenar revisão.

#### C-03 — Estação de revisão

- checklist jurídico obrigatório;
- decisões e motivos padronizados;
- edição controlada e trilha de auditoria;
- bloqueio de avanço sem revisor, data e decisão.

**Gate do Incremento C:** nenhuma aprovação automática e nenhuma mutação de taxonomia.

### Incremento D — YAML e integração controlada

#### D-01 — Transformação determinística

- converter somente candidato aprovado;
- usar schema e ordenação vigentes;
- separar proveniência operacional do YAML público;
- não gerar placeholders nem `frase_peca` ausente.

#### D-02 — Gates jurídicos e técnicos

- schema, referências, enums e unicidade;
- deduplicação contra branch atual;
- testes jurídicos e de agregação;
- build e regressão.

#### D-03 — Integração parcial segura

- integrar apenas itens independentes e aprovados;
- impedir sobrescrita de arquivo canônico;
- registrar excluídos e bloqueados;
- permitir reconstrução do vínculo candidato → revisão → decisão.

### Incremento E — DATASET-002

#### E-01 — Parametrização e dry run

- preencher cota, custos, reservas, cache, tribunais, período e fila máxima;
- validar plano de consulta sem consumo;
- estimar custo máximo do lote;
- obter autorização humana para iniciar.

#### E-02 — Execução controlada

- descobrir candidatos;
- pré-deduplicar;
- recuperar somente elegíveis;
- classificar e revisar;
- integrar apenas aprovados.

#### E-03 — Relatório e aceite

- funil completo;
- cota, cache e consultas evitadas;
- qualidade da classificação;
- falsos positivos/negativos de deduplicação;
- custo por registro integrado;
- recomendação para lote seguinte.

### Incremento F — Integração futura com Publisher

Permanece fora de escopo até nova autorização. Seu backlog só pode ser refinado depois do relatório do DATASET-002. O Publisher nunca poderá depender da disponibilidade do JusRatio para publicar a edição diária.

---

## 4. Estrutura inicial de arquivos

A árvore abaixo é uma proposta, não autorização para impô-la ao repositório. O Codex deve adaptá-la às convenções existentes e documentar o mapeamento.

```text
docs/
└── predator-intelligence/
    ├── arquitetura-ingestao.md
    ├── operacao-e-retomada.md
    └── relatorio-incremento-a.md

ingestion/
├── README.md
├── config/
│   ├── budget.example.yaml
│   ├── cache-policy.yaml
│   ├── query-aliases.yaml
│   └── query-plan.yaml
├── schemas/
│   ├── batch-manifest.schema.json
│   ├── candidate.schema.json
│   ├── ledger-entry.schema.json
│   └── review-record.schema.json
├── fixtures/
│   ├── valid/
│   └── invalid/
├── batches/
│   └── .gitkeep
├── state/
│   └── .gitkeep
├── cache/
│   └── .gitkeep
└── reports/
    └── .gitkeep

src/
└── ingestion/
    ├── config.*
    ├── query-canonicalizer.*
    ├── query-fingerprint.*
    ├── ledger.*
    ├── budget-guard.*
    ├── cache.*
    ├── errors.*
    └── index.*

tests/
└── ingestion/
    ├── query-fingerprint.test.*
    ├── ledger.test.*
    ├── budget-guard.test.*
    ├── cache.test.*
    ├── schemas.test.*
    └── build-isolation.test.*
```

### 4.1. Política de versionamento sugerida

| Caminho | Git | Build público | Observação |
| --- | --- | --- | --- |
| `ingestion/config/*.example.yaml` | sim | não | exemplos sem credenciais e sem cota real |
| `ingestion/config/query-*.yaml` | sim | não | estratégias e aliases auditáveis |
| `ingestion/schemas/` | sim | não | contratos operacionais |
| `ingestion/fixtures/` | sim | não | dados sintéticos ou devidamente minimizados |
| `ingestion/batches/*/manifest.yaml` | sim, conforme política | não | manifesto e proveniência do lote |
| `ingestion/state/` | não | não | estado retomável local/operacional |
| `ingestion/cache/` | não | não | snapshots e resultados recuperados |
| `ingestion/reports/` | seletivo | não | relatórios finais podem ser versionados |
| acervo canônico existente | sim | sim | somente após aprovação nos incrementos D/E |

### 4.2. Configuração inicial de orçamento

O exemplo deve permanecer inoperante até preenchimento consciente:

```yaml
version: 1
period: null
monthly_limit: null
hard_stop: null

operation_costs:
  search: null
  page: null
  detail: null
  full_text: null

reserve:
  manual_research: null
  retries: null
  publisher_future: null

alerts:
  warning_percent: 70
  critical_percent: 90
```

Regra: qualquer custo necessário com valor `null`, limite mensal ausente ou hard stop inválido resulta em bloqueio antes do adaptador externo.

### 4.3. Configuração inicial de aliases

```yaml
version: 1
aliases:
  rmc:
    - reserva de margem consignavel
    - reserva de margem consignável
  rcc:
    - reserva de cartao consignado
    - reserva de cartão consignado
  vicio_consentimento:
    - vicio de vontade
    - vício de vontade
    - vicio de consentimento
    - vício de consentimento
```

Esses aliases servem apenas como proposta inicial. O Codex deve confrontá-los com a taxonomia já existente, reutilizar os identificadores oficiais e não criar equivalência jurídica nova.

### 4.4. Manifesto inicial do lote

O arquivo do DATASET-002 só deve ser criado no Incremento E. Até lá, use fixture sintética:

```yaml
batch_id: fixture-dataset-002
dataset: DATASET-002
created_at: 2026-08-08T00:00:00Z
status: planned
scope:
  tribunais: []
  produtos: []
  tese_seed: null
  periodo_publicacao:
    inicio: null
    fim: null
limits:
  candidates: null
  query_units: null
  review_queue: null
query_plan_version: 1
taxonomy_version: 1
schema_version: 1
```

### 4.5. Interfaces mínimas esperadas

Os nomes devem seguir a linguagem real do projeto, mas as responsabilidades precisam permanecer separadas:

```text
canonicalizeQuery(query, plan, aliases) -> canonical representation
fingerprintQuery(canonicalQuery) -> versioned hash
lookupCache(fingerprint, policy, now) -> hit | expired | miss
authorizeOperation(operation, estimatedUnits, budgetState) -> authorization | blocked
reconcileOperation(authorization, actualUnits, status) -> ledger events
appendLedgerEvent(event) -> persisted event
summarizeLedger(events, period) -> derived budget state
```

Nenhuma função de baixo nível do adaptador JusRatio deve ficar acessível sem receber uma autorização válida emitida pelo budget guard.

---

## 5. Decisões que continuam pendentes

O Codex não deve inventar nem preencher estes valores:

1. modalidade técnica de acesso ao JusRatio;
2. plano contratado e cota mensal;
3. custo de busca, página, detalhe e inteiro teor;
4. hard stop e reservas absolutas;
5. duração do cache por tipo de consulta;
6. tribunais e intervalo temporal do lote real;
7. limite de candidatos e tamanho da fila de revisão;
8. papéis dos revisores;
9. retenção permitida de snapshots brutos.

Essas pendências não impedem o Incremento A porque o comportamento esperado é fail-closed. Elas impedem chamadas reais e a execução do Incremento E.

---

## 6. Checklist antes de abrir o Codex

- abrir o Codex apontado para o repositório local atualizado do Predator News;
- confirmar a branch de trabalho e verificar alterações locais não relacionadas;
- adicionar ao repositório o documento arquitetural, caso ainda esteja apenas fora dele;
- disponibilizar este pacote no contexto da sessão;
- colar o prompt-mestre integralmente;
- não fornecer token ou senha do JusRatio;
- autorizar apenas o Incremento A;
- revisar o plano de arquivos apresentado pelo Codex antes da implementação;
- exigir o relatório final e a confirmação de zero consultas externas.

---

## 7. Resultado esperado da primeira sessão

A primeira sessão estará concluída quando houver uma fundação local testada, inoperante por padrão para chamadas externas, integrada às convenções reais do repositório e sem qualquer alteração no acervo jurídico ou no produto editorial.

O próximo passo será revisar o relatório do Incremento A e, somente então, autorizar o desenho do adaptador e da deduplicação do Incremento B.

# Abertura Codex — Incremento E da Predator Intelligence

**Projeto:** Predator News — Predator Intelligence  
**Ciclo de dados:** DATASET-002  
**Incremento:** E — IN09 + IN10  
**Título:** Dry run parametrizado e autorização de promoção  
**Data de abertura:** 08/08/2026  
**Status:** pronto para execução técnica controlada  
**Modo:** exclusivamente local, sintético, determinístico e sem promoção real

---

## 1. Decisão de abertura

O Incremento D — IN07 + IN08 está aceito como **APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES**.

Fica autorizada a abertura do Incremento E, limitada a:

1. declarar e validar o lote sintético `DATASET-002` por manifesto parametrizado;
2. executar o pipeline A–D ponta a ponta em modo `dry_run`;
3. resolver, por decisão humana simulada e auditável, duplicidades prováveis;
4. modelar papéis, segregação de funções e eventual dupla aprovação;
5. produzir plano exato de promoção, diff final e relatório de impacto;
6. simular o fluxo Git exclusivamente em repositório descartável;
7. comprovar rollback técnico e operacional;
8. emitir relatório de prontidão `GO`, `CONDITIONAL_GO` ou `NO_GO`;
9. gerar pedido formal de autorização humana, sem concedê-la.

O Incremento E termina em **pedido formal de autorização**. Não autoriza escrita no acervo oficial, mudança de `promotion_authorized` para `true`, consulta externa, commit no repositório real, PR, publicação ou integração com o Publisher.

---

## 2. Decisões de arquitetura e governança

### 2.1 Estados que não se confundem

| Estado | Significado | Efeito operacional |
| --- | --- | --- |
| `dry_run_completed` | simulação técnica concluída | nenhum sobre o acervo |
| `ready_for_authorization` | gates técnicos e de governança satisfeitos | permite solicitar decisão humana |
| `authorization_requested` | pedido formal emitido | não autoriza promoção |
| `promotion_authorized` | autorização expressa para promoção real | permanece `false` neste ciclo |

Nenhuma combinação dos três primeiros estados implica o quarto.

### 2.2 Resultado de prontidão

- `GO`: pacote apto a ser submetido aos autorizadores, sem bloqueio conhecido;
- `CONDITIONAL_GO`: apto somente após condições explícitas e verificáveis;
- `NO_GO`: existe bloqueio técnico, jurídico, operacional ou de governança.

`GO` significa **pronto para decisão**, não promoção autorizada.

### 2.3 Fail-closed

Ausência, ambiguidade ou divergência em lote, política, versões, hashes, papéis, decisão sobre duplicidade, lista de arquivos, plano de rollback ou autorização resulta em bloqueio. Campos de governança não podem receber defaults permissivos.

### 2.4 Segregação mínima

O ciclo deve distinguir, por identidades opacas e papéis sintéticos:

- revisor jurídico;
- resolvedor de duplicidade provável;
- preparador do pacote;
- autorizador final;
- executor futuro da promoção.

Uma mesma identidade não pode preparar e autorizar o mesmo pacote. Se a política parametrizada exigir dupla aprovação, as duas decisões devem vir de identidades distintas e permanecer ausentes neste incremento.

---

## 3. Prompt-mestre para o Codex

Copie integralmente o bloco abaixo para uma nova sessão do Codex apontada para o repositório local atualizado do Predator News.

```text
Implemente exclusivamente o Incremento E — IN09 + IN10 — da Predator Intelligence, ciclo DATASET-002, no repositório atual do Predator News.

FONTES DE VERDADE

Antes de editar, leia integralmente:

1. AGENTS.md e instruções locais equivalentes;
2. documentação permanente relevante em /docs;
3. documentos arquiteturais e pacote do DATASET-002;
4. aberturas dos Incrementos B, C, D e E;
5. relatórios dos Incrementos A, B, C e D;
6. ingestion/README.md, schemas, políticas e fixtures;
7. src/ingestion/, scripts/ingestion/ e tests/ingestion/;
8. schemas jurídicos, taxonomia, aliases, decisões, teses e fundamentos, somente para leitura;
9. package.json, .gitignore, validadores, agregadores, build e configuração Git relevante.

Se faltar fonte obrigatória, pare e informe. Não reconstrua regras por memória.

BASELINE INFORMADO

- Incrementos A–D aprovados com pendências não bloqueantes;
- 97/97 testes aprovados, sendo 78 herdados e 19 do Incremento D;
- nove schemas operacionais;
- acervo válido com 10 decisões, 1 tese e 6 fundamentos;
- proposta `.proposal.json` não oficial e manifesto auditável;
- promoção simulada somente em sandbox descartável;
- `promotion_authorized: false`;
- nenhum YAML canônico oficial criado ou modificado;
- zero JusRatio, rede, serviço externo e consumo de cota;
- hashes de data/, schemas jurídicos e content/ preservados.

Confirme o baseline real e registre divergências antes de avançar.

OBJETIVO

manifesto parametrizado do DATASET-002
→ seleção sintética autorizada para dry run
→ reconciliação de versões e proveniência
→ execução ponta a ponta em dry_run
→ resolução humana simulada de duplicidades prováveis
→ verificação de segregação de funções
→ plano exato de promoção
→ diff final e relatório de impacto
→ simulação Git descartável
→ prova de rollback
→ decisão de prontidão GO/CONDITIONAL_GO/NO_GO
→ pedido formal de autorização, mantendo promotion_authorized=false.

ESCOPO AUTORIZADO

A. Manifesto declarativo do lote

- Defina contrato/schema para o manifesto do DATASET-002.
- Registre batch_id, propósito, fixture permitida, itens incluídos/excluídos, hashes, versões, política, parâmetros e identidade determinística.
- Permita somente dados sintéticos ou fonte local previamente declarada neste pacote.
- Proíba curingas, diretórios amplos, seleção implícita, arquivo fora da allowlist e mutação do manifesto após início.
- Fixe dry_run: true e promotion_authorized: false como invariantes.

B. Parâmetros operacionais externos

- Modele parâmetros em configuração versionada, validada e sem segredos.
- Inclua limites do lote, retenção simulada, TTL, política de reexecução, exigência de dupla aprovação, papéis incompatíveis e política de resolução de prováveis.
- Ausência de parâmetro obrigatório deve falhar de modo seguro.
- Não defina acesso, endpoint, credencial, preço ou cota do JusRatio.

C. Orquestração dry run A–D

- Reutilize contratos, gates e runners existentes; não crie atalho paralelo.
- Execute apenas fixtures sintéticas do manifesto.
- Reconcilie fingerprints, checkpoints, snapshots, classificação, revisão, proposta, deduplicação e sandbox.
- Registre início, etapas, resultados, hashes e encerramento.
- Interrupção e retomada não podem repetir efeito confirmado.
- O acervo oficial deve permanecer byte a byte inalterado.

D. Resolução de duplicidades prováveis

- Crie fila/decisão humana simulada para cada probable_duplicate.
- Decisões permitidas: distinct_decision, exact_duplicate, return_for_evidence e exclude_from_batch.
- Exija identidade, papel, justificativa, evidência, versão esperada e chave idempotente.
- Preserve a classificação automática original e a decisão humana separadamente.
- Sem decisão válida, o item permanece não promovível.
- Decisão distinct_decision não elimina os demais gates.

E. Matriz de segregação de funções

- Modele permissões por papel e ações incompatíveis.
- Impeça autoautorização e combinação preparador/autorizador no mesmo pacote.
- Mantenha revisor, resolvedor, preparador, autorizador e executor distinguíveis.
- Modele dupla aprovação como política; não fabrique aprovações.
- Identidades deste ciclo são opacas e sintéticas.

F. Plano exato de promoção futura

- Gere lista fechada de arquivos que seriam adicionados ou alterados.
- Para cada arquivo, registre caminho relativo validado, operação, hash anterior/novo, origem, proposta e motivo.
- Proíba deleção, renomeação ou sobrescrita fora do plano.
- Caminhos devem ficar dentro da allowlist canônica e rejeitar traversal, symlink ou colisão case-insensitive.
- O plano é declarativo, não executável contra o repositório real.

G. Diff final e impacto

- Produza diff semântico e, quando seguro, diff textual da simulação.
- Separe adições canônicas propostas, referências existentes, omissões, bloqueios e efeitos derivados de build.
- Declare contagens antes/depois, páginas afetadas, agregações e invariantes.
- Não inclua dados operacionais no conteúdo jurídico.
- Diff vazio, inesperado ou divergente do plano bloqueia prontidão.

H. Simulação do fluxo Git

- Use somente cópia ou repositório temporário descartável, sem remote e sem credenciais.
- Simule branch, aplicação do plano, validação, commit local de prova e inspeção do diff.
- Use identidade Git sintética e mensagem marcada como simulação.
- Não toque no índice, branch, HEAD, refs, hooks, worktree ou configuração do repositório real.
- Não execute push, PR, chamada GitHub ou qualquer rede.
- Remova integralmente o repositório descartável ao final, inclusive após falha.

I. Rollback futuro e prova de recuperação

- Gere plano de rollback correspondente a cada operação futura prevista.
- Registre pré-condições, ordem reversa, hashes esperados, validações pós-rollback e limites.
- Demonstre rollback apenas na simulação Git descartável.
- Falha induzida deve deixar zero resíduo e preservar o repositório real.
- Rollback não substitui backup, revisão ou autorização futura.

J. Prontidão e pedido formal

- Avalie gates técnicos, jurídicos, de segurança, governança e operação.
- Produza GO, CONDITIONAL_GO ou NO_GO com razões e condições rastreáveis.
- GO significa somente ready_for_authorization=true.
- Gere authorization-request não executável, identificando pacote, hashes, autorizadores requeridos, segregação, escopo, riscos, rollback e validade temporal.
- O pedido deve conter authorization_requested=true e promotion_authorized=false.
- Não registre assinatura, aprovação, token, aceite ou autorização fictícia.

REGRAS INEGOCIÁVEIS

- Somente dados e identidades sintéticos.
- dry_run deve permanecer true.
- promotion_authorized deve permanecer false.
- Pedido de autorização não equivale a autorização.
- Nenhuma escrita em data/ ou YAML canônico oficial.
- Nenhuma mutação de schemas jurídicos, taxonomia, aliases, teses, fundamentos ou conteúdo.
- Nenhuma inferência jurídica ou criação de frase_peca.
- Nenhuma consulta ao JusRatio, endpoint, rede, SDK, credencial ou consumo de cota.
- Nenhum commit, branch, tag, push, PR ou publicação no repositório real.
- Publisher permanece desligado.
- Nenhum artefato operacional em dist/.
- Não avançar para promoção real nem para o Incremento F.

FASE 1 — INSPEÇÃO

1. Verifique branch, status e alterações locais; preserve alterações preexistentes.
2. Confirme baseline, relatórios e 97 testes.
3. Reconcilie os 44 cenários mínimos do Incremento D.
4. Localize os contratos e gates A–D que serão orquestrados.
5. Identifique todos os caminhos canônicos potenciais sem editá-los.
6. Mapeie papéis, incompatibilidades e decisões ainda ausentes.
7. Defina matriz parâmetro → origem → validação → efeito.
8. Apresente plano curto antes de editar.

Pare diante de conflito material, fonte ausente, dado não sintético ou necessidade de relaxar gate.

FASE 2 — IMPLEMENTAÇÃO

- Reutilize funções puras e contratos existentes.
- Injete filesystem/root, relógio e identidades quando necessário.
- Separe manifesto, orquestração, resolução, autorização, plano, diff, Git e rollback.
- Use escrita atômica somente em diretórios operacionais ignorados ou temporários.
- Não instale dependência sem necessidade demonstrada.

FASE 3 — TESTES MÍNIMOS

Cubra, no mínimo:

1. manifesto exige DATASET-002 e identidade determinística;
2. dry_run=false é rejeitado;
3. promotion_authorized=true é rejeitado;
4. fixture não allowlisted é rejeitada;
5. seleção implícita, glob ou caminho amplo é rejeitado;
6. hash divergente do manifesto bloqueia;
7. mutação do manifesto durante a execução bloqueia;
8. parâmetro obrigatório ausente falha fechado;
9. parâmetro desconhecido não é aceito silenciosamente;
10. configuração não contém segredo, endpoint ou credencial;
11. pipeline reutiliza os gates A–D;
12. execução idêntica é determinística;
13. interrupção e retomada preservam idempotência;
14. alteração legítima de parâmetro muda a identidade;
15. acervo real permanece byte a byte inalterado;
16. provável duplicado sem decisão permanece bloqueado;
17. distinct_decision exige justificativa e evidência;
18. exact_duplicate permanece excluído;
19. return_for_evidence retorna sem promoção;
20. decisão repetida com mesma chave é idempotente;
21. decisão concorrente com versão obsoleta é rejeitada;
22. decisão humana preserva resultado automático original;
23. papel não autorizado não resolve provável;
24. preparador não pode autorizar o próprio pacote;
25. papéis incompatíveis são bloqueados;
26. dupla aprovação exigida não é satisfeita por uma identidade;
27. ausência de autorizador real não é preenchida por identidade sintética;
28. plano contém lista exata de arquivos;
29. arquivo fora da allowlist bloqueia;
30. path traversal, symlink e colisão de caixa bloqueiam;
31. sobrescrita não planejada é impossível;
32. hash anterior divergente bloqueia;
33. diff corresponde exatamente ao plano;
34. diff inesperado ou vazio bloqueia prontidão;
35. relatório de impacto reconcilia contagens antes/depois;
36. conteúdo proposto não contém dados operacionais;
37. simulação Git ocorre fora do repositório real;
38. repositório descartável não possui remote;
39. identidade e commit simulados são inequivocamente sintéticos;
40. branch, HEAD, índice e config reais permanecem inalterados;
41. nenhuma primitiva de push, PR ou rede é alcançável;
42. rollback reverte todas as operações simuladas;
43. rollback após falha induzida deixa zero resíduo;
44. plano de rollback corresponde um a um ao plano de promoção;
45. gate técnico falho resulta NO_GO;
46. condição pendente explícita resulta CONDITIONAL_GO;
47. gates completos podem resultar GO sem autorizar promoção;
48. ready_for_authorization não altera promotion_authorized;
49. authorization_requested não altera promotion_authorized;
50. pedido contém escopo, hashes, riscos, papéis, rollback e validade;
51. pedido não contém assinatura, aceite ou aprovação fabricada;
52. artefatos operacionais ficam fora de dist/ e do Git;
53. 97 testes herdados permanecem aprovados;
54. data/, schemas jurídicos e content/ permanecem byte a byte iguais;
55. zero JusRatio, rede, cota, Publisher e publicação.

FASE 4 — VALIDAÇÃO

Execute e registre:

- suíte integral de testes;
- validação de schemas operacionais;
- validação do acervo jurídico;
- runner do dry run parametrizado;
- build de prova somente no ambiente isolado;
- simulação Git e rollback em repositório descartável;
- git diff --check;
- comparação de hashes antes/depois;
- scanner de segredos;
- busca por primitivas de rede e comandos Git externos;
- verificação de resíduos, sandboxes e artefatos em dist/.

FASE 5 — ENCERRAMENTO

Crie docs/predator-intelligence/relatorio-incremento-e.md contendo:

1. classificação final;
2. baseline confirmado;
3. arquivos criados e alterados;
4. parâmetros e manifesto do lote;
5. matriz de papéis e segregação;
6. decisões simuladas sobre duplicidades prováveis;
7. funil completo do dry run;
8. plano exato de promoção e rollback;
9. diff e impacto;
10. resultado da simulação Git;
11. matriz dos 55 cenários;
12. validações executadas;
13. decisão GO/CONDITIONAL_GO/NO_GO;
14. pendências e riscos;
15. pedido formal de autorização separado;
16. declaração expressa de promotion_authorized=false;
17. declaração de ausência de escrita canônica, rede, commit real e publicação.

Não faça commit, push, PR ou publicação. Encerre após o relatório e o pedido formal.
```

---

## 4. Backlog fechado

| Entrega | Conteúdo | Critério de aceite |
| --- | --- | --- |
| E-00 | baseline e reconciliação A–D | 97 testes e 44 gates D reconciliados |
| E-01 | manifesto do DATASET-002 | seleção fechada, sintética e imutável |
| E-02 | política parametrizada | validação fail-closed, sem segredos |
| E-03 | orquestrador dry run | pipeline A–D reutilizado e idempotente |
| E-04 | resolução de prováveis | decisão humana simulada, versionada e auditável |
| E-05 | segregação de funções | incompatibilidades e dupla aprovação modeladas |
| E-06 | plano e diff final | arquivos, hashes, impacto e bloqueios reconciliados |
| E-07 | Git descartável | commit de prova local, sem tocar no repositório real |
| E-08 | rollback e prontidão | prova de recuperação e GO condicionalmente seguro |
| E-09 | relatório e pedido | pedido não autorizativo com `promotion_authorized: false` |

---

## 5. Estrutura inicial sugerida

```text
src/ingestion/readiness/
├── authorization-request.mjs
├── batch-manifest.mjs
├── dry-run-orchestrator.mjs
├── git-simulation.mjs
├── impact-report.mjs
├── probable-resolution.mjs
├── promotion-plan.mjs
├── readiness-gate.mjs
├── rollback-plan.mjs
└── segregation-policy.mjs

ingestion/
├── config/readiness-policy.example.yaml
├── fixtures/simulated-readiness/dataset-002.manifest.json
├── schemas/
│   ├── authorization-request.schema.json
│   ├── dataset-manifest.schema.json
│   ├── promotion-plan.schema.json
│   └── readiness-report.schema.json
├── authorization-requests/.gitkeep
├── dry-runs/.gitkeep
├── plans/.gitkeep
└── readiness-reports/.gitkeep

scripts/ingestion/run-dataset-002-dry-run.mjs
tests/ingestion/increment-e.test.mjs
docs/predator-intelligence/relatorio-incremento-e.md
```

A estrutura é orientativa. Reutilize módulos existentes quando isso preservar melhor a arquitetura.

---

## 6. Códigos mínimos de bloqueio

```text
manifest_invalid
manifest_changed
dataset_not_allowed
fixture_not_allowed
parameter_missing
parameter_invalid
input_version_stale
pipeline_gate_failed
probable_unresolved
probable_resolution_stale
role_not_allowed
segregation_violation
dual_approval_missing
authorization_missing
promotion_plan_mismatch
path_not_allowed
previous_hash_mismatch
unexpected_diff
impact_mismatch
git_isolation_failed
rollback_incomplete
canonical_write_attempt
external_operation_attempt
```

---

## 7. Gates de encerramento

O Incremento E só pode ser classificado como aprovado se:

- os testes herdados e novos estiverem aprovados;
- o lote for exclusivamente sintético e fechado pelo manifesto;
- o pipeline completo operar apenas em `dry_run`;
- duplicidades prováveis sem decisão permanecerem bloqueadas;
- papéis e incompatibilidades estiverem explicitamente modelados;
- plano, diff, impacto e rollback forem mutuamente consistentes;
- a simulação Git não tocar no repositório real;
- não houver escrita oficial, rede, cota, Publisher ou publicação;
- o pedido de autorização for auditável e não executável;
- `promotion_authorized` permanecer `false` em todos os artefatos.

Resultados possíveis:

- **APROVADO:** todos os gates do incremento atendidos; prontidão pode ser GO, CONDITIONAL_GO ou NO_GO conforme dependências externas;
- **APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES:** implementação válida, com decisões produtivas ainda pendentes;
- **REPROVADO:** qualquer violação de isolamento, autorização, integridade ou escopo.

Um `NO_GO` de promoção pode coexistir com aprovação técnica do Incremento E, desde que resulte corretamente de pendências externas e esteja documentado.

---

## 8. Pendências que permanecem fora do incremento

- acesso técnico, termos, custo e cota do JusRatio;
- política produtiva de dados pessoais e retenção;
- identidade, autenticação e permissões reais dos revisores e autorizadores;
- decisão definitiva sobre dupla aprovação;
- estratégia produtiva de IDs;
- autorização concreta para dados reais;
- autorização concreta para escrita canônica;
- branch protection, revisores reais e fluxo GitHub/PR;
- janela operacional, monitoramento e rollback produtivo;
- integração com Publisher e publicação.

Essas pendências não devem ser preenchidas por suposição. Elas condicionam o ciclo futuro de promoção real.

---

## 9. Limite final do ciclo

O Incremento E pode provar que um pacote está tecnicamente pronto para ser submetido à decisão. Não pode tomar essa decisão em nome dos autorizadores.

O estado máximo permitido é:

```json
{
  "dry_run_completed": true,
  "ready_for_authorization": true,
  "authorization_requested": true,
  "promotion_authorized": false
}
```

A primeira escrita canônica, se futuramente autorizada, deverá constituir um novo ciclo com escopo, responsáveis, arquivos e rollback expressamente aprovados.

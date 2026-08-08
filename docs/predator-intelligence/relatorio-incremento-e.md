# Relatório do Incremento E — IN09 + IN10

## 1. Classificação final

**APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES.** A implementação e o dry run sintético foram aprovados. A prontidão é **CONDITIONAL_GO**: `ready_for_authorization=true`, condicionada a dois autorizadores reais distintos e à definição da janela/controles produtivos. Em todos os artefatos, `promotion_authorized=false`.

## 2. Baseline e escopo preservado

O baseline real confirmou 97/97 testes herdados, nove schemas operacionais e acervo válido com 10 decisões, 1 tese e 6 fundamentos. Os 44 cenários do Incremento D constam aprovados no relatório D. A suíte final contém 115 testes (97 herdados + 18 testes E que agrupam os 55 cenários), e há 13 schemas operacionais.

HEAD real inicial: `f5d4056ab838ee95164fbaab66aa0e463f8037b0`, branch `main`. As alterações locais preexistentes em `scripts/build.mjs` e `src/style.css` foram preservadas. Nenhum arquivo de `data/`, `schemas/` jurídicos ou `content/` foi escrito pelo Incremento E.

## 3. Arquivos do Incremento E

- configuração: `ingestion/config/readiness-policy.example.yaml`;
- schemas: `dataset-manifest`, `promotion-plan`, `readiness-report` e `authorization-request`;
- fixture: `ingestion/fixtures/simulated-readiness/dataset-002.manifest.json`;
- diretórios ignorados: `authorization-requests`, `dry-runs`, `plans` e `readiness-reports`;
- módulos: manifesto, política, orquestração, resolução de provável, segregação, plano, impacto, Git, rollback, prontidão e pedido em `src/ingestion/readiness/`;
- runner: `scripts/ingestion/run-dataset-002-dry-run.mjs` e script npm `simulate:readiness`;
- testes: `tests/ingestion/increment-e.test.mjs` e ajuste da contagem esperada de schemas;
- documentos: este relatório e `pedido-autorizacao-dataset-002.md`;
- `.gitignore` ampliado para impedir versionamento de artefatos operacionais.

## 4. Parâmetros e manifesto

| Parâmetro | Origem | Validação | Efeito |
| --- | --- | --- | --- |
| `batch_limit=10` | política v1 | inteiro positivo obrigatório | limita lote |
| `simulated_retention_days=1` | política v1 | inteiro não negativo | limpeza simulada |
| `cache_ttl_seconds=3600` | política v1 | inteiro positivo | validade local |
| `rerun_policy=resume_confirmed` | política v1 | enum fechado | retoma sem repetir efeito |
| `dual_approval_required=true` | política v1 | boolean obrigatório | exige duas identidades reais |
| papéis incompatíveis | política v1 | pares explícitos | separa preparador/autorizador |
| `human_required` | política v1 | enum fechado | bloqueia provável não resolvido |

Manifesto `dataset-manifest-sha256-bc7f...d8592b`, parâmetros `sha256:0baf...e53c7`, fixture local allowlisted `sha256:6e98...5a62d`. Seleções implícitas, glob, traversal, diretórios e mutação após início falham fechado. `dry_run=true` e `promotion_authorized=false` são invariantes.

## 5. Papéis e resolução de provável

| Papel | Ação | Incompatibilidade |
| --- | --- | --- |
| revisor jurídico | decide campos jurídicos | não concede promoção |
| resolvedor | resolve `probable_duplicate` | não autoriza pacote |
| preparador | compõe plano | não pode autorizar o próprio pacote |
| autorizador final | decisão real futura | duas identidades reais distintas |
| executor futuro | executa ciclo posterior | não atua neste incremento |

O item `cand-probable-synthetic-001` preservou `automatic_result=probable_duplicate` e recebeu decisão humana simulada separada `distinct_decision`, versão 1, com identidade opaca, justificativa, evidência e chave idempotente. Isso não dispensou nenhum outro gate.

## 6. Funil, plano, rollback, diff e impacto

Funil: 2 itens declarados → 2 revisados → 1 provável → 1 provável resolvido → 1 proposta → 1 operação planejada → 1 commit simulado → **0 escritas canônicas**.

Plano exato: somente `add` de `data/jurisprudencia/tjce-7654321-71-2025-8-06-9999.yaml`, hash anterior `null`, hash novo `sha256:8513...da14`. Diff esperado: exatamente uma adição; diff vazio, inesperado ou sobrescrita bloqueiam. Impacto hipotético: decisões 10→11, uma página de jurisprudência e recomputação dos agregados de contagem, teses e fundamentos; taxonomia e conteúdo editorial invariáveis.

Rollback `rollback-sha256-92cc...9f14`: verificar hash novo, remover somente o arquivo adicionado, validar árvore limpa e ausência do caminho. Executado apenas na cópia descartável; não substitui backup ou autorização.

## 7. Simulação Git

Repositório temporário fora do Git real, branch `simulated/dataset-002`, zero remotes, autor `Predator Synthetic Simulation <synthetic@example.invalid>` e commit `SIMULATION ONLY: DATASET-002 dry run`. A simulação e a falha induzida terminaram com zero resíduo. Não houve push, PR, hook, credencial ou rede.

## 8. Matriz dos 55 cenários

Todos aprovados. Cobertura agrupada nos 18 testes E:

| Cenários | Resultado | Evidência principal |
| --- | --- | --- |
| 1–7 | aprovado | manifesto determinístico, invariantes, allowlist e hashes |
| 8–10 | aprovado | política fail-closed e scanner de configuração |
| 11–15 | aprovado | sete gates A–D, determinismo, retomada e imutabilidade |
| 16–23 | aprovado | resolução humana versionada, idempotente e segregada |
| 24–27 | aprovado | matriz de papéis e dupla aprovação real não fabricada |
| 28–36 | aprovado | plano fechado, paths, hashes, diff e impacto |
| 37–44 | aprovado | Git descartável e rollback um a um, inclusive em falha |
| 45–51 | aprovado | NO_GO/CONDITIONAL_GO/GO e pedido não autorizativo |
| 52–55 | aprovado | exclusão do build/Git, regressão, hashes e zero externo |

## 9. Validações

- `npm test`: 115/115;
- `npm run validate:ingestion`: 13 schemas;
- `npm run validate:data`: 10 decisões, 1 tese, 6 fundamentos;
- `npm run simulate:readiness`: sete etapas completas, sandbox validado/buildado, Git simulado e resíduo zero;
- `git diff --check`;
- inspeção de hashes e diferenças em `data/`, `schemas/` e `content/`;
- scanner de segredos e busca por primitivas externas;
- inspeção de `dist/`, sandboxes e dry-runs.

## 10. Pendências, riscos e decisão

Permanecem fora do incremento: autorizadores reais, autenticação e permissões, decisão produtiva sobre dupla aprovação, proteção de branch/PR, estratégia produtiva de IDs, janela operacional, backup, monitoramento, dados reais, JusRatio, Publisher e publicação. Portanto, a decisão é **CONDITIONAL_GO somente para solicitar autorização**.

O pedido separado está em `docs/predator-intelligence/pedido-autorizacao-dataset-002.md`. Não houve escrita canônica, inferência jurídica, `frase_peca`, JusRatio, rede, cota, commit/branch/tag real, push, PR, Publisher ou publicação. `promotion_authorized=false`.

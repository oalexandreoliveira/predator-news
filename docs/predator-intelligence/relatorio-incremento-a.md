# Relatório do Incremento A

## Compatibilidade

O repositório usa Node.js em módulos ES, `node:test`, JSON Schema Draft 2020-12 com Ajv, YAML e gerador estático próprio. A ingestão foi isolada em `ingestion/`; contratos operacionais não foram misturados aos schemas jurídicos em `schemas/`, nem candidatos ao acervo em `data/jurisprudencia/`.

O build seleciona explicitamente conteúdo editorial, dados canônicos e assets. Não percorre `ingestion/`; um teste de regressão garante que artefatos operacionais não apareçam em `dist/`.

## Fundação

- Configurações externas e inoperantes por padrão para orçamento, cache, aliases e plano.
- Fingerprint SHA-256 sobre representação canônica versionada e aliases declarados.
- Cache com estados `hit`, `expired`, `invalidated` e `miss`.
- Ledger JSONL append-only, lock exclusivo e sincronização em disco; resumos são derivados.
- Budget guard fail-closed, com reservas protegidas, hard stop, autorização anterior ao adaptador e reconciliação por novos eventos.
- Manifesto criado atomicamente e idempotente.
- Quatro schemas operacionais separados do contrato jurídico.

## Limites

Não existe adaptador JusRatio, coleta, classificação, revisão, geração de YAML canônico ou integração com Publisher. Cota, custos, TTL operacional, retenção e escopo do lote real continuam nulos ou pendentes. O limite operacional ainda não está configurado; o mecanismo de hard stop já existe e permanece fail-closed.

## Matriz dos 14 cenários mínimos

| # | Cenário | Cobertura |
|---|---|---|
| 1 | Ordem dos filtros não altera fingerprint | `pipeline.test.mjs` — ordem de filtros não muda fingerprint |
| 2 | Tribunal, data ou versão alteram fingerprint | `pipeline.test.mjs` — tribunal, data e versão são materiais |
| 3 | Alias somente quando declarado | `pipeline.test.mjs` — somente alias declarado é normalizado |
| 4 | Cache válido evita nova unidade | `pipeline.test.mjs` — cache válido evita adaptador |
| 5 | Cache expirado exige autorização | Mesmo teste do cenário 4 |
| 6 | `monthly_limit` nulo bloqueia | `pipeline.test.mjs` — budget guard falha fechado |
| 7 | Custo desconhecido bloqueia | Mesmo teste do cenário 6 |
| 8 | Saldo insuficiente bloqueia antes do adaptador | Mesmo teste do cenário 6 |
| 9 | Reserva operacional é protegida | `pipeline.test.mjs` — reservas ficam protegidas e hard stop bloqueia |
| 10 | Reconciliação preserva lançamento inicial | `pipeline.test.mjs` — reconciliação acrescenta evento |
| 11 | Retry referencia tentativa anterior | `pipeline.test.mjs` — retry autorizado referencia tentativa anterior |
| 12 | Repetição não duplica manifesto nem corrompe ledger | Testes de manifesto idempotente e ledger append-only em `pipeline.test.mjs` |
| 13 | Intermediários ausentes do build | `schemas-and-build.test.mjs` — build não contém artefatos de ingestão |
| 14 | Regressão jurídica e páginas existentes | 36 testes preexistentes, executados pelo mesmo `npm test` |

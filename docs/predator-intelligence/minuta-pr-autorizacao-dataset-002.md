# Minuta — Autorizar uma tentativa de promoção local do DATASET-002

> Esta minuta não é autorização e não está aprovada. Deve ser preenchida e o PR protegido deve ser criado externamente por `oalexandreoliveira`, somente após a baseline A–F/governança estar incorporada à `main`.

## Pacote de uso único

- Dataset: `DATASET-002`
- HEAD da `main`: `[NOVA HEAD APÓS MERGE]`
- Package digest e versão: `[RECALCULAR]`
- Hashes de manifesto, proposta, plano, rollback, índice, taxonomia, schema e política: `[RECALCULAR]`
- Arquivos canônicos autorizados: `[LISTA FECHADA]`
- Parecer técnico consultivo: `[LINK/HASH PENDENTE]`
- Ressalvas: `[PREENCHER]`
- Ciência expressa sobre ressalvas: `[OBRIGATÓRIA SE HOUVER]`

## Checklist A–F

- [ ] Gates A–F em `GO` (não `CONDITIONAL_GO`)
- [ ] PR criado por `oalexandreoliveira`, base `main`, proteção verificada
- [ ] Pacote, hashes e arquivos conferidos
- [ ] Parecer humano consultivo anexado
- [ ] Revogação e rollback confirmados
- [ ] Autorização ainda não consumida

## Capacidades

- `canonical_write_local=true`
- `commit_local=true`
- `push=false`
- `open_pr_by_executor=false`
- `merge=false`
- `publisher=false`
- `deploy=false`
- `publish=false`

A criação deste PR protegido pela conta cadastrada constitui o evento externo de autorização para uma única tentativa. Revogação antes da escrita bloqueia; após escrita ou commit exige rollback. Qualquer falha após o início exige rollback automático. Promoção parcial é proibida.

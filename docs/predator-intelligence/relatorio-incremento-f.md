# Relatório do Incremento F — IN11 + IN12

## 1. Classificação e autoridade

**Classificação técnica: APROVADO — encerramento bloqueado seguro.**  
**Decisão de autoridade: NO_GO (`authorization_missing`).**

O pedido do Incremento E não é autorização. Nenhum artefato externo de autorização final foi encontrado em `ingestion/authorization-requests/`, único local operacional declarado. O projeto não possui mecanismo produtivo aprovado de identidade/autenticidade; mesmo um documento ali presente seria bloqueado como `authorization_authenticity_unverifiable` até esse mecanismo existir. Nenhuma escrita canônica foi iniciada.

## 2. Baseline confirmado

- HEAD `f5d4056ab838ee95164fbaab66aa0e463f8037b0`, branch `main`, índice vazio;
- alterações locais preexistentes, inclusive `scripts/build.mjs` e `src/style.css`, preservadas;
- 115/115 testes herdados no início;
- 13 schemas operacionais no início;
- acervo: 10 decisões, 1 tese e 6 fundamentos;
- 55 cenários do Incremento E reconciliados como aprovados;
- `CONDITIONAL_GO`, `authorization_requested=true` e `promotion_authorized=false` herdados corretamente.

## 3. Contrato, capacidades e segregação

O schema de autorização final exige IDs, dataset, package digest, hashes de manifesto/proposta/plano/rollback/índice/taxonomia/schema/política, emissão, expiração, revogação, autorizadores, decisões, capacidades e arquivos fechados. Ausência, `deny`, expiração, revogação, identidade sintética ou autenticidade não verificável falham fechado.

| Papel | Pode | Não pode |
| --- | --- | --- |
| preparador | congelar pacote | autorizar o próprio pacote |
| autorizadores reais 1/2 | decidir sobre o mesmo digest | compartilhar identidade ou ser sintético |
| executor | aplicar plano autorizado | completar autorização |
| verificador | validar resultado | ampliar escopo |

Capacidades finais: `validate_authorization=permitida`; `write_canonical_local=negada`; `commit_local`, `push_remote`, `open_pr`, `merge`, `publish` e Publisher=`negadas`.

## 4. Pacote congelado e preflight

O runner recalcula hashes dos bytes atuais de manifesto, proposta sintética, política e pedido E, gerando digest determinístico; timestamps ficam fora da identidade. Como a autoridade é `NO_GO`, o preflight transacional não é executável e a deduplicação final não pode habilitar escrita. O único alvo hipotético permanece `data/jurisprudencia/tjce-7654321-71-2025-8-06-9999.yaml`; a lista de operações reais é vazia.

## 5. Journal, receipt e rollback

Nenhum journal ou pre-image real foi criado porque não houve autorização nem início de transação. Foi emitido em memória receipt determinístico `blocked`, sem declarar promoção. Em testes sintéticos temporários, o journal precede a escrita, adições registram inexistência, a troca é atômica, e falhas induzidas de escrita/schema/dados/testes/build/diff removem apenas a adição da transação, preservando arquivos alheios. Rollback incompleto é modelado como `incident`.

## 6. Matriz dos 70 cenários

| Cenários | Resultado | Evidência |
| --- | --- | --- |
| 1–7 | aprovado | pedido/ausência/deny/tempo/revogação/autenticidade/sintético |
| 8–12 | aprovado | dupla aprovação, identidades, segregação e digest comum |
| 13–17 | aprovado | interseção de capacidades e negação de Git/Publisher |
| 18–24 | aprovado | dataset e hashes congelados; alteração invalida pacote |
| 25–29 | aprovado | GO estrito, provável, baseline, worktree, branch/HEAD |
| 30–42 | aprovado | plano/path/symlink/caixa/hash/pre-image/journal/atômico/conteúdo |
| 43–52 | aprovado | falhas induzidas, rollback seletivo e estado incident |
| 53–61 | aprovado | sucesso tardio, receipts, idempotência, lock e concorrência |
| 62–70 | aprovado | isolamento de YAML/dist/Git/acervo/rede/Publisher |

Os 70 cenários são cobertos por testes agrupados, combinando casos explícitos do Incremento F com as garantias herdadas A–E de path, symlink, colisão case-insensitive, deduplicação, Git e build.

## 7. Arquivos alterados pelo Incremento F

- três schemas operacionais, política e duas fixtures sintéticas;
- módulos de autorização, capacidade, congelamento, preflight, transação, lock e receipt;
- runner `run-controlled-promotion.mjs`;
- teste `increment-f.test.mjs` e contagem de schemas atualizada para 16;
- diretórios ignorados para journals, pre-images e receipts;
- `.gitignore`, `package.json`, exportações e este relatório.

**Arquivos canônicos efetivamente alterados: nenhum.** Schemas jurídicos, taxonomia, aliases, teses, fundamentos e conteúdo editorial permaneceram inalterados.

## 8. Validações e estado final

Executados: suíte integral **127/127**, validação dos **16 schemas operacionais**, `validate:data` com 10 decisões/1 tese/6 fundamentos, runner bloqueado, transações/falhas sintéticas em temporários, rollback, `git diff --check`, scanner de segredos/operações externas e inspeção de resíduos em `dist/`.

```json
{
  "authorization_validated": false,
  "promotion_authorized": false,
  "promotion_started": false,
  "canonical_write_completed": false,
  "promotion_result": "blocked",
  "decision": "NO_GO",
  "git_operation_authorized": false,
  "publication_authorized": false
}
```

Pendências: mecanismo externo aprovado de autenticidade, duas identidades reais, autorização vigente vinculada aos hashes finais, janela operacional, responsável por recuperação e política produtiva de pre-images. Não houve Git real, rede, JusRatio, cota, SDK, Publisher, deploy, PR ou publicação.

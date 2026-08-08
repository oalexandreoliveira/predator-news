# Relatório de consolidação da baseline A–F e governança DATASET-002

## Resultado

Baseline preparada em branch local para revisão externa. A promoção continua **NO_GO** por `authorization_pr_missing` e porque a revisão técnica humana está pendente. Este commit de infraestrutura/governança não é autorização do dataset.

## Baseline inicial

- repositório: `oalexandreoliveira/predator-news`;
- branch: `main`;
- HEAD: `f5d4056ab838ee95164fbaab66aa0e463f8037b0`;
- índice inicial vazio; implementação A–F presente apenas no working tree;
- 127 testes e 16 schemas operacionais;
- alterações visuais preexistentes em `scripts/build.mjs` e `src/style.css`.

## Matriz de classificação

| Arquivos | Origem/incremento | Motivo e impacto | Decisão |
| --- | --- | --- | --- |
| `ingestion/**` | A–F | contratos, políticas, schemas, fixtures e isolamento operacional | incluir |
| `src/ingestion/**` | A–F | implementação integral do pipeline e promoção controlada | incluir |
| `scripts/ingestion/**`, `scripts/test.mjs` | A–F | runners e suíte determinística | incluir |
| `tests/ingestion/**` | A–F/governança | regressão e gates | incluir |
| documentação A–F e pacote arquitetural | A–F | fontes e auditabilidade | incluir |
| `.gitignore`, `package.json` | dependência A–F | exclusão de artefatos e comandos reproduzíveis | incluir |
| cadastro, schema/validador PR, modelos e este relatório | governança consolidada | habilita futura autorização verificável | incluir |
| `scripts/build.mjs`, `src/style.css` | mudança visual preexistente | redesign editorial não indispensável à ingestão | excluir e preservar no working tree |
| `data/**`, schemas jurídicos, taxonomia, aliases e `content/**` | acervo/editorial | nenhuma mudança autorizada | excluir e preservar |

Nenhum arquivo de origem indeterminada foi incluído.

## Governança consolidada

- autorizador humano único: GitHub `oalexandreoliveira`;
- cadastro: `ingestion/config/dataset-002-authorizers.yaml`;
- escopo: primeira promoção do `DATASET-002`, status ativo;
- PR protegido externo, criado pela conta cadastrada, repositório esperado e base `main`;
- evidência externa injetável, sem rede e sem fabricar PR;
- parecer humano obrigatório e consultivo; revisor sem veto;
- ressalvas exigem ciência expressa do autorizador;
- autorização de uso único, revogável e vinculada a pacote/hashes/arquivos;
- `canonical_write_local` e `commit_local` independentes;
- push, PR pelo executor, merge, Publisher, deploy e publicação negados;
- `CONDITIONAL_GO` e branch diferente de `main` não habilitam promoção;
- falha/revogação após escrita ou commit exige rollback; estado parcial é proibido.

O cadastro nominal, isoladamente, não altera `authorization_validated` nem `promotion_authorized`.

## Congelamento

Antes da remediação, o runner F congelava quatro artefatos e produzia package digest `sha256:ea5e97c6bf4548170233197cd702b2d5deca95b88547ba65150ab81b8d6631da`. A política de readiness tinha hash `sha256:15402901ea725e228f393dbe447730075924bc6d43ddf5257a8f5d31b9b78420`.

Após a remediação, o pacote inclui também política de execução, cadastro, schema autorizativo e modelo de parecer:

| Artefato | Hash novo |
| --- | --- |
| manifesto | `sha256:c333fe912ffe3045c5440fab10b05d513aa889dc6152fb4ce1e10ded458108a4` |
| proposta sintética | `sha256:6f51f5d7fd589d0c8dd2427f8cbf5bcb71a2ae070a36442d1ba3004cde890221` |
| política readiness | `sha256:ed721562f29029609307eff99ebbab804cf203916eec979f84cc5f4c1e44d5c5` |
| política execução | `sha256:15fcb8bb426088213bb7f98763588b38213a2b5b816b6ac1236c22121eeea06d` |
| cadastro | `sha256:0e75c49a775b55c72e725a56d614eb0b7efe4949d389b6456bbf6b6449ecf90a` |
| schema autorização | `sha256:b58e101053f8e458be545fafc8e0e9a190f439a3b7eaf7847dfa13d9051c3c28` |
| modelo de parecer | `sha256:cbfadc85bdfb232d8add3c8f1e7ff0293a301b152fed7ecc40d8952bb768cfb6` |
| pedido E | `sha256:ca675e44421dd73c06d8a46c9559918692787fb4f27f56bd8c0be929af929dcb` |

Package digest provisório: `sha256:68dbeabea30421f91ccc6a2615cc51d9c2c85600ea371d3a3ee5e2528c9e9fef`. Ele serve apenas à preparação; deverá ser recalculado depois do merge na `main`. Qualquer autorização sobre o HEAD antigo está invalidada.

## Documentos pendentes

- modelo consultivo: `docs/predator-intelligence/modelo-parecer-tecnico-dataset-002.md`;
- minuta externa: `docs/predator-intelligence/minuta-pr-autorizacao-dataset-002.md`.

Nenhuma identidade de revisor, parecer, ciência ou autorização foi fabricada. `technical_review_completed=false` e isso bloqueia a futura execução.

## Validação

- antes: 127/127 testes; depois: 129/129;
- 16 schemas operacionais válidos;
- acervo válido: 10 decisões, 1 tese e 6 fundamentos;
- build local aprovado;
- runner controlado: `blocked / NO_GO / authorization_pr_missing`;
- nenhum YAML canônico criado; taxonomia, schemas jurídicos e conteúdo editorial inalterados;
- nenhuma rede, JusRatio, push, PR, merge, Publisher, deploy ou publicação.

## Estado e próximo ato

```json
{
  "baseline_consolidation_prepared": true,
  "increments_a_f_complete": true,
  "single_authorizer_governance_implemented": true,
  "authorizer_registered": true,
  "protected_pr_contract_implemented": true,
  "authorization_pr_found": false,
  "authorization_validated": false,
  "promotion_authorized": false,
  "promotion_started": false,
  "canonical_write_completed": false,
  "technical_review_completed": false,
  "blocking_next_execution": true,
  "decision": "NO_GO",
  "reason": "baseline_not_yet_merged_to_main"
}
```

Próximo ato manual: revisar esta branch e seu diff, submetê-la externamente como PR de infraestrutura/governança e incorporá-la à `main`. Depois confirmar a nova HEAD, recalcular hashes, obter parecer humano e somente então criar um segundo PR protegido de autorização do dataset.

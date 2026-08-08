# Prévia técnica do pacote autorizativo DATASET-002 após remediação

> Documento técnico provisório. Não constitui parecer humano, ciência, autorização ou pacote definitivo.

## Referência e validade

- baseline remota confirmada: `main` em `4cc2bac3e79eebfc4cd1ce9b89f334f8f1cbe671`;
- branch técnica: `fix/intelligence-authorization-readiness`;
- commit de remediação: pendente nesta prévia;
- validade dos hashes: provisória até a remediação ser revisada e incorporada à `main`;
- qualquer alteração ou incorporação que produza nova HEAD torna estes hashes obsoletos e exige novo congelamento integral.

## Escopo fechado candidato do DATASET-002

| Operação futura | Arquivo candidato | Hash esperado |
| --- | --- | --- |
| `add` | `data/jurisprudencia/tjce-7654321-71-2025-8-06-9999.yaml` | `sha256:851359bebd8d09688ec3f7ced57c37d352d2e275b2bb7c495aef943b93dbda14` |

Não há sobrescrita, conteúdo editorial, taxonomia, tese ou fundamento no escopo candidato.

## Congelamento técnico provisório

| Artefato | Hash |
| --- | --- |
| pacote provisório | `sha256:7718ffe02e41b5c41f00202d459c76a6250bf1ba3ea0db0ca1cd38875ba67441` |
| manifesto congelado | `sha256:6ab6cdb9c6c15d6116ebfdba23050baefd72fc74dfbb5d00d743c2fe36fe65c7` |
| proposta congelada | `sha256:d317423eedb351e8ae32b24d88052c78f8d382b49d120590b0f57d0f86b91978` |
| política de readiness | `sha256:a740b33a522909a0f33ff4d1876fef4964aaef77dc9643b8ccb0980ede5c5a23` |
| política de execução | `sha256:25531f4eecc46a8e6ab685b18c83d22099653849fec5a0e8fed92d83bd88c490` |
| cadastro do autorizador | `sha256:0430dfaec26eb3ba9f3f37b19a9bec22a8ea2b43a3f4299a3c4855d0ed4b8b45` |
| schema de autorização final | `sha256:8233ef767b2408c403a377d3a7d09da32fb2510b687eea2effc7e2f093ddb8b0` |
| modelo de parecer técnico | `sha256:472b3489b8f34b0c92c7e9b1f09e9c5121deb252e20c2ac2b988905f533d2606` |
| pedido de autorização alinhado | `sha256:d80f3f7769927d0d784d3cd2a8aa0247e439298bbbbfeed723c11e837be7c27a` |

Plano: `plan-sha256-cecef7ff06db4bea6179e1443ee5f877274865965fa6b04fb3aa942695714dd4`.

Rollback: `rollback-sha256-92cce6e8afebc503cfb6af5bbe9fb42d073fc1aaded093cd25d38a0a2df49f14`.

## Schemas e validações

- 16 schemas operacionais compilados, com fixtures positivas e negativas confirmadas;
- schema de readiness limitado a `GO` e `NO_GO`;
- build limpo aprovado antes da suíte;
- suíte integral: 129/129;
- acervo preservado: 10 decisões, 1 tese e 6 fundamentos;
- readiness sintético: `NO_GO`, com `promotion_authorized=false`;
- condições pendentes: autorizador real, janela produtiva, parecer técnico humano e PR protegido;
- runner controlado: `NO_GO / authorization_pr_missing`;
- escritas canônicas, operações Git de promoção e operações externas: zero.

## Governança aplicável

- único autorizador humano cadastrado: `oalexandreoliveira`;
- evidência obrigatória: PR protegido, criado pela conta cadastrada, com base `main`;
- parecer técnico humano: obrigatório e consultivo, ainda ausente;
- ressalvas: exigem ciência expressa do autorizador antes do próximo gate;
- autorização: uso único e vinculada à HEAD, pacote, hashes e lista fechada de arquivos;
- `canonical_write_local` e `commit_local`: capacidades independentes;
- push, abertura de PR pelo executor, merge, Publisher, deploy e publicação: não concedidos.

## Riscos e ressalvas para revisão humana

1. A remediação ainda não foi incorporada à `main`; todos os hashes são provisórios.
2. A janela operacional definitiva ainda não foi definida.
3. O parecer técnico humano e eventual ciência sobre ressalvas não existem.
4. O PR autorizativo protegido não existe e não pode ser criado pelo executor.
5. Os dados usados nos runners permanecem sintéticos; nenhuma promoção foi iniciada.

## Minuta para revisão humana

Usar `docs/predator-intelligence/minuta-pr-autorizacao-dataset-002.md` somente depois de:

1. incorporar a remediação à `main`;
2. confirmar a nova HEAD remota;
3. recalcular todos os hashes e o package digest;
4. obter o parecer técnico humano;
5. registrar ciência expressa sobre ressalvas, quando houver.

Decisão desta prévia: `NO_GO / remediation_not_merged_to_main`.

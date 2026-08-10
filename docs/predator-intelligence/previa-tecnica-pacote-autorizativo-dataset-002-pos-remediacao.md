# Candidato definitivo do pacote autorizativo DATASET-002 após remediação

> Registro técnico para revisão humana. Não constitui parecer humano, ciência, autorização, promoção ou publicação.

## Baseline e evidência remota

- repositório: `oalexandreoliveira/predator-news`;
- HEAD confirmada de `origin/main`: `d4a3fe18f7d35ea78a44ec390d7e2b748849ad20`;
- PR técnico incorporado: `#2`;
- método: merge commit;
- merge commit: `1a07c9ffc8d21d92391da7cc62fcf67c15865f59`;
- commits de remediação ancestrais da HEAD: `d10df5d093214280839bb491faa4cc1b647979ac` e `9f7a8d621dd7051620cebd2484c16a774dbcb374`;
- workflow aprovado: `Publicar no GitHub Pages`, run `31386748649`;
- URL: `https://github.com/oalexandreoliveira/predator-news/actions/runs/31386748649`;
- commit testado: `d4a3fe18f7d35ea78a44ec390d7e2b748849ad20`;
- job `build-and-deploy`: concluído com sucesso, incluindo a ordem efetiva build → testes, upload e deploy;
- GitHub Pages: disponível em `https://oalexandreoliveira.github.io/predator-news/`.

Todos os valores abaixo foram recalculados exclusivamente sobre os bytes versionados nessa HEAD da `main`. Nenhum hash provisório calculado sobre `d10df5d` foi reutilizado.

## Escopo canônico candidato

| Operação futura | Arquivo candidato | Hash esperado |
| --- | --- | --- |
| `add` | `data/jurisprudencia/tjce-7654321-71-2025-8-06-9999.yaml` | `sha256:851359bebd8d09688ec3f7ced57c37d352d2e275b2bb7c495aef943b93dbda14` |

Plano: `plan-sha256-cecef7ff06db4bea6179e1443ee5f877274865965fa6b04fb3aa942695714dd4`.

Rollback: `rollback-sha256-92cce6e8afebc503cfb6af5bbe9fb42d073fc1aaded093cd25d38a0a2df49f14`.

Não há sobrescrita, edição, taxonomia, tese, fundamento ou outro conteúdo jurídico ou editorial no escopo candidato.

## Conjunto autenticado

| Nome lógico | Blob da HEAD da `main` | SHA-256 |
| --- | --- | --- |
| `manifest` | `ingestion/fixtures/simulated-readiness/dataset-002.manifest.json` | `sha256:6ab6cdb9c6c15d6116ebfdba23050baefd72fc74dfbb5d00d743c2fe36fe65c7` |
| `proposal` | `ingestion/fixtures/simulated-promotion/eligible.reviewed.json` | `sha256:d317423eedb351e8ae32b24d88052c78f8d382b49d120590b0f57d0f86b91978` |
| `readiness_policy` | `ingestion/config/readiness-policy.example.yaml` | `sha256:c5bb582e14e81260012485d0e244ad21c040ffc3a3fdd9be80399bcce4f7d287` |
| `execution_policy` | `ingestion/config/promotion-execution-policy.example.yaml` | `sha256:25531f4eecc46a8e6ab685b18c83d22099653849fec5a0e8fed92d83bd88c490` |
| `authorizer_registry` | `ingestion/config/dataset-002-authorizers.yaml` | `sha256:0430dfaec26eb3ba9f3f37b19a9bec22a8ea2b43a3f4299a3c4855d0ed4b8b45` |
| `authorization_schema` | `ingestion/schemas/final-authorization.schema.json` | `sha256:8233ef767b2408c403a377d3a7d09da32fb2510b687eea2effc7e2f093ddb8b0` |
| `technical_review_template` | `docs/predator-intelligence/modelo-parecer-tecnico-dataset-002.md` | `sha256:472b3489b8f34b0c92c7e9b1f09e9c5121deb252e20c2ac2b988905f533d2606` |
| `request` | `docs/predator-intelligence/pedido-autorizacao-dataset-002.md` | `sha256:f11d26fbe8e3d53410447ae2535883b1f6a878c96f03817bd7ff9f48a7db8f1b` |

Package digest:

`sha256:34ef5b3e8efb42b57358f70a4194c63efe9c9297dc6c0b0f82bf9d5dcb453d30`

## Fórmula determinística

1. Calcular SHA-256 dos bytes exatos de cada um dos oito blobs e prefixar o hexadecimal minúsculo com `sha256:`.
2. Construir o objeto que associa os oito nomes lógicos aos hashes.
3. Ordenar as chaves lexicograficamente.
4. Serializar como JSON compacto UTF-8, sem BOM e sem espaços adicionais.
5. Calcular SHA-256 desses bytes serializados e prefixar o resultado com `sha256:`.

Representação canônica usada:

```json
{"authorization_schema":"sha256:8233ef767b2408c403a377d3a7d09da32fb2510b687eea2effc7e2f093ddb8b0","authorizer_registry":"sha256:0430dfaec26eb3ba9f3f37b19a9bec22a8ea2b43a3f4299a3c4855d0ed4b8b45","execution_policy":"sha256:25531f4eecc46a8e6ab685b18c83d22099653849fec5a0e8fed92d83bd88c490","manifest":"sha256:6ab6cdb9c6c15d6116ebfdba23050baefd72fc74dfbb5d00d743c2fe36fe65c7","proposal":"sha256:d317423eedb351e8ae32b24d88052c78f8d382b49d120590b0f57d0f86b91978","readiness_policy":"sha256:c5bb582e14e81260012485d0e244ad21c040ffc3a3fdd9be80399bcce4f7d287","request":"sha256:f11d26fbe8e3d53410447ae2535883b1f6a878c96f03817bd7ff9f48a7db8f1b","technical_review_template":"sha256:472b3489b8f34b0c92c7e9b1f09e9c5121deb252e20c2ac2b988905f533d2606"}
```

O documento presente, arquivos não rastreados, alterações soltas do working tree, timestamps e documentos externos não integrantes do pacote são excluídos. Essa exclusão evita autorreferência circular do digest.

## Reprodução independente

- método 1: `freezeAuthorizationPackage` usado pelo runner controlado oficial;
- método 2: `Get-FileHash -Algorithm SHA256` para cada blob, seguido de serialização JSON compacta com chaves ordenadas e SHA-256 independente;
- resultado: os oito hashes e o package digest coincidiram integralmente.

## Validações sobre a HEAD da `main`

- instalação limpa: `npm ci` aprovado, 0 vulnerabilidades;
- build: aprovado antes da suíte;
- suíte integral: 129/129;
- schemas: 16/16, com fixtures positivas e negativas;
- acervo: 10 decisões, 1 tese e 6 fundamentos;
- readiness sintético: `NO_GO`, `ready_for_authorization=false`, `promotion_authorized=false`;
- runner controlado: `NO_GO / authorization_pr_missing`;
- escrita canônica: zero;
- operações Git e externas de promoção: zero;
- `git diff --check`: aprovado;
- varredura de padrões de segredos de alta confiança na árvore versionada: nenhuma ocorrência.

## Governança e pendências humanas

- único autorizador humano cadastrado: `oalexandreoliveira`;
- o PR autorizativo protegido, com base `main`, ainda não existe;
- o parecer técnico humano consultivo ainda não foi emitido;
- eventual ressalva exige ciência humana expressa;
- a autorização será de uso único e vinculada à HEAD, ao pacote, aos hashes e à lista fechada de arquivos;
- prontidão não equivale a autorização, e autorização não equivale a promoção;
- `canonical_write_local` e `commit_local` são capacidades independentes;
- push, PR pelo executor, merge, Publisher, deploy e publicação não são concedidos.

Este candidato permanece válido apenas enquanto os oito blobs autenticados e a HEAD de referência forem os mesmos. Qualquer mudança exige novo congelamento integral e nova revisão humana.

Decisão técnica: `NO_GO / definitive_authorization_package_awaiting_human_review`.

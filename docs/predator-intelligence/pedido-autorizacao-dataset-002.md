# Pedido formal de autorização — DATASET-002

**Natureza:** solicitação humana não executável; não constitui aceite nem autorização.  
**Validade:** `[DEFINIR APÓS A REMEDIAÇÃO SER INCORPORADA À MAIN]`.  
**Estado:** `authorization_requested=true`; `promotion_authorized=false`.

## Pacote e escopo fechado

- pacote: `sha256:8341e087ed8211b552e3b45cafe066629a0865869f67e4baccbc2440a519ec7c`;
- manifesto: `dataset-manifest-sha256-bc7f8942499dc512ca499d7f9159243338544c4362251c6a71ae349310d8592b`;
- plano: `plan-sha256-cecef7ff06db4bea6179e1443ee5f877274865965fa6b04fb3aa942695714dd4`;
- única operação futura: adicionar `data/jurisprudencia/tjce-7654321-71-2025-8-06-9999.yaml`;
- hash novo esperado: `sha256:851359bebd8d09688ec3f7ced57c37d352d2e275b2bb7c495aef943b93dbda14`;
- rollback: `rollback-sha256-92cce6e8afebc503cfb6af5bbe9fb42d073fc1aaded093cd25d38a0a2df49f14`.

## Decisão humana requerida

Solicita-se uma única decisão futura do autorizador humano cadastrado, `oalexandreoliveira`, emitida por PR protegido com base `main` e vinculada ao pacote definitivo, seus hashes e sua lista fechada de arquivos. Nenhuma assinatura, aprovação, token, ciência sobre ressalvas ou aceite foi registrada neste ciclo. O executor futuro deve permanecer separado.

Riscos pendentes: a prova usa somente dados sintéticos; controles produtivos, janela operacional, proteção de branch, backup e autorizações para escrita real ainda não estão definidos. Antes de qualquer promoção, devem ser novamente verificados o hash integral do pacote, o escopo exato, a inexistência do arquivo-alvo e as pré-condições do rollback.

Este documento encerra o Incremento E. Ele não autoriza escrita canônica, Git real, rede, Publisher, publicação ou abertura do Incremento F.

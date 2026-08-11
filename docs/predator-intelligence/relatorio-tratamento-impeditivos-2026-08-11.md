# Relatório de tratamento dos impeditivos — 2026-08-11

## Resultado

Os impeditivos técnicos locais identificados na auditoria foram tratados sem promover o DATASET-002 e sem fabricar autorização humana.

- suíte integral: 130/130 testes aprovados fora da restrição de subprocessos do sandbox;
- build: aprovado com 29 edições;
- acervo: 10 decisões, 1 tese e 6 fundamentos válidos;
- fluxo real: edição 15 vinculada à decisão `tjce-0050625-78-2021-8-06-0157`;
- navegação gerada: Edição → Decisão → Tese → Fundamento e retorno Decisão → Edição;
- dry-run DATASET-002: completo, isolado, sem remote, sem resíduo e sem escrita canônica;
- decisão de promoção: `NO_GO`.

## Tratamentos aplicados

### Integração editorial real

A edição `2026-07-16-cartao-consignado-fugazi` passou a referenciar explicitamente a decisão TJCE 0050625-78.2021.8.06.0157. A decisão é pertinente ao cartão consignado e registra resultado divergente — rejeição do vício de consentimento — preservando a representação honesta da amostra.

Foi adicionado teste que lê o Markdown editorial real, extrai a referência e confirma a existência do YAML canônico correspondente.

### Isolamento de sandboxes

Os testes de sandbox deixaram de pressupor que todo o diretório operacional deve estar vazio. Agora registram o estado preexistente e comprovam que cada simulação, inclusive sob falha induzida, não cria resíduos adicionais nem remove artefatos alheios.

### Simulação Git

As duas falhas `spawn EPERM` foram reproduzidas como restrição do ambiente isolado. A suíte executada em ambiente autorizado aprovou a criação do repositório Git sintético, ausência de remote, branch descartável, commit marcado como simulação, preservação do repositório real e limpeza após falha induzida.

## Gates externos remanescentes

O dry-run técnico concluiu todos os estágios e retornou corretamente `NO_GO` pelas condições:

- `real_authorizer_missing`;
- `production_window_missing`;
- PR protegido de autorização ausente;
- parecer técnico humano ausente;
- pedido sintético anterior expirado e inadequado para uso produtivo;
- pacote produtivo ainda precisa ser recongelado sobre uma baseline estável;
- escrita canônica, commit, push, merge, deploy e publicação não autorizados.

Esses gates não devem ser contornados por código. O próximo ato autorizado é estabilizar a baseline em Git, recongelar o pacote e submetê-lo à revisão e autorização humanas previstas na governança.

## Limites deste tratamento

As modificações visuais preexistentes em `scripts/build.mjs` e `src/style.css`, os documentos não rastreados e os worktrees existentes foram preservados. Eles devem ser classificados pelo responsável antes do congelamento da próxima baseline; nenhuma alteração do usuário foi descartada ou incorporada implicitamente.

## Classificação posterior da baseline

- `.worktrees/intelligence-release`: worktree Git registrado da branch `codex/intelligence-release-readiness`; não é resíduo operacional;
- `.worktrees/seguro-prestamista`: worktree Git registrado da branch `data/intelligence-seguro-prestamista`, com diretório `tmp/` próprio não rastreado;
- `ingestion/sandboxes/worktree-dataset-002-real`: worktree registrado da branch `data/dataset-002-tjce-real-candidate`;
- `ingestion/sandboxes/worktree-source-integrity`: worktree registrado da branch `fix/intelligence-source-integrity-gate`;
- `docs/Informativo0023.md`: evidência-fonte relacionada à decisão `tjce-0201664-84-2022-8-06-0029`; permanece fora do escopo até decisão sobre política de retenção de fontes integrais;
- `docs/pacote-autorizativo-dataset-002-pre-revisao.md`: artefato histórico pré-remediação, com HEAD e hashes superados; não deve integrar um novo pacote autorizativo;
- `scripts/build.mjs` e `src/style.css`: redesign editorial preexistente, funcionalmente compatível com build e testes, mas ainda dependente de aceite visual humano.

O diretório `.worktrees/` foi incluído no `.gitignore` da baseline principal. Isso não remove, altera ou desregistra os worktrees; apenas impede que sua infraestrutura apareça como conteúdo não rastreado do projeto principal.

## Gate reproduzível de release

Foi criado o comando `npm run check:release`, adotado também pelo workflow de GitHub Pages. O gate executa validação do acervo, build, auditoria de links internos e suíte integral antes de qualquer upload ou deploy. O fluxo de publicação foi atualizado para refletir os paths efetivamente monitorados e a nova sequência de validação.

## Correção da falsa restrição de expansão

A implementação anterior tratava TJCE, TJMA e TJPI como lista fechada. Essa regra não consta do escopo: eram apenas os tribunais do dataset piloto. A correção tornou o identificador e o campo de tribunal extensíveis, removeu limites artificiais de quantidade nos testes e adicionou cobertura para:

- decisão de tribunal fora do lote inicial com CNJ consistente;
- novo fundamento sem alterar decisões existentes;
- nova tese relacionada ao novo fundamento;
- manutenção das validações de schema, taxonomia, duplicidade e referências.

O gate final desta correção foi aprovado com **132/132 testes**, build válido e 51 páginas HTML sem links internos quebrados.

## Gate visual

A tentativa de inspeção no navegador interno não alcançou o servidor local por isolamento de rede entre os ambientes. O HTML gerado, os relacionamentos e os testes automatizados foram validados, mas revisão visual desktop/mobile e aceite humano continuam abertos e não são declarados como concluídos.

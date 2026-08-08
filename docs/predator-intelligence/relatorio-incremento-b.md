# Relatório do Incremento B

## Classificação

APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES. A trajetória local simulada está implementada; parâmetros reais continuam deliberadamente ausentes e bloqueiam qualquer operação externa.

## Implementação

O contrato de recuperação é agnóstico e exige autorização opaca emitida pelo budget guard. O único adaptador aceito é identificado como `simulated-local`, trabalha com fixture clonada em memória, declara capacidade de rede falsa e não importa cliente HTTP. Checkpoints e snapshots sintéticos têm escrita atômica e validação fail-closed. O índice canônico é derivado em memória por leitura do acervo e recebe uma versão SHA-256 usada pelo gate final.

Regras determinísticas de deduplicação:

- ID canônico ou unidade decisória completa coincidente: `exact_duplicate`, sem detalhe.
- Unidade coincidente dentro do lote: `exact_duplicate`, sem detalhe.
- Mesmo tribunal e CNJ, mas unidade decisória diferente: `probable_duplicate`, preservado para revisão futura.
- CNJ formalmente inválido: `invalid`, sem correção inferida.
- CNJ válido sem metadados decisórios mínimos: `insufficient_evidence`.
- Sem correspondência e com metadados mínimos: `distinct_decision`.
- Mudança da versão do índice durante a execução: gate bloqueado.

## Testes do Incremento B

| Requisito | Teste |
|---|---|
| Autorização obrigatória | contrato bloqueia operação onerosa sem autorização |
| Zero rede e determinismo | fake é local, determinístico e nunca usa rede |
| Duas páginas e cursor | duas páginas preservam ordem, cursor e contadores |
| Retomada | interrupção retoma na página seguinte |
| Checkpoint inválido/incompatível | checkpoint corrompido e de outro fingerprint falham fechado |
| Retry e erros | retry transitório é limitado e auditável; erro definitivo não é repetido |
| Separação raw/normalizado/candidato e detalhe bloqueado | pipeline separa raw, normalizado e candidato |
| Duplicidade no lote e provável preservado | duplicidade do lote precede detalhe |
| Duas decisões do mesmo processo | decisões distintas do mesmo processo não são colapsadas |
| CNJ e rastreabilidade | CNJ inválido não é inferido e original permanece rastreável |
| Concorrência no índice | gate final detecta mudança concorrente |
| Idempotência | reexecução completa em estado limpo é idempotente |
| Cache sem consumo | cache elegível evita fake e registra consumo zero |
| Isolamento público | artefatos efêmeros não aparecem em `dist` |

## Funil da fixture oficial

O comando `npm run simulate:ingestion` produz:

| Métrica | Total |
|---|---:|
| Listados | 7 |
| Pré-duplicados exatos | 2 |
| Prováveis | 2 |
| Detalhes simulados | 4 |
| Duplicados finais | 2 |
| Distintos | 1 |
| Inválidos | 1 |
| Evidência insuficiente | 1 |

## Pendências

Modalidade de acesso, custos, cota, limite operacional, reservas absolutas, TTL, retenção real, tribunais/período, tamanho do lote e papéis de revisão permanecem não configurados. O mecanismo continua fail-closed. Não existe adaptador real nem caminho de rede, classificação jurídica, revisão humana, geração de YAML ou integração com Publisher.

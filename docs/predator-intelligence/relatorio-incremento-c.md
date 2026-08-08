# Relatório do Incremento C

## Classificação

APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES. A classificação e revisão são exclusivamente locais, determinísticas e sintéticas. Pessoas, papéis, SLA, retenção, campos e limiares reais permanecem pendentes e impedem uso produtivo.

## Inventário e limites

Famílias simuladas: `produto`, `tema`, `prova`, `perfil_consumidor` e `meio_contratacao`. Permanecem exclusivamente humanos: teses, fundamentos, resultados jurídicos, resumo, fonte, identificação decisória e `frase_peca`.

Estados por campo: `suggested`, `abstained`, `unsupported`, `contradictory` e `invalid`. Ausência de sinal explícito gera abstenção; sinais válidos divergentes preservam todas as evidências e geram contradição; valor desconhecido gera `unsupported` e proposta taxonômica separada, não aprovável neste fluxo.

Evidência contém `source`, seção estável, trecho sintético e SHA-256 do trecho. Confiança usa escala fechada 0–1 apenas para ordenação; não aprova nem altera estado de revisão.

## Revisão

Estados: `pending`, `claimed`, `in_review`, `decided`, `returned` e `superseded`. Decisões: `approve`, `correct`, `reject` e `return`. O papel sintético autorizado é `legal_reviewer`; identidades são opacas. Eventos JSONL são append-only, versões usam optimistic locking e chaves idempotentes evitam duplicação. O estado é reconstruído integralmente da trilha.

Somente `approve` ou `correct`, com checklist completo, decisões explícitas por campo e mesma versão taxonômica, produz `.reviewed.json` intermediário com `publishable: false`. O artefato não é YAML nem registro canônico.

## Matriz dos 33 cenários

| # | Cenário | Resultado |
|---:|---|---|
| 1 | Saída é sugestão | aprovado |
| 2 | Classificador sem rede | aprovado |
| 3 | Determinismo | aprovado |
| 4 | Identidade muda com política/taxonomia | aprovado |
| 5 | Valores dentro da taxonomia | aprovado |
| 6 | Desconhecido bloqueado sem mutação | aprovado |
| 7 | Alias não declarado rejeitado | aprovado |
| 8 | Ausência de evidência abstém | aprovado |
| 9 | Contradição preserva evidências | aprovado |
| 10 | Localizador reencontra trecho | aprovado |
| 11 | Confiança fora da escala rejeitada | aprovado |
| 12 | Confiança alta não aprova | aprovado |
| 13 | Proposta taxonômica separada | aprovado |
| 14 | Entrada duplicada idempotente | aprovado |
| 15 | Papel autorizado obrigatório | aprovado |
| 16 | Claim concorrente | aprovado |
| 17 | Approve exige checklist/metadados | aprovado |
| 18 | Correct preserva os dois valores | aprovado |
| 19 | Reject exige motivo | aprovado |
| 20 | Return exige motivo/estado | aprovado |
| 21 | Eventos anteriores imutáveis | aprovado |
| 22 | Projeção reconstruível | aprovado |
| 23 | Decisão repetida idempotente | aprovado |
| 24 | Versão obsoleta rejeitada | aprovado |
| 25 | Mudança taxonômica bloqueia | aprovado |
| 26 | Estados não elegíveis não exportam | aprovado |
| 27 | Revisão humana válida exporta | aprovado |
| 28 | Artefato não canônico | aprovado |
| 29 | Sem criação de `frase_peca` | aprovado |
| 30 | Métricas separam estados humanos | aprovado |
| 31 | Operacionais ausentes de `dist` | aprovado |
| 32 | 63 testes herdados preservados | aprovado |
| 33 | Zero diferenças jurídicas/editoriais | aprovado |

## Funil e métricas sintéticas

`npm run simulate:review` gera: 8 elegíveis, 8 classificados, 1 integralmente abstido, 1 contraditório, 1 pendente, 1 aprovado, 1 corrigido, 1 rejeitado, 1 devolvido e 2 exportáveis.

Em 40 campos sintéticos: cobertura 0,625; abstenção 0,325; 1 campo contraditório; 1 não suportado. Decisões humanas simuladas: 1 aceita, 1 editada, 1 rejeitada e 1 devolvida. São métricas determinísticas de fixtures, não acurácia nem desempenho real.

## Pendências

Continuam indefinidos: revisores e permissões reais, SLA, limites de fila, campos produtivos, limiares operacionais, retenção, dados pessoais, evolução taxonômica, dupla revisão, geração canônica, acesso/custos do JusRatio e Publisher. Nenhuma dessas pendências autoriza ultrapassar os gates locais.

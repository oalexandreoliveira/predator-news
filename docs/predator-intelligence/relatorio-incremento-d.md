# Relatório do Incremento D

## Classificação

APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES. O incremento termina em proposta não oficial e simulação descartada. `promotion_authorized` permanece `false`.

## Mapeamento

| Origem revisada | Destino | Regra |
|---|---|---|
| identificação | `payload.identificacao` | cópia literal, integralmente revisada |
| título e resumo | campos homônimos | obrigatórios; nenhuma geração |
| contexto e provas | campos canônicos | somente enums vigentes |
| teses e fundamentos | campos canônicos | somente referências existentes |
| resultados | `payload.resultado` | quatro resultados explícitos |
| fonte, autoridade e status | campos homônimos | cópia literal validada |
| confiança, evidência, revisor e fila | nenhum | proibidos no payload |
| `frase_peca` ausente | nenhum | omissão obrigatória |

O ID segue `{tribunal}-{CNJ com pontos substituídos por hífens}`. A proposta usa `.proposal.json`, `canonical: false`, `publishable: false` e `promotion_status: proposed`; nunca é aceita pelo loader YAML canônico.

## Gates

Elegibilidade exige `.reviewed.json`, decisão final `approve` ou `correct`, checklist completo, revisão versionada e hash íntegro. Divergências de revisão, taxonomia, schema, política ou índice bloqueiam em modo fail-closed.

Deduplicação final reconstrói o índice atual. Mesma unidade é `exact_duplicate`; mesmo processo com metadados decisórios distintos é `probable_duplicate`; ambos são não promovíveis. Colisão e tentativa de caminho canônico são bloqueadas.

## Proveniência, manifesto e diff

O manifesto registra candidato, classificação, revisão, decisão, lote, hashes de entrada/saída, versões de taxonomia/schema/acervo/política, estado e motivos. Sua identidade exclui o horário isolado, preservando idempotência sem perder `generated_at`.

O diff separa `additions`, `mappings`, `intentional_omissions` e `blocks`. Códigos usados incluem `review_not_eligible`, `review_version_stale`, `taxonomy_version_stale`, `schema_version_stale`, `policy_version_stale`, `canonical_index_stale`, `input_integrity_failed`, `unreviewed_field`, `forbidden_inference`, `legal_validation_failed`, `identifier_collision`, `exact_duplicate`, `probable_duplicate` e `canonical_write_attempt`.

## Matriz dos 44 cenários

| # | Cenário | Resultado |
|---:|---|---|
| 1 | Somente `.reviewed.json` elegível | aprovado |
| 2 | Revisão não autoriza promoção | aprovado |
| 3 | Estados inelegíveis bloqueados | aprovado |
| 4 | Checklist incompleto | aprovado |
| 5 | Revisão obsoleta | aprovado |
| 6 | Taxonomia alterada | aprovado |
| 7 | Schema alterado | aprovado |
| 8 | Política alterada | aprovado |
| 9 | Acervo concorrente | aprovado |
| 10 | Hash inconsistente | aprovado |
| 11 | Transformação determinística | aprovado |
| 12 | Versão muda identidade | aprovado |
| 13 | Somente campos revisados | aprovado |
| 14 | Ausência não inferida | aprovado |
| 15 | Conteúdo jurídico não criado | aprovado |
| 16 | Sem `frase_peca` | aprovado |
| 17 | Sem dados operacionais no payload | aprovado |
| 18 | Marcadores não canônicos | aprovado |
| 19 | Caminho/extensão operacional | aprovado |
| 20 | ID estável/colisão bloqueada | aprovado |
| 21 | Enum desconhecido bloqueado | aprovado |
| 22 | Referência inexistente bloqueada | aprovado |
| 23 | Schema jurídico inválido bloqueado | aprovado |
| 24 | Exato bloqueado | aprovado |
| 25 | Provável preservado/não promovido | aprovado |
| 26 | Decisões distintas não colapsadas | aprovado |
| 27 | Sobrescrita impossível | aprovado |
| 28 | Proveniência integral | aprovado |
| 29 | Bloqueados/excluídos com motivo | aprovado |
| 30 | Diff semântico categorizado | aprovado |
| 31 | Escrita somente na cópia | aprovado |
| 32 | Acervo oficial byte a byte intacto | aprovado |
| 33 | Parcial somente independente/válido | aprovado |
| 34 | Item falho sem aplicação parcial | aprovado |
| 35 | Validação jurídica na cópia | aprovado |
| 36 | Build de prova isolado | aprovado |
| 37 | Rollback após sucesso | aprovado |
| 38 | Rollback após falha | aprovado |
| 39 | Reexecução idempotente | aprovado |
| 40 | Operacionais fora de `dist` | aprovado |
| 41 | 78 testes herdados preservados | aprovado |
| 42 | Áreas protegidas sem mudanças da tarefa | aprovado |
| 43 | Zero rede/JusRatio/cota | aprovado |
| 44 | Zero YAML oficial criado/modificado | aprovado |

## Funil reproduzível

`npm run simulate:promotion`: 5 revisados, 3 elegíveis/propostos, 1 duplicado exato, 1 provável, 1 revisão inválida, 4 bloqueados e 1 simulado. O manifesto contém todos os itens. O diff contém 1 adição, 27 mapeamentos, 1 omissão intencional e 4 bloqueios.

O build de prova gerou 28 edições dentro do sandbox, aplicou 1 proposta válida e terminou com zero sandboxes remanescentes. O mesmo rollback foi comprovado após falha induzida.

## Pendências

Permanecem pendentes autorizadores finais, segregação de funções, dupla aprovação, retenção, dados pessoais, estratégia de IDs reais, resolução de prováveis, autorização formal de escrita, fluxo Git/PR e Publisher. Essas pendências bloqueiam promoção real e o Incremento E.

# Abertura Codex — Incremento C da Predator Intelligence

**Projeto:** Predator News — Predator Intelligence  
**Ciclo de dados:** DATASET-002  
**Incremento:** C — IN05 + IN06  
**Data de abertura:** 08/08/2026  
**Status:** pronto para execução técnica controlada  
**Modo:** exclusivamente local, simulado e sujeito a decisão humana

---

## 1. Decisão de abertura

O Incremento B — IN03 + IN04 está aceito como **APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES**.

Fica autorizada a abertura do Incremento C, limitada à construção e validação local de:

1. contrato agnóstico do classificador;
2. classificador integralmente simulado e determinístico;
3. classificação restrita à taxonomia vigente;
4. evidência, localizador, confiança e estado por campo;
5. avaliação reproduzível das sugestões;
6. fila e estação local de revisão humana;
7. decisões humanas explícitas e auditáveis;
8. controle de versão, concorrência, permissões e idempotência;
9. exportação apenas para artefato intermediário validado.

Esta abertura **não autoriza** classificação por serviço externo, chamadas ao JusRatio, consumo de cota, aprovação automática, criação ou alteração de taxonomia, geração de YAML canônico, incorporação ao acervo, integração com Publisher ou operação Git externa.

---

## 2. Prompt-mestre para o Codex

Copie integralmente o bloco abaixo para uma nova sessão do Codex apontada para o repositório local atualizado do Predator News.

```text
Trabalhe no repositório atual do Predator News para implementar exclusivamente o Incremento C — IN05 + IN06 — da Predator Intelligence, ciclo DATASET-002.

CONTEXTO E FONTES DE VERDADE

Antes de alterar arquivos, leia integralmente:

1. AGENTS.md e instruções locais equivalentes, se existirem;
2. documentação permanente relevante em /docs;
3. PREDATOR_INTELLIGENCE_EXPANSAO_ACERVO_INGESTAO_JURISPRUDENCIAL.md;
4. PACOTE_CODEX_PREDATOR_INTELLIGENCE_DATASET_002.md;
5. ABERTURA_CODEX_INCREMENTO_B_PREDATOR_INTELLIGENCE.md;
6. docs/predator-intelligence/relatorio-incremento-a.md;
7. docs/predator-intelligence/relatorio-incremento-b.md;
8. ingestion/README.md, configurações, schemas, fixtures e políticas;
9. src/ingestion/, scripts/ingestion/ e tests/ingestion/;
10. schemas, taxonomia, aliases, teses, fundamentos e decisões atuais, somente para leitura;
11. package.json, .gitignore, scripts de validação e build.

Se qualquer documento arquitetural obrigatório estiver ausente, pare e informe a ausência. Não reconstrua suas regras por memória.

ESTADO HERDADO

Considere como baseline informado:

- Incrementos A e B aprovados com pendências não bloqueantes;
- 63/63 testes aprovados: 36 preexistentes, 12 do A e 15 do B;
- quatro schemas operacionais e matriz dos 14 cenários herdados;
- budget guard, ledger, cache, manifesto e fingerprint fail-closed;
- adaptador simulated-local sem primitivas de rede;
- paginação retomável, snapshots sintéticos e deduplicação multicamada;
- gate contra alteração concorrente do índice canônico;
- zero consulta ao JusRatio e zero consumo de cota;
- nenhuma alteração jurídica, editorial ou pública.

Antes de implementar, confirme esse baseline no repositório real. Se o número de testes ou a estrutura tiver evoluído legitimamente, registre o baseline encontrado e explique a diferença.

OBJETIVO DESTA EXECUÇÃO

Implementar somente a trajetória local:

candidato sintético elegível
→ proposta de classificação simulada
→ validação contra taxonomia vigente
→ evidência e confiança por campo
→ avaliação local
→ entrada versionada na fila
→ reivindicação por revisor autorizado
→ decisão humana explícita
→ auditoria append-only
→ artefato intermediário validado.

ESCOPO AUTORIZADO

A. Contrato do classificador

- Defina interface agnóstica para receber candidato, taxonomia versionada e política de classificação.
- A saída deve ser sugestão, nunca decisão final.
- Modele por campo: valor sugerido, estado, confiança, evidências e localizadores.
- Estados mínimos: suggested, abstained, unsupported, contradictory e invalid.
- O contrato deve admitir abstenção e múltiplas evidências.
- Não inclua cliente HTTP, SDK, prompt remoto, credencial ou integração com modelo externo.

B. Classificador simulado e determinístico

- Implemente somente classificador baseado em fixtures e regras locais explícitas.
- Use exclusivamente candidatos e textos sintéticos.
- Mesma entrada, mesma taxonomia e mesma versão de política devem produzir saída idêntica.
- Não inferir valor ausente, completar texto, corrigir conteúdo jurídico ou criar equivalência sem regra declarada.
- Valor fora da taxonomia deve resultar em unsupported ou invalid, nunca inclusão silenciosa.
- Contradições devem permanecer visíveis e impedir decisão automática.

C. Evidência e confiança por campo

- Cada sugestão deve apontar evidência verificável no candidato sintético.
- O localizador deve permitir reencontrar o trecho sem depender de índice frágil isolado.
- Preserve texto-fonte sintético e hash/versão do insumo quando adequado.
- Confiança deve ser valor validado em escala documentada e servir apenas para ordenação e apoio à revisão.
- Confiança alta não autoriza aprovação automática.
- Campo sem evidência suficiente deve gerar abstenção.

D. Taxonomia somente leitura

- Carregue enums, identificadores e aliases jurídicos atuais sem modificá-los.
- Registre a versão ou hash da taxonomia usada na classificação.
- Rejeite proposta com identificador desconhecido.
- Mudança da taxonomia entre classificação e revisão deve invalidar ou devolver o item para reclassificação.
- Necessidade de nova categoria deve produzir proposta separada, fora do fluxo de aprovação e sem mutação canônica.

E. Avaliação da classificação

- Crie fixtures representativas dos estados previstos, sempre sintéticas.
- Calcule métricas determinísticas por família de campo: cobertura, abstenção, aceitação, edição e rejeição.
- Não apresente confiança do classificador como acurácia estatística.
- Separe resultado da sugestão de resultado da decisão humana.
- Gere relatório local reproduzível, sem dados reais.

F. Fila e estação local de revisão

- Implemente a menor estação compatível com a stack existente; CLI ou módulo local é aceitável e preferível a uma UI prematura.
- Estados mínimos da fila: pending, claimed, in_review, decided, returned e superseded.
- Decisões humanas mínimas: approve, correct, reject e return.
- Exija identidade opaca do revisor, papel autorizado, data, versão esperada e motivo quando aplicável.
- Aprovação deve exigir checklist jurídico completo e decisão explícita por campo ou conjunto documentado.
- Correção deve preservar valor sugerido e valor humano.
- Rejeição e devolução devem exigir motivo padronizado e permitir observação opcional sem dados sensíveis.

G. Auditoria, concorrência e idempotência

- Registre eventos de revisão em trilha append-only; não edite nem apague eventos anteriores.
- Derive o estado atual a partir dos eventos ou mantenha projeção reconstruível.
- Use optimistic locking, versão esperada ou mecanismo equivalente.
- Duas decisões concorrentes sobre a mesma versão não podem ser aceitas.
- Repetição idêntica com a mesma chave idempotente não duplica evento.
- Alterações materiais exigem novo evento e nova versão.
- Toda decisão deve ser rastreável a candidato, classificação, taxonomia, política, revisor e evidência.

H. Artefato intermediário

- Exporte apenas registro intermediário de candidato revisado, fora do acervo canônico.
- O artefato deve indicar claramente que não é YAML publicável nem decisão incorporada.
- Só permita exportação após decisão humana válida e checklist completo.
- Rejeitados, devolvidos, superseded ou com taxonomia divergente não podem ser exportados.
- Valide o artefato por schema operacional próprio.
- Não reutilize extensão, caminho ou nome que possa ser confundido com registro canônico.

REGRAS INEGOCIÁVEIS

- Toda classificação é sugestão assistida, nunca decisão jurídica automática.
- Nenhum limiar de confiança aprova, rejeita, corrige ou promove candidato.
- Nenhuma taxonomia, alias, tese, fundamento ou enum canônico será criado ou alterado.
- Nenhum YAML canônico será gerado ou escrito.
- Nenhum candidato será incorporado ao acervo.
- Nenhum texto jurídico real será enviado a serviço externo.
- Zero chamada ao JusRatio, zero rede de classificação e zero consumo de cota.
- Somente fixtures sintéticas podem atravessar o pipeline deste incremento.
- Auditoria de revisão é append-only.
- Candidato não decidido por humano autorizado não gera artefato intermediário.
- Frase de peça não será criada, inferida ou preenchida.
- Publisher, layout, conteúdo editorial e build público permanecem inalterados.
- Artefatos operacionais, filas e auditorias locais não entram em dist/.
- Não fornecer nem solicitar credenciais.
- Não fazer commit, push, PR ou publicação.
- Não avançar para o Incremento D nesta sessão.

FASE 1 — INSPEÇÃO SOMENTE LEITURA

1. Verifique branch, status e alterações locais; preserve mudanças não relacionadas.
2. Confirme os relatórios, testes e componentes dos Incrementos A e B.
3. Localize a taxonomia, enums, aliases e schemas jurídicos vigentes sem alterá-los.
4. Mapeie os campos classificáveis e os que devem permanecer exclusivamente humanos.
5. Confirme o schema operacional de revisão existente e proponha somente extensões compatíveis.
6. Identifique os mecanismos existentes de validação, escrita atômica, lock e auditoria reutilizáveis.
7. Confirme comandos oficiais de teste, validação e build.
8. Apresente plano curto com arquivos a criar e modificar antes de editar.

Pare apenas diante de conflito material, ausência de fonte de verdade ou impossibilidade de preservar os gates. Escolhas internas reversíveis devem seguir a menor solução compatível.

FASE 2 — IMPLEMENTAÇÃO

- Reutilize padrões e módulos já existentes.
- Prefira funções puras, dependências injetáveis, relógio e gerador de IDs injetáveis.
- Restrinja o classificador a regras locais transparentes.
- Trate confiança como metadado auxiliar, não autorização.
- Mantenha a taxonomia em modo somente leitura e verifique sua versão em cada transição crítica.
- Separe fisicamente classificação, revisão, auditoria e exportação intermediária.
- Mantenha estado efêmero fora do Git e do build.
- Não instale dependência nova sem necessidade demonstrada.

FASE 3 — TESTES MÍNIMOS DO INCREMENTO C

Implemente testes que cubram, no mínimo:

1. contrato identifica a saída como sugestão, não decisão;
2. classificador simulado não contém nem executa primitiva de rede;
3. mesma entrada e versões produzem resultado idêntico;
4. mudança da política ou taxonomia altera a identidade da classificação;
5. todo valor sugerido pertence à taxonomia vigente;
6. valor desconhecido é rejeitado sem mutar a taxonomia;
7. alias não declarado não é aceito por aproximação;
8. campo sem evidência gera abstained;
9. evidência contraditória gera contradictory e preserva ambas as evidências;
10. evidência e localizador permitem reencontrar o trecho sintético;
11. confiança fora da escala é rejeitada;
12. confiança alta não produz aprovação automática;
13. proposta de nova taxonomia permanece separada e não aprovável;
14. entrada duplicada na fila é idempotente;
15. somente papel autorizado pode reivindicar ou decidir item;
16. reivindicação concorrente aceita apenas uma versão válida;
17. approve exige checklist completo, revisor, data e versão esperada;
18. correct preserva sugestão original e valor humano corrigido;
19. reject exige motivo padronizado;
20. return exige motivo e devolve o item ao estado permitido;
21. evento de auditoria anterior permanece imutável;
22. estado atual pode ser reconstruído pela trilha append-only;
23. repetição da mesma decisão com chave idempotente não duplica evento;
24. decisão concorrente com versão obsoleta é rejeitada;
25. mudança da taxonomia após classificação impede aprovação/exportação;
26. item pendente, rejeitado, devolvido ou superseded não é exportado;
27. somente revisão humana válida gera artefato intermediário;
28. artefato intermediário não usa caminho, extensão ou schema canônico;
29. nenhuma frase de peça é criada quando ausente;
30. métricas distinguem sugestão, edição, rejeição e abstenção;
31. filas, auditorias e artefatos intermediários não aparecem em dist/;
32. os 63 testes informados e as validações preexistentes continuam aprovados;
33. nenhuma diferença é produzida em data/, schemas jurídicos, taxonomia, aliases ou content/.

FASE 4 — VALIDAÇÃO

Execute e registre:

- baseline antes da edição;
- suíte completa preexistente;
- novos testes do Incremento C;
- validação dos schemas operacionais;
- validação do acervo jurídico;
- execução reproduzível da classificação e revisão simuladas;
- build completo;
- git diff --check;
- scanner de segredos disponível;
- inspeção da saída pública;
- prova de ausência de primitivas/chamadas de rede;
- diferenças em acervo, schemas jurídicos, taxonomia, aliases e conteúdo editorial.

ENTREGA OBRIGATÓRIA

Ao final, apresente:

1. classificação: APROVADO, APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES ou BLOQUEADO;
2. resumo do implementado;
3. árvore dos arquivos criados e modificados;
4. tabela dos 33 cenários mínimos e resultados;
5. campos classificáveis, estados e regras de abstenção/contradição;
6. formato de evidência, localizador e escala de confiança;
7. estados da fila, decisões humanas, papéis e permissões adotados;
8. modelo de concorrência, idempotência e auditoria;
9. funil simulado: elegíveis, classificados, abstidos, contraditórios, pendentes, aprovados, corrigidos, rejeitados, devolvidos e exportáveis;
10. métricas da avaliação local, sem apresentá-las como desempenho real;
11. comandos de validação e resultados;
12. riscos e decisões humanas ainda pendentes;
13. confirmação de zero consulta ao JusRatio, zero serviço externo e zero consumo de cota;
14. confirmação de que acervo, schemas jurídicos, taxonomia, aliases, teses, fundamentos, Publisher, layout e conteúdo editorial não foram alterados;
15. confirmação de que nenhum YAML canônico foi gerado;
16. proposta objetiva para o Incremento D, sem implementá-lo.

Não faça commit, push, PR ou publicação. Encerre a sessão ao concluir o Incremento C.
```

---

## 3. Backlog fechado do Incremento C

| ID | Entrega | Prioridade | Critério de conclusão |
| --- | --- | --- | --- |
| C-00 | Verificação do baseline A/B | P0 | 63 testes e gates herdados confirmados ou divergência explicada |
| C-01 | Inventário de campos e taxonomia | P0 | matriz somente leitura de campos, enums, aliases e campos exclusivamente humanos |
| C-02 | Contrato agnóstico do classificador | P0 | sugestão por campo, abstenção, contradição, evidência e versões modeladas |
| C-03 | Classificador exclusivamente simulado | P0 | regras determinísticas sobre fixtures sintéticas e nenhuma rede |
| C-04 | Evidência, localizador e confiança | P0 | rastreabilidade por campo e escala validada sem efeito autorizativo |
| C-05 | Avaliação local | P1 | métricas reproduzíveis separando sugestão e decisão humana |
| C-06 | Fila e estação de revisão | P0 | estados, reivindicação, checklist e quatro decisões humanas explícitas |
| C-07 | Auditoria e concorrência | P0 | eventos append-only, idempotência e rejeição de versão obsoleta |
| C-08 | Artefato intermediário validado | P0 | exportação não canônica apenas após revisão válida |
| C-09 | Gate de regressão e relatório | P0 | 33 cenários, build, isolamento e zero diferenças jurídicas/editoriais |

### Ordem obrigatória

`C-00 → C-01 → C-02 → C-03/C-04 → C-05 → C-06 → C-07 → C-08 → C-09`

C-03 e C-04 podem ser desenvolvidos em paralelo lógico. A estação de revisão só pode consumir classificações validadas contra a versão registrada da taxonomia.

---

## 4. Estrutura sugerida

A árvore é indicativa e deve ser adaptada às convenções reais:

```text
src/ingestion/
├── classification/
│   ├── classifier-contract.mjs
│   ├── simulated-classifier.mjs
│   ├── evidence.mjs
│   ├── taxonomy-reader.mjs
│   └── evaluation.mjs
├── review/
│   ├── review-queue.mjs
│   ├── review-policy.mjs
│   ├── review-audit.mjs
│   ├── review-projection.mjs
│   └── intermediate-export.mjs
└── index.mjs

ingestion/
├── config/
│   ├── classification-policy.yaml
│   └── review-policy.example.yaml
├── schemas/
│   ├── classification-result.schema.json
│   ├── review-event.schema.json
│   └── reviewed-candidate.schema.json
├── fixtures/
│   ├── simulated-classification/
│   └── simulated-review/
├── review-queue/
├── audit/
└── intermediate/

scripts/ingestion/
└── run-simulated-review.mjs

tests/ingestion/
└── increment-c.test.mjs

docs/predator-intelligence/
└── relatorio-incremento-c.md
```

Os diretórios de fila, auditoria operacional e exportações intermediárias devem permanecer fora do Git e do build, salvo fixtures sintéticas e relatório final expressamente selecionado.

---

## 5. Contratos conceituais mínimos

### 5.1 Sugestão por campo

```yaml
field: produto
status: suggested
suggested_value: rmc
confidence: 0.90
evidence:
  - source: candidate_text
    locator:
      section: synthetic_summary
      quote_hash: sha256:...
    excerpt: "texto exclusivamente sintético"
taxonomy_version: "..."
policy_version: 1
```

O exemplo é estrutural. O Codex deve reutilizar nomes oficiais encontrados no repositório e não assumir que `produto` ou `rmc` sejam campos/valores válidos sem confirmação.

### 5.2 Evento de revisão

```yaml
event_id: review-event-synthetic-001
candidate_id: candidate-synthetic-001
classification_id: classification-synthetic-001
event_type: decision_recorded
decision: correct
expected_version: 3
resulting_version: 4
reviewer:
  id: reviewer-local-opaque
  role: legal_reviewer
reason_code: evidence_requires_correction
idempotency_key: synthetic-key-001
occurred_at: 2026-08-08T00:00:00Z
```

Identidades, datas e valores são sintéticos. Papéis reais continuam pendentes de decisão humana.

---

## 6. Gate de encerramento

O Incremento C só poderá ser encerrado quando:

- toda sugestão estiver vinculada a candidato, versões e evidência por campo;
- valores desconhecidos forem bloqueados sem mutar taxonomia ou aliases;
- confiança não puder produzir decisão automática;
- abstenções e contradições forem preservadas;
- apenas revisor autorizado puder decidir;
- aprovação exigir checklist completo e versão válida;
- decisões concorrentes e repetidas forem tratadas com segurança;
- auditoria for append-only e o estado puder ser reconstruído;
- somente revisão humana válida gerar artefato intermediário;
- nenhum YAML canônico ou alteração de acervo for produzido;
- testes, validações e build forem aprovados;
- nenhum artefato operacional aparecer em `dist/`;
- estiver comprovada a ausência de rede, consulta externa e consumo de cota.

Qualquer necessidade de classificador externo, dado real, mudança de taxonomia ou geração canônica é **bloqueio de escopo**.

---

## 7. Decisões que permanecem pendentes

Não devem ser inventados neste incremento:

1. pessoas e papéis reais de revisão;
2. matriz definitiva de permissões;
3. SLA e tamanho máximo da fila;
4. campos autorizados para classificação assistida em produção;
5. escala e limiares operacionais reais de confiança;
6. política de retenção de auditoria e artefatos reais;
7. tratamento de dados pessoais em decisões reais;
8. procedimento formal para proposta de evolução da taxonomia;
9. critérios de dupla revisão ou desempate;
10. autorização para gerar YAML canônico;
11. acesso, cota e custos do JusRatio;
12. integração com Publisher.

Essas pendências não bloqueiam fixtures, classificador e revisão simulados. Bloqueiam uso real, promoção ao acervo e os Incrementos D/E.

---

## 8. Resultado esperado

Ao final, o projeto deverá demonstrar, exclusivamente com dados sintéticos, que uma sugestão classificatória restrita à taxonomia pode ser explicada, revisada, corrigida ou rejeitada por humano autorizado, com concorrência segura e auditoria reconstruível, sem transformar a sugestão em conteúdo jurídico canônico.

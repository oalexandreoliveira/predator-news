# Abertura Codex — Incremento D da Predator Intelligence

**Projeto:** Predator News — Predator Intelligence  
**Ciclo de dados:** DATASET-002  
**Incremento:** D — IN07 + IN08  
**Título:** Promoção controlada e proposta canônica  
**Data de abertura:** 08/08/2026  
**Status:** pronto para execução técnica controlada  
**Modo:** exclusivamente local, sintético, determinístico e sem incorporação ao acervo

---

## 1. Decisão de abertura

O Incremento C — IN05 + IN06 está aceito como **APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES**.

Fica autorizada a abertura do Incremento D, limitada a:

1. transformar `.reviewed.json` elegível em **proposta canônica não oficial**;
2. mapear somente valores humana e expressamente revisados para o schema jurídico vigente;
3. validar versões, referências, enums, unicidade e deduplicação final;
4. produzir diff legível e manifesto de promoção separado;
5. simular a incorporação em diretório isolado;
6. executar validações, regressão e build de prova sobre a simulação;
7. demonstrar rollback integral e emitir relatório reproduzível.

O Incremento D termina em uma **proposta canônica inspecionável**. Não autoriza escrita em YAML oficial, incorporação ao acervo, dados reais, JusRatio, Publisher ou operação Git externa.

---

## 2. Decisões de arquitetura

### 2.1 Duas aprovações distintas

- **decisão de revisão:** confirma os campos revisados do candidato;
- **autorização de promoção:** autorização humana futura, explícita e fora deste incremento, para gravar no acervo.

Uma decisão `approve` ou `correct` torna o item elegível à proposta, mas jamais autoriza sua incorporação.

### 2.2 Três classes de artefato

| Artefato | Natureza | Pode entrar no acervo? |
| --- | --- | --- |
| `.reviewed.json` | intermediário aprovado pelo revisor | não |
| proposta canônica | projeção inspecionável, não oficial | não |
| YAML canônico | registro oficial do acervo | fora do escopo |

### 2.3 Fail-closed

Qualquer divergência de versão da revisão, taxonomia, schema, política de transformação ou índice do acervo bloqueia o item. Falha de um item pode admitir simulação parcial apenas quando os demais forem independentes, aprovados e referencialmente íntegros; bloqueados e excluídos devem permanecer registrados.

---

## 3. Prompt-mestre para o Codex

Copie integralmente o bloco abaixo para uma nova sessão do Codex apontada para o repositório local atualizado do Predator News.

```text
Implemente exclusivamente o Incremento D — IN07 + IN08 — da Predator Intelligence, ciclo DATASET-002, no repositório atual do Predator News.

FONTES DE VERDADE

Antes de editar, leia integralmente:

1. AGENTS.md e instruções locais equivalentes;
2. documentação permanente relevante em /docs;
3. PREDATOR_INTELLIGENCE_EXPANSAO_ACERVO_INGESTAO_JURISPRUDENCIAL.md;
4. PACOTE_CODEX_PREDATOR_INTELLIGENCE_DATASET_002.md;
5. ABERTURA_CODEX_INCREMENTO_B_PREDATOR_INTELLIGENCE.md;
6. ABERTURA_CODEX_INCREMENTO_C_PREDATOR_INTELLIGENCE.md;
7. relatórios dos Incrementos A, B e C;
8. ingestion/README.md, schemas, políticas e fixtures;
9. src/ingestion/, scripts/ingestion/ e tests/ingestion/;
10. schemas jurídicos, taxonomia, aliases, decisões, teses e fundamentos atuais, somente para leitura;
11. package.json, .gitignore, validadores, agregadores e build.

Se faltar fonte arquitetural obrigatória, pare e informe. Não reconstrua regras por memória.

BASELINE INFORMADO

- Incrementos A, B e C aprovados com pendências não bloqueantes;
- 78/78 testes aprovados: 63 herdados e 15 do Incremento C;
- sete schemas operacionais;
- classificação local determinística e taxonomia imutável/versionada;
- revisão humana simulada, auditoria append-only e optimistic locking;
- exportação somente `.reviewed.json`, com `publishable: false`;
- zero JusRatio, zero serviço externo e zero consumo de cota;
- nenhum YAML canônico e nenhuma alteração jurídica/editorial.

Confirme o baseline real. Registre e explique divergências legítimas antes de avançar.

OBJETIVO

Implementar somente:

.reviewed.json sintético e elegível
→ verificação de versões e proveniência
→ transformação determinística
→ proposta canônica não oficial
→ gate final de deduplicação
→ validação estrutural e jurídica
→ diff e manifesto de promoção
→ simulação em cópia isolada
→ regressão e build de prova
→ rollback da simulação.

ESCOPO AUTORIZADO

A. Contrato de transformação

- Receba artefato revisado, versões do schema/taxonomia/acervo, política e relógio injetável.
- Aceite apenas revisão humana final válida, checklist completo e estado exportável.
- Registre identidade determinística da transformação.
- Nunca leia fila pendente como fonte alternativa nem complete campo ausente.

B. Mapeamento para proposta

- Use o schema, nomes, ordenação e convenções canônicas vigentes.
- Mapeie somente campos explicitamente revisados.
- Gere identificadores/slugs estáveis conforme regras existentes, sem colisão.
- Não infira identificação decisória, fonte, resumo, resultado, tese, fundamento ou qualquer texto jurídico.
- Não crie placeholder, string vazia sem significado, valor padrão jurídico ou `frase_peca` ausente.
- Não inclua confiança, evidência interna, revisor, fila ou outros dados operacionais no conteúdo proposto.

C. Proposta inequivocamente não oficial

- Use diretório, extensão ou envelope que não possa ser confundido com YAML canônico.
- Marque obrigatoriamente `canonical: false`, `publishable: false` e `promotion_status: proposed` ou equivalentes.
- Proíba que o build público consuma propostas.
- Um arquivo de proposta nunca pode ser copiado ao acervo sem etapa futura específica.

D. Proveniência e manifesto

- Mantenha proveniência fora do conteúdo jurídico proposto.
- Reconstrua candidato → classificação → revisão → decisão → transformação → proposta.
- Registre hashes/versões dos insumos e saída, `decision_id`, `candidate_id`, `batch_id`, referência da revisão, política e data.
- Registre itens elegíveis, propostos, bloqueados e excluídos com códigos de motivo.
- O manifesto é operacional e não entra em dist/.

E. Gates de obsolescência

- Bloqueie revisão superseded, devolvida, rejeitada, pendente ou com versão divergente.
- Bloqueie mudança de taxonomia, schema, política ou acervo desde as versões registradas.
- Bloqueie evidência ou hash de entrada inconsistente.
- Não atualize automaticamente a proposta: exija reprocessamento explícito.

F. Deduplicação final

- Reconstrua o índice a partir da versão atual do acervo, somente leitura.
- Execute deduplicação novamente imediatamente antes da simulação.
- Duplicado exato bloqueia; provável duplicado segue para decisão humana futura e não é promovível.
- Decisões distintas no mesmo processo não devem ser colapsadas.
- Mudança concorrente do acervo invalida o gate.
- Nunca sobrescreva registro ou ID canônico existente.

G. Validação da proposta

- Valide schema, enums, referências, IDs/slugs, unicidade, campos obrigatórios e proibições.
- Execute validadores jurídicos existentes sem relaxá-los.
- Falha deve conter código, caminho do campo e evidência técnica suficiente, sem mutar insumos.
- Produza diff semântico legível entre entrada revisada, proposta e eventual estado canônico comparável.
- O diff deve distinguir adição, mapeamento, omissão intencional e bloqueio.

H. Simulação isolada

- Crie cópia temporária e isolada do acervo necessário; nunca escreva em data/ ou equivalente oficial.
- Aplique somente propostas independentes e integralmente válidas na cópia.
- Rode validação de dados, testes jurídicos/agregação e build de prova contra a cópia, com mecanismo suportado pela stack.
- Não altere content/, layout, taxonomia, aliases, teses ou fundamentos.
- Garanta que saída pública de prova não seja confundida com dist/ oficial nem persistida no Git.

I. Rollback e idempotência

- A simulação deve ser descartável e reversível.
- Falha em qualquer gate não pode deixar alteração parcial no acervo oficial.
- Execuções idênticas produzem proposta, manifesto e diff semanticamente idênticos, exceto metadado temporal isolado.
- Nova execução não duplica proposta nem evento de manifesto.
- Demonstre limpeza/rollback mesmo após falha induzida.

REGRAS INEGOCIÁVEIS

- Somente fixtures sintéticas.
- Aprovação de revisão não é autorização de promoção.
- Nenhuma escrita em YAML canônico ou diretório oficial do acervo.
- Nenhuma incorporação automática ou manual nesta sessão.
- Nenhuma inferência de conteúdo jurídico.
- Nenhuma criação/alteração de taxonomia, aliases, enums, teses ou fundamentos.
- Nenhum `frase_peca` criado, inferido, preenchido ou usado como placeholder.
- Nenhum dado operacional dentro da proposta jurídica.
- Duplicado exato, provável duplicado ou versão obsoleta não é promovível.
- Zero JusRatio, rede, credencial, serviço externo ou consumo de cota.
- Publisher permanece desligado.
- Propostas, manifestos, diffs, sandboxes e builds de prova ficam fora de dist/ e do Git.
- Não fazer commit, push, PR ou publicação.
- Não avançar para o Incremento E.

FASE 1 — INSPEÇÃO

1. Verifique branch, status e alterações locais; preserve tudo que não pertence ao escopo.
2. Confirme baseline e relatórios A–C.
3. Localize schema, ordenação, IDs, slugs, enums, referências e validadores canônicos.
4. Identifique exatamente quais campos do `.reviewed.json` têm destino canônico autorizado.
5. Mapeie campos exclusivamente humanos e campos proibidos.
6. Confirme índice/deduplicação e gates concorrentes já existentes.
7. Confirme como executar validação e build contra raiz/diretório injetável sem tocar no acervo.
8. Apresente plano curto e matriz origem → destino → regra antes de editar.

Pare diante de conflito material, ausência de fonte de verdade ou necessidade de relaxar gate. Para decisões internas reversíveis, use a menor solução compatível.

FASE 2 — IMPLEMENTAÇÃO

- Reutilize módulos existentes e funções puras.
- Injete filesystem/root de acervo, relógio e gerador de IDs quando necessário.
- Separe transformação, validação, deduplicação, diff, manifesto e sandbox.
- Faça escrita atômica somente em diretórios operacionais/simulados.
- Mantenha todo artefato efêmero fora do Git e do build.
- Não instale dependência sem necessidade demonstrada.

FASE 3 — TESTES MÍNIMOS

Cubra, no mínimo:

1. apenas `.reviewed.json` elegível entra no transformador;
2. approve/correct válido torna elegível, mas não autoriza promoção;
3. pending, returned, rejected e superseded são bloqueados;
4. checklist incompleto bloqueia;
5. versão obsoleta de revisão bloqueia;
6. mudança de taxonomia bloqueia;
7. mudança de schema bloqueia;
8. mudança da política bloqueia;
9. mudança concorrente do acervo bloqueia;
10. hash/evidência de entrada inconsistente bloqueia;
11. transformação é determinística;
12. alteração legítima de versão muda a identidade da transformação;
13. apenas campos revisados são mapeados;
14. campo ausente não é inferido nem preenchido;
15. tese, fundamento, resultado, fonte ou resumo ausente não é criado;
16. `frase_peca` ausente permanece ausente;
17. proposta não contém confiança, evidência, revisor ou fila;
18. proposta é marcada como não canônica e não publicável;
19. proposta não usa caminho/extensão oficial;
20. IDs/slugs são estáveis e colisões bloqueiam;
21. enum desconhecido bloqueia sem mutar taxonomia;
22. referência inexistente bloqueia;
23. schema jurídico inválido bloqueia;
24. duplicado exato é bloqueado antes da simulação;
25. provável duplicado é preservado para decisão e não promovido;
26. decisões distintas no mesmo processo não são colapsadas;
27. sobrescrita de registro canônico é impossível;
28. manifesto reconstrói a proveniência integral;
29. bloqueados e excluídos aparecem com motivo;
30. diff distingue adição, omissão e bloqueio;
31. simulação escreve somente na cópia isolada;
32. acervo oficial permanece byte a byte inalterado;
33. integração parcial só aceita itens independentes e válidos;
34. falha de um item não promove parcialmente esse item;
35. validação jurídica roda sobre a cópia;
36. build de prova roda sobre a cópia e não em dist/ oficial;
37. rollback remove a simulação após sucesso;
38. rollback remove a simulação após falha induzida;
39. repetição idêntica não duplica proposta/manifesto;
40. propostas e artefatos operacionais não aparecem em dist/;
41. 78 testes herdados e validações preexistentes permanecem aprovados;
42. não há diferença em data/, schemas jurídicos, taxonomia, aliases, teses, fundamentos ou content/;
43. não há rede, credencial, JusRatio ou consumo de cota;
44. nenhum YAML canônico é criado ou modificado.

FASE 4 — VALIDAÇÃO

Registre:

- baseline e status antes/depois;
- suíte completa e novos testes;
- schemas operacionais e jurídicos;
- execução reproduzível da proposta;
- gate final de deduplicação;
- validação de dados e agregação na cópia;
- build de prova isolado;
- rollback após sucesso e falha;
- git diff --check e scanner de segredos;
- inspeção de dist/ e artefatos públicos;
- hashes/diff do acervo e áreas protegidas antes/depois;
- prova de ausência de rede.

ENTREGA OBRIGATÓRIA

Apresente:

1. classificação final;
2. baseline confirmado;
3. resumo e árvore de arquivos;
4. matriz origem → destino → regra de mapeamento;
5. contrato da proposta e distinção do YAML oficial;
6. gates de elegibilidade, obsolescência e deduplicação;
7. formato do manifesto e cadeia de proveniência;
8. diff legível e códigos de bloqueio;
9. funil: revisados, elegíveis, propostos, duplicados exatos, prováveis, inválidos, bloqueados e simulados;
10. tabela dos 44 cenários e resultados;
11. comandos de validação e resultados;
12. prova da simulação, build e rollback;
13. riscos e decisões humanas pendentes;
14. confirmação de zero JusRatio, rede, serviço externo e cota;
15. confirmação de que acervo oficial e áreas jurídicas/editoriais permaneceram inalterados;
16. confirmação de que nenhum YAML canônico foi criado/modificado;
17. proposta objetiva para o Incremento E, sem implementá-lo.

Não faça commit, push, PR ou publicação. Encerre ao concluir o Incremento D.
```

---

## 4. Backlog fechado

| ID | Entrega | Prioridade | Critério de conclusão |
| --- | --- | --- | --- |
| D-00 | Baseline e inventário canônico | P0 | A–C confirmados; schema, IDs, referências e validadores mapeados |
| D-01 | Matriz de transformação | P0 | origem → destino → regra; campos proibidos explícitos |
| D-02 | Contrato e transformador determinístico | P0 | somente revisados elegíveis geram proposta não oficial |
| D-03 | Schema da proposta e política | P0 | proposta não publicável, sem dados operacionais ou inferências |
| D-04 | Manifesto e proveniência | P0 | cadeia completa e estados de todos os itens reconstruíveis |
| D-05 | Gates de versão e elegibilidade | P0 | divergências bloqueadas em modo fail-closed |
| D-06 | Deduplicação final | P0 | exatos e prováveis não promovíveis; concorrência detectada |
| D-07 | Validação e diff semântico | P0 | schema/referências/enums/IDs válidos e diff inspecionável |
| D-08 | Sandbox de promoção e rollback | P0 | simulação isolada, build de prova e limpeza integral |
| D-09 | Regressão e relatório | P0 | 44 cenários, áreas protegidas intactas e relatório reproduzível |

### Ordem obrigatória

`D-00 → D-01 → D-02/D-03 → D-04 → D-05 → D-06 → D-07 → D-08 → D-09`

D-02 e D-03 podem evoluir em paralelo lógico. Nenhuma simulação começa antes de D-05, D-06 e D-07 aprovados.

---

## 5. Estrutura inicial sugerida

```text
src/ingestion/
├── promotion/
│   ├── proposal-contract.mjs
│   ├── reviewed-transformer.mjs
│   ├── promotion-eligibility.mjs
│   ├── promotion-manifest.mjs
│   ├── semantic-diff.mjs
│   ├── final-dedup-gate.mjs
│   ├── proposal-validator.mjs
│   └── promotion-sandbox.mjs
└── index.mjs

ingestion/
├── config/
│   └── promotion-policy.example.yaml
├── schemas/
│   ├── canonical-proposal.schema.json
│   └── promotion-manifest.schema.json
├── fixtures/simulated-promotion/
├── proposals/
├── manifests/
├── diffs/
└── sandboxes/

scripts/ingestion/
└── run-simulated-promotion.mjs

tests/ingestion/
└── increment-d.test.mjs

docs/predator-intelligence/
└── relatorio-incremento-d.md
```

`proposals/`, `manifests/`, `diffs/` e `sandboxes/` são operacionais e devem ficar fora do Git e do build; apenas fixtures, schemas, políticas-modelo e relatório selecionado podem ser rastreados.

---

## 6. Contratos conceituais mínimos

### 6.1 Envelope da proposta

```yaml
proposal_id: proposal-synthetic-001
canonical: false
publishable: false
promotion_status: proposed
source_review_id: review-synthetic-001
transform_identity: sha256:...
payload:
  # projeção limitada aos campos efetivamente revisados
```

O `payload` deve respeitar o schema real encontrado no repositório. O envelope nunca deve ser aceito pelos loaders do acervo oficial.

### 6.2 Manifesto separado

```yaml
proposal_id: proposal-synthetic-001
candidate_id: candidate-synthetic-001
classification_id: classification-synthetic-001
review_record: review-synthetic-001
decision_id: decision-synthetic-001
batch_id: batch-synthetic-001
input_hash: sha256:...
output_hash: sha256:...
taxonomy_version: sha256:...
schema_version: sha256:...
canonical_index_version: sha256:...
policy_version: 1
status: proposed
generated_at: 2026-08-08T00:00:00Z
```

Valores são ilustrativos e sintéticos. A versão definitiva deve seguir as convenções do repositório.

---

## 7. Códigos mínimos de bloqueio

| Código | Situação |
| --- | --- |
| `review_not_eligible` | estado/decisão humana não permite proposta |
| `review_version_stale` | versão de revisão divergente |
| `taxonomy_version_stale` | taxonomia mudou |
| `schema_version_stale` | schema jurídico mudou |
| `canonical_index_stale` | acervo mudou durante o gate |
| `input_integrity_failed` | hash/evidência não confere |
| `unreviewed_field` | tentativa de mapear campo não revisado |
| `forbidden_inference` | conteúdo ausente seria completado/inferido |
| `invalid_reference` | referência canônica inexistente |
| `identifier_collision` | ID/slug colide com o acervo |
| `exact_duplicate` | unidade decisória já existe |
| `probable_duplicate` | correspondência exige decisão humana futura |
| `canonical_write_attempt` | tentativa de tocar o acervo oficial |

---

## 8. Gate de encerramento

O Incremento D só poderá ser encerrado quando:

- propostas forem determinísticas, não oficiais e inequivocamente não publicáveis;
- somente campos revisados forem mapeados;
- nenhuma inferência jurídica ou `frase_peca` for produzida;
- dados operacionais permanecerem fora do conteúdo jurídico;
- versões e integridade forem verificadas em modo fail-closed;
- deduplicação final usar a versão atual do acervo;
- diff e proveniência permitirem revisão integral;
- a simulação ocorrer apenas em cópia isolada;
- validação, regressão e build de prova forem aprovados;
- rollback funcionar após sucesso e falha;
- o acervo oficial permanecer byte a byte inalterado;
- nenhum artefato operacional entrar em `dist/` ou Git;
- zero rede, JusRatio, credencial, serviço externo e cota forem comprovados;
- nenhum YAML canônico for criado ou modificado.

Qualquer necessidade de dados reais, alteração canônica, relaxamento de schema/taxonomia, integração com Publisher ou autorização operacional de promoção é **bloqueio de escopo**.

---

## 9. Pendências deliberadamente adiadas

Antes de promoção real, permanecem pendentes:

- identidade e poderes dos autorizadores finais;
- exigência de uma ou duas aprovações;
- política de segregação entre revisor e promotor;
- SLA e retenção de propostas/manifestações;
- tratamento de dados pessoais reais;
- estratégia de IDs para lotes reais;
- resolução humana de prováveis duplicados;
- autorização formal para escrever no acervo;
- estratégia de commit, PR, rollback Git e publicação;
- eventual integração com Publisher.

Essas decisões não bloqueiam o Incremento D sintético, mas bloqueiam qualquer promoção real.

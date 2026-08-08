# Abertura Codex — Incremento B da Predator Intelligence

**Projeto:** Predator News — Predator Intelligence  
**Ciclo de dados:** DATASET-002  
**Incremento:** B — IN03 + IN04  
**Data de abertura:** 08/08/2026  
**Status:** pronto para execução técnica controlada  
**Modo:** exclusivamente local e simulado

---

## 1. Decisão de abertura

O Incremento A — IN01 + IN02 está aceito como **APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES**.

Fica autorizada a abertura do Incremento B, limitada à construção e validação local de:

1. contrato agnóstico do adaptador de recuperação;
2. adaptador integralmente simulado;
3. fixtures determinísticas;
4. paginação interrompível e retomável;
5. snapshots brutos sintéticos, sujeitos a política configurável;
6. pré-deduplicação por metadados;
7. normalização e deduplicação multicamada;
8. gates de idempotência, regressão e isolamento.

Esta abertura **não autoriza** acesso real ao JusRatio, consumo de cota, descoberta de endpoints, scraping, classificação jurídica, revisão humana, geração de YAML canônico, alteração do acervo, integração com Publisher ou operação Git externa.

---

## 2. Prompt-mestre para o Codex

Copie integralmente o bloco abaixo para uma nova sessão do Codex apontada para o repositório local atualizado do Predator News.

```text
Trabalhe no repositório atual do Predator News para implementar exclusivamente o Incremento B — IN03 + IN04 — da Predator Intelligence, ciclo DATASET-002.

CONTEXTO E FONTES DE VERDADE

Antes de alterar arquivos, leia integralmente:

1. AGENTS.md e instruções locais equivalentes, se existirem;
2. documentação permanente relevante em /docs;
3. PREDATOR_INTELLIGENCE_EXPANSAO_ACERVO_INGESTAO_JURISPRUDENCIAL.md;
4. PACOTE_CODEX_PREDATOR_INTELLIGENCE_DATASET_002.md;
5. docs/predator-intelligence/relatorio-incremento-a.md;
6. ingestion/README.md, configurações, schemas e fixtures;
7. src/ingestion/, scripts/ingestion/ e tests/ingestion/;
8. package.json, .gitignore, scripts de validação e build;
9. schemas, taxonomia, aliases e acervo jurídico atuais, apenas para compreender contratos e deduplicação, sem alterá-los.

Se qualquer um dos dois documentos arquiteturais dos itens 3 e 4 estiver ausente, pare e informe a ausência. Não reconstrua suas regras por memória.

ESTADO HERDADO DO INCREMENTO A

Considere como baseline informado:

- fundação isolada em ingestion/;
- quatro schemas operacionais;
- fingerprint SHA-256 determinístico e versionado;
- cache com hit, expired, invalidated e miss;
- ledger JSONL append-only;
- budget guard fail-closed;
- manifesto atômico e idempotente;
- 48 testes aprovados, sendo 36 preexistentes e 12 novos;
- validação dos quatro schemas, do acervo jurídico e do build;
- ausência de artefatos de ingestão em dist/;
- zero consulta ao JusRatio e zero alteração jurídica ou editorial.

Antes de implementar o Incremento B, verifique esse baseline no repositório real.

PENDÊNCIAS DOCUMENTAIS DO INCREMENTO A

Resolva no relatório, sem ampliar indevidamente o código:

1. produza uma matriz que relacione os 14 cenários mínimos previstos no pacote aos testes que efetivamente os cobrem;
2. se algum cenário não estiver coberto, implemente apenas o teste faltante necessário para fechar o baseline antes do Incremento B;
3. descreva “hard stop real pendente” como “limite operacional ainda não configurado”, deixando claro que o mecanismo já existe e permanece fail-closed.

OBJETIVO DESTA EXECUÇÃO

Implementar somente a trajetória simulada:

plano de consulta sintético
→ autorização local do budget guard quando aplicável
→ listagem simulada paginada
→ checkpoint persistido
→ snapshot bruto sintético
→ normalização
→ pré-deduplicação
→ detalhe simulado apenas para elegíveis
→ deduplicação completa
→ lote de candidatos operacionais
→ relatório local.

ESCOPO AUTORIZADO

A. Contrato do adaptador

- Defina uma interface agnóstica de provedor para listagem e detalhe.
- Modele capacidades, entradas, resultados, paginação, erros e custo estimado sem inventar endpoints do JusRatio.
- Toda operação marcada como onerosa deve exigir autorização válida do budget guard.
- O contrato não pode permitir uma chamada direta que contorne orçamento, ledger ou cache.
- O domínio de ingestão não deve depender de nomes, payloads ou peculiaridades presumidas do JusRatio.

B. Adaptador simulado

- Implemente somente um adaptador em memória ou baseado em fixtures locais.
- Use fixtures determinísticas, sintéticas e sem dados pessoais reais.
- Permita simular páginas, detalhes, vazio, repetição, erro transitório, erro definitivo e interrupção.
- Registre contadores locais para provar quando uma chamada simulada foi ou não executada.
- Não crie adaptador real, stub de rede funcional, URL, seletor, cookie, header ou variável de credencial.

C. Paginação retomável

- Persista checkpoint com versão, fingerprint, cursor opaco simulado, página concluída e estado.
- Faça escrita atômica e validação antes da retomada.
- Retome da última unidade confirmada sem repetir silenciosamente páginas concluídas.
- Trate cursor ausente, expirado, incompatível, corrompido e pertencente a outro fingerprint.
- A retomada deve ser idempotente e auditável.
- Nenhum estado efêmero pode entrar no Git ou no build público.

D. Snapshots brutos sintéticos

- Separe rigorosamente resposta bruta, registro normalizado e candidato.
- Armazene apenas snapshots gerados pelo adaptador simulado.
- A política de retenção deve permanecer configurável e inoperante para dados reais enquanto não definida.
- Snapshot inválido ou incompatível deve falhar de modo seguro.
- Não use decisões reais recuperadas de qualquer fonte externa nesta execução.

E. Pré-deduplicação

- Compare metadados de listagem contra o lote em formação e contra um índice derivado do acervo atual.
- Use chaves fortes quando presentes e sinais auxiliares explicitamente documentados.
- Chave forte já existente deve impedir a recuperação simulada de detalhe.
- Correspondência provável nunca deve ser descartada automaticamente: marque para revisão futura.
- Ausência de chave forte não equivale a item novo.

F. Normalização e deduplicação completa

- Normalize CNJ somente por regra formal e testável; não invente dígitos nem complete identificadores parciais.
- Preserve valor original e valor normalizado.
- Distinga decisões diferentes do mesmo processo por identificadores e metadados adequados.
- Defina resultados explícitos, como exact_duplicate, probable_duplicate, distinct_decision, insufficient_evidence e invalid.
- Execute um gate final contra uma leitura atual do acervo, sem modificar o acervo.
- Produza razões e evidências estruturadas para cada resultado.

REGRAS INEGOCIÁVEIS

- JusRatio é origem futura de recuperação, não fonte jurídica canônica.
- Nesta execução, “adaptador JusRatio” significa apenas o contrato de fronteira e seu fake local.
- Zero tráfego de rede relacionado ao JusRatio.
- Zero consumo de cota.
- Zero tentativa de descobrir API, endpoint, HTML, autenticação ou condições comerciais.
- Nenhum candidato entra no acervo canônico.
- Nenhuma classificação jurídica assistida será implementada.
- Nenhuma taxonomia, alias jurídico, tese, fundamento ou enum canônico será criado ou alterado.
- Nenhum YAML canônico de decisão será gerado.
- Nenhum conteúdo editorial, layout ou Publisher será alterado.
- Nenhum dado bruto, checkpoint, cache ou relatório operacional entra no build público.
- Não fornecer nem solicitar credenciais.
- Não fazer commit, push, PR ou publicação.
- Não avançar para o Incremento C nesta sessão.

FASE 1 — INSPEÇÃO SOMENTE LEITURA

1. Verifique branch, status e alterações locais; preserve mudanças não relacionadas.
2. Confirme a implementação e os testes do Incremento A.
3. Mapeie os pontos de extensão disponíveis em src/ingestion/.
4. Localize o formato canônico atual apenas para construir um índice de deduplicação em memória.
5. Identifique quais campos jurídicos existentes podem atuar como chaves ou sinais sem criar nova semântica.
6. Confirme comandos oficiais de teste, validação e build.
7. Apresente um plano curto com arquivos a criar e modificar antes de editar.

Pare para solicitar decisão somente se houver conflito material entre a arquitetura e o repositório. Não transforme escolhas internas reversíveis em bloqueios desnecessários.

FASE 2 — IMPLEMENTAÇÃO

Implemente na menor superfície compatível com a stack existente. Prefira módulos puros, dependências injetáveis, relógio injetável e fixtures determinísticas.

A implementação deve:

- reutilizar budget guard, ledger, cache, manifesto e fingerprint do Incremento A;
- impedir por construção que o fake seja confundido com adaptador real;
- manter checkpoints e snapshots fora de versionamento e build;
- preservar a possibilidade de substituir o fake por um adaptador real futuro sem acoplar o domínio;
- documentar os limites entre correspondência exata, provável e evidência insuficiente;
- evitar algoritmos probabilísticos opacos nesta fase;
- gerar relatório reproduzível do funil simulado.

FASE 3 — TESTES MÍNIMOS DO INCREMENTO B

Implemente testes que cubram, no mínimo:

1. o contrato rejeita operação onerosa sem autorização válida;
2. o adaptador simulado jamais realiza tráfego de rede;
3. fixture idêntica produz resultado idêntico em reexecuções;
4. listagem com duas páginas preserva ordem e cursor;
5. interrupção após a primeira página retoma na segunda sem repetir a primeira;
6. checkpoint corrompido falha de modo seguro;
7. checkpoint de outro fingerprint é rejeitado;
8. retry transitório é auditável e respeita a política configurada;
9. repetição de página não duplica item no lote;
10. snapshot bruto permanece separado do registro normalizado;
11. chave forte existente bloqueia a busca simulada de detalhe;
12. duplicidade dentro do próprio lote é identificada antes do detalhe;
13. correspondência provável é preservada para revisão futura, não descartada;
14. duas decisões distintas do mesmo processo não são colapsadas;
15. CNJ inválido não é corrigido por inferência;
16. original e normalizado permanecem rastreáveis;
17. gate final detecta alteração concorrente simulada no índice do acervo;
18. reexecução completa é idempotente;
19. cache elegível evita repetição da operação simulada e registra consumo zero;
20. snapshots, checkpoints e lotes efêmeros não aparecem em dist/;
21. os testes e validações preexistentes continuam aprovados;
22. nenhuma diferença é produzida em data/, schemas jurídicos ou content/.

FASE 4 — VALIDAÇÃO

Execute os comandos oficiais do projeto e registre:

- baseline antes da edição;
- testes do Incremento A e matriz dos 14 cenários;
- novos testes do Incremento B;
- validação dos schemas operacionais;
- validação do acervo jurídico;
- build completo;
- git diff --check;
- scanner de segredos disponível;
- inspeção da saída pública;
- prova local de que nenhuma chamada de rede foi realizada;
- diferenças em acervo, schemas jurídicos, taxonomia e conteúdo editorial.

Não instale dependência nova sem necessidade demonstrada. Se a instalação exigir rede ou ampliar a superfície do projeto, pare e proponha a alternativa antes de agir.

ENTREGA OBRIGATÓRIA

Ao final, apresente:

1. classificação do incremento: APROVADO, APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES ou BLOQUEADO;
2. resumo do que foi implementado;
3. árvore dos arquivos criados e modificados;
4. matriz dos 14 cenários herdados do Incremento A;
5. tabela dos testes do Incremento B e seus resultados;
6. decisões técnicas e regras de deduplicação adotadas;
7. funil da execução simulada: listados, pré-duplicados exatos, prováveis, detalhes simulados, duplicados finais, distintos, inválidos e insuficientes;
8. comandos de validação e resultados;
9. riscos e parâmetros operacionais ainda pendentes;
10. confirmação expressa de zero consulta ao JusRatio e zero consumo de cota;
11. confirmação expressa de que acervo, schemas jurídicos, taxonomia, teses, fundamentos, Publisher, layout e conteúdo editorial não foram alterados;
12. proposta objetiva para o Incremento C, sem implementá-lo.

Não faça commit, push, PR ou publicação. Encerre a sessão ao concluir o Incremento B.
```

---

## 3. Backlog fechado do Incremento B

| ID | Entrega | Prioridade | Critério de conclusão |
| --- | --- | --- | --- |
| B-00 | Reconciliação do Incremento A | P0 | matriz dos 14 cenários e correção terminológica do hard stop |
| B-01 | Contrato agnóstico de recuperação | P0 | operações, paginação, erros e autorização definidos sem detalhes inventados do provedor |
| B-02 | Adaptador exclusivamente simulado | P0 | fixtures determinísticas e cenários de sucesso, vazio, erro e interrupção |
| B-03 | Checkpoint e paginação retomável | P0 | retomada idempotente, atômica e vinculada ao fingerprint |
| B-04 | Snapshots sintéticos | P0 | separação raw/normalized/candidate e retenção configurável |
| B-05 | Índice derivado do acervo | P0 | leitura somente, versão identificável e nenhuma mutação canônica |
| B-06 | Pré-deduplicação | P0 | duplicados fortes evitam detalhe; prováveis seguem preservados |
| B-07 | Deduplicação completa | P0 | resultados estruturados, razões, evidências e decisões distintas preservadas |
| B-08 | Runner do lote simulado | P1 | funil reproduzível sem rede e sem produção de YAML canônico |
| B-09 | Gate de regressão e relatório | P0 | testes, validações, build, isolamento e zero diferenças jurídicas/editoriais |

### Ordem obrigatória

`B-00 → B-01 → B-02 → B-03/B-04 → B-05 → B-06 → B-07 → B-08 → B-09`

B-03 e B-04 podem ser desenvolvidos em paralelo lógico, mas o gate final deve validar a integração dos dois.

---

## 4. Estrutura sugerida

A árvore é indicativa e deve ser adaptada às convenções reais encontradas:

```text
src/ingestion/
├── adapters/
│   ├── recovery-adapter.mjs
│   └── simulated-recovery-adapter.mjs
├── checkpoint.mjs
├── snapshot.mjs
├── normalization.mjs
├── canonical-index.mjs
├── pre-deduplication.mjs
├── deduplication.mjs
└── simulated-batch-runner.mjs

ingestion/
├── config/
│   ├── retention-policy.example.yaml
│   └── deduplication-policy.yaml
├── fixtures/
│   └── simulated-provider/
├── snapshots/
├── state/
└── reports/

tests/ingestion/
├── adapter-contract.test.mjs
├── simulated-adapter.test.mjs
├── checkpoint.test.mjs
├── snapshot.test.mjs
├── pre-deduplication.test.mjs
├── deduplication.test.mjs
└── simulated-pipeline.test.mjs

docs/predator-intelligence/
└── relatorio-incremento-b.md
```

Os diretórios `snapshots/`, `state/`, lotes temporários e relatórios operacionais não selecionados devem permanecer fora do Git e do build público.

---

## 5. Gate de encerramento

O Incremento B só poderá ser encerrado quando:

- os 14 cenários do Incremento A estiverem rastreados a testes;
- o pipeline simulado puder ser interrompido, retomado e reexecutado sem duplicação;
- duplicados fortes forem eliminados antes do detalhe simulado;
- correspondências prováveis forem preservadas para futura revisão humana;
- decisões distintas do mesmo processo não forem colapsadas;
- o acervo for consultado apenas em modo de leitura;
- os testes, validações e build estiverem aprovados;
- nenhum artefato operacional aparecer em `dist/`;
- não houver diferenças jurídicas ou editoriais;
- estiver comprovado que nenhuma consulta real ou consumo de cota ocorreu.

Qualquer necessidade de acesso real ao JusRatio é um **bloqueio de escopo**, não uma autorização implícita. Nesse caso, o Codex deve parar e relatar a dependência.

---

## 6. Itens que continuam pendentes para ciclos futuros

Permanecem deliberadamente indefinidos:

1. modalidade técnica e contratual de acesso ao JusRatio;
2. cota mensal e custos por operação;
3. hard stop e reservas absolutas;
4. TTL por tipo de consulta;
5. retenção permitida de snapshots reais;
6. tribunais, período e produtos do lote real;
7. limite de candidatos e fila de revisão;
8. papéis e responsáveis pela revisão humana;
9. limiares de classificação assistida;
10. integração com o Publisher.

Essas pendências não bloqueiam o adaptador simulado nem a deduplicação local. Bloqueiam qualquer chamada externa e a execução real do DATASET-002.

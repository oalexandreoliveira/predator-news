# Abertura Codex — Incremento F da Predator Intelligence

**Projeto:** Predator News — Predator Intelligence  
**Ciclo de dados:** DATASET-002  
**Incremento:** F — IN11 + IN12  
**Título:** Autorização final e promoção canônica controlada  
**Data de abertura:** 08/08/2026  
**Status:** consolidado; execução condicionada a autorização humana externa válida  
**Modo:** local, transacional, fail-closed e sem publicação

---

## 1. Decisão de abertura

O Incremento E — IN09 + IN10 está aceito como **APROVADO COM PENDÊNCIAS NÃO BLOQUEANTES**, com prontidão `CONDITIONAL_GO` apenas para solicitar autorização.

Este documento formaliza o Incremento F, mas **não concede autorização para executá-lo**. A solicitação de consolidação, a existência do pedido emitido no Incremento E, a aprovação técnica dos ciclos anteriores ou a condição `ready_for_authorization=true` não equivalem a consentimento para promoção.

O Incremento F possui duas fases independentes:

1. **IN11 — Autorização final:** receber, validar e congelar uma autorização humana externa, inequívoca, íntegra, vigente e compatível com o pacote;
2. **IN12 — Promoção canônica controlada:** promover exclusivamente os arquivos autorizados, com transação local, validação pós-escrita e rollback verificável.

Sem autorização válida, o resultado correto é `NO_GO`, sem escrita em `data/`, sem alteração do Git e sem tentativa de contornar o gate.

---

## 2. Limites de autoridade

### 2.1 Capacidades independentes

| Capacidade | Efeito | Estado inicial |
| --- | --- | --- |
| `validate_authorization` | valida o artefato autorizativo | permitida |
| `write_canonical_local` | cria os YAMLs previstos no plano | negada até autorização válida |
| `commit_local` | registra commit no repositório real | negada |
| `push_remote` | envia alterações ao remoto | negada |
| `open_pr` | abre pull request | negada |
| `merge` | integra branch | negada |
| `publish` | publica site ou aciona Publisher | negada |

Uma capacidade não implica outra. Em especial, autorização para escrita local não autoriza commit, push, PR, merge ou publicação.

### 2.2 Estados formais

```json
{
  "authorization_validated": false,
  "promotion_authorized": false,
  "promotion_started": false,
  "canonical_write_completed": false,
  "post_write_validation_passed": false,
  "rollback_required": false,
  "git_operation_authorized": false,
  "publication_authorized": false
}
```

Somente o validador de autorização pode mudar `promotion_authorized` para `true`, e apenas na memória/execução vinculada ao pacote exato. Nenhum arquivo de configuração, variável de ambiente isolada, flag de CLI ou edição manual de estado pode fazê-lo.

### 2.3 Segregação de funções

Devem permanecer distinguíveis:

- revisor jurídico;
- resolvedor de duplicidade;
- preparador do pacote;
- autorizador 1;
- autorizador 2, quando exigido;
- executor da promoção;
- verificador pós-promoção.

O preparador não autoriza o próprio pacote. O executor não pode suprir aprovação ausente. As aprovações exigidas devem pertencer a identidades reais, distintas, autenticadas por mecanismo previamente aceito e vinculadas ao mesmo digest autorizativo.

---

## 3. Pré-condições obrigatórias

Antes de qualquer edição canônica, devem estar simultaneamente presentes:

1. relatório final do Incremento E aprovado;
2. pedido formal de autorização do `DATASET-002`;
3. manifesto, proposta, plano, diff, impacto e rollback com hashes congelados;
4. decisão humana final sobre toda duplicidade provável;
5. autorização externa dentro da validade temporal;
6. identidades e papéis dos autorizadores verificáveis;
7. número de aprovações exigido pela política;
8. digest autorizativo idêntico para todas as aprovações;
9. lista exata de arquivos e operações autorizadas;
10. baseline Git, acervo, schemas, taxonomia e políticas idênticos aos autorizados;
11. worktree sem alterações conflitantes nos alvos;
12. backup/pre-image verificável de cada alvo;
13. plano de rollback executável e correspondente um a um;
14. janela operacional e responsável pela recuperação definidos;
15. autorização expressa limitada a `write_canonical_local`, salvo escopo adicional separado.

Qualquer ausência ou divergência bloqueia a promoção antes da primeira escrita.

---

## 4. Prompt-mestre para o Codex

Copie integralmente o bloco abaixo para uma nova sessão do Codex apontada para o repositório local atualizado do Predator News.

```text
Implemente exclusivamente o Incremento F — IN11 + IN12 — da Predator Intelligence, ciclo DATASET-002, no repositório atual do Predator News.

ATENÇÃO SOBRE AUTORIDADE

Este prompt formaliza o ciclo, mas não constitui autorização de promoção.
Comece em modo de inspeção. Não escreva em data/, não altere Git e não promova qualquer proposta enquanto não existir um artefato externo de autorização final que satisfaça integralmente o contrato e as políticas abaixo.

Se a autorização estiver ausente, incompleta, ambígua, expirada, revogada, não verificável ou vinculada a hashes/versões diferentes, encerre em NO_GO antes de qualquer escrita canônica. Não peça para o usuário colar segredos, tokens ou credenciais no chat.

FONTES DE VERDADE

Antes de editar, leia integralmente:

1. AGENTS.md e instruções locais equivalentes;
2. documentação permanente relevante em /docs;
3. aberturas e relatórios dos Incrementos A–F;
4. relatório e pedido formal do Incremento E;
5. manifesto, políticas, planos, diffs, impacto e rollback do DATASET-002;
6. ingestion/README.md, schemas, configurações e fixtures;
7. src/ingestion/, scripts/ingestion/ e tests/ingestion/;
8. schemas jurídicos, taxonomia, aliases, decisões, teses e fundamentos;
9. package.json, .gitignore, validadores, build e configuração Git relevante;
10. eventual artefato externo de autorização final, sem inferir sua existência.

Se faltar fonte obrigatória, pare e informe. Não reconstrua regras por memória.

BASELINE INFORMADO

- Incrementos A–E aprovados com pendências não bloqueantes;
- Incremento E com readiness_decision=CONDITIONAL_GO;
- 115/115 testes aprovados;
- 13 schemas operacionais válidos;
- acervo com 10 decisões, 1 tese e 6 fundamentos;
- HEAD informado no encerramento E: f5d4056ab838ee95164fbaab66aa0e463f8037b0;
- branch informada: main;
- nenhum arquivo staged;
- dry_run_completed=true;
- ready_for_authorization=true;
- authorization_requested=true;
- promotion_authorized=false;
- zero escrita canônica, rede, JusRatio, cota, Publisher, push, PR ou publicação.

Confirme o baseline real. Divergência não explicada é bloqueante; não force restauração nem descarte alterações do usuário.

OBJETIVO

pedido de autorização do Incremento E
→ validação do artefato externo de autorização
→ congelamento do pacote e das capacidades concedidas
→ reconciliação final de baseline, hashes e duplicidade
→ preflight sem escrita
→ checkpoint e pre-image dos alvos
→ promoção local transacional da proposta autorizada
→ validação estrutural, jurídica e de build
→ reconciliação do diff real com o autorizado
→ sucesso controlado OU rollback automático
→ relatório e recibo de promoção.

ESCOPO AUTORIZADO PARA IMPLEMENTAÇÃO

A. Contrato da autorização final

- Defina schema operacional para autorização externa, separado do pedido do Incremento E.
- Exija authorization_id, dataset_id, package_digest, manifest_hash, proposal_hash, plan_hash, rollback_hash, canonical_index_hash, taxonomy_hash, legal_schema_hash, policy_hash, issued_at, expires_at, authorizers, roles, decisions e capabilities.
- Exija decisão explícita approve ou deny; ausência nunca significa approve.
- Vincule todas as aprovações ao mesmo digest e à mesma lista fechada de arquivos.
- Modele revogação e expiração; a verificação deve ocorrer novamente imediatamente antes da escrita.
- Não implemente assinatura criptográfica caseira. Use apenas mecanismo de identidade/autenticidade já aprovado no projeto; se inexistente, bloqueie com authorization_authenticity_unverifiable.

B. Validador de capacidade e segregação

- Calcule a capacidade efetiva pela interseção entre autorização, política e ação solicitada.
- Negue por padrão capacidades desconhecidas ou ausentes.
- Valide papéis incompatíveis, identidades distintas e dupla aprovação quando exigida.
- Não aceite identidades sintéticas como autorizadores produtivos.
- Não permita ao executor editar, fabricar ou completar a autorização.
- Restrinja este ciclo a write_canonical_local, salvo concessão adicional inequívoca e separada.

C. Congelamento do pacote

- Gere package_digest determinístico sobre todos os artefatos autorizados.
- Preserve generated_at fora da identidade semântica, conforme arquitetura existente.
- Recalcule os hashes a partir dos bytes atuais; não confie apenas nos valores declarados.
- Mudança de qualquer artefato invalida a autorização e exige novo pedido.
- Nenhum arquivo pode entrar no plano após a autorização.

D. Preflight final

- Reexecute todos os gates A–E aplicáveis sem produzir efeito canônico.
- Confirme branch, HEAD, índice, worktree e inexistência de conflitos nos alvos.
- Confirme versões atuais do acervo, taxonomia, schema, política, revisão e proposta.
- Refaça a deduplicação imediatamente antes da escrita.
- probable_duplicate exige decisão humana final vinculada ao pacote.
- Revalide caminhos, symlinks, colisões case-insensitive, hashes anteriores e espaço necessário.
- Produza decisão GO/NO_GO. CONDITIONAL_GO não permite iniciar a escrita.

E. Pre-image e journal transacional

- Antes da primeira escrita, capture bytes, metadados e hashes dos alvos existentes.
- Para adições, registre explicitamente a inexistência anterior.
- Armazene pre-image e journal fora de dist/ e fora do conteúdo público, com acesso restrito e retenção definida.
- O journal deve registrar sequência, estado, operação, hash esperado, hash observado e resultado.
- Não inclua dados pessoais ou segredos desnecessários no journal.
- Se o checkpoint não puder ser criado e validado, não escreva.

F. Escrita canônica controlada

- Escreva exclusivamente os arquivos e operações presentes no plano autorizado.
- Use arquivos temporários no mesmo filesystem, fsync quando aplicável, rename atômico e permissões restritivas.
- Revalide autorização, baseline e hash anterior imediatamente antes de cada operação.
- Proíba deleção, renomeação, overwrite não planejado, caminho fora da allowlist e follow de symlink.
- Não gere conteúdo novo durante a promoção; aplique apenas a proposta previamente revisada e autorizada.
- Não crie frase_peca, tese, fundamento, alias ou categoria.

G. Validação pós-escrita

- Valide schemas operacionais e jurídicos.
- Execute validate:data, testes relevantes, suíte integral e build local.
- Reconcilie contagens, referências, IDs, páginas e invariantes.
- Compare o diff real byte a byte e semanticamente com o plano autorizado.
- Confirme ausência de artefatos operacionais em dist/.
- Qualquer falha antes do encerramento confirmado exige rollback.

H. Rollback automático

- Execute rollback em ordem inversa usando as pre-images validadas.
- Remova somente arquivos adicionados por esta transação e restaure somente alvos modificados por ela.
- Nunca use git reset --hard, checkout amplo, clean ou remoção recursiva de diretório amplo.
- Após rollback, revalide hashes, acervo, worktree e build.
- Se o rollback ficar incompleto, pare, preserve evidências e classifique como INCIDENT; não tente improvisar reparo destrutivo.

I. Recibo e auditoria

- Gere receipt determinístico contendo autorização, pacote, operações, hashes, timestamps operacionais, validações, executor, verificador e resultado.
- Estados finais permitidos: promoted, rolled_back, blocked e incident.
- Separe o recibo de promoção do conteúdo canônico.
- Auditoria deve ser append-only e não deve alterar o significado jurídico do acervo.

J. Git e publicação

- Não faça commit, branch, tag, push, PR, merge ou publicação neste ciclo sem capacidade específica adicional.
- Autorização de write_canonical_local não autoriza nenhuma operação Git.
- Mesmo que commit_local seja concedido futuramente, push_remote e open_pr continuam negados sem autorização própria.
- Publisher e deploy permanecem desligados.
- Não consulte JusRatio nem qualquer serviço externo.

REGRAS INEGOCIÁVEIS

- A consolidação do Incremento F não é autorização.
- Ausência ou dúvida resulta em NO_GO.
- authorization_requested não equivale a promotion_authorized.
- ready_for_authorization não equivale a promotion_authorized.
- CONDITIONAL_GO não autoriza escrita.
- Somente o pacote exato e os arquivos exatos podem ser promovidos.
- Nenhuma inferência ou geração jurídica durante a promoção.
- Nenhuma alteração de schemas jurídicos, taxonomia, aliases, teses ou fundamentos.
- Nenhum dado real novo, JusRatio, rede, SDK, credencial ou consumo de cota.
- Nenhuma edição de conteúdo editorial.
- Nenhum artefato operacional em dist/.
- Nenhuma publicação ou integração com Publisher.
- Preserve alterações preexistentes, especialmente scripts/build.mjs e src/style.css, caso ainda existam.

FASE 1 — INSPEÇÃO E DECISÃO DE AUTORIDADE

1. Verifique instruções, branch, HEAD, status, índice e alterações locais.
2. Confirme 115 testes, 13 schemas e o baseline jurídico.
3. Reconcilie os 55 cenários do Incremento E.
4. Localize e verifique todos os artefatos do DATASET-002.
5. Procure o artefato externo de autorização apenas nos locais declarados pelo projeto.
6. Valide autenticidade, validade, revogação, papéis, capacidades, hashes e escopo.
7. Emita AUTHORIZED ou NO_GO antes de planejar qualquer escrita.

Se o resultado for NO_GO, não implemente atalhos, não altere data/ e encerre com relatório do bloqueio. Código e testes do mecanismo de promoção podem ser implementados apenas contra fixtures sintéticas em sandbox, sem tratar isso como promoção real.

FASE 2 — IMPLEMENTAÇÃO SEGURA

- Reutilize módulos A–E; não crie pipeline paralelo.
- Separe autorização, preflight, transação, journal, validação, rollback e receipt.
- Injete filesystem/root, relógio e identidades para permitir testes isolados.
- Testes de mutação devem usar diretórios temporários e fixtures sintéticas.
- Não instale dependência sem necessidade demonstrada.

FASE 3 — TESTES MÍNIMOS

Cubra, no mínimo:

1. pedido de autorização não é autorização;
2. ausência de autorização resulta NO_GO sem escrita;
3. decisão deny bloqueia;
4. autorização expirada bloqueia;
5. autorização revogada bloqueia;
6. autenticidade não verificável bloqueia;
7. identidade sintética não autoriza produção;
8. dupla aprovação ausente bloqueia;
9. mesma identidade em duas aprovações bloqueia;
10. preparador como autorizador bloqueia;
11. executor não pode completar autorização;
12. aprovações com digests distintos bloqueiam;
13. capability ausente é negada;
14. capability desconhecida é rejeitada;
15. write_canonical_local não autoriza commit;
16. commit_local não autoriza push;
17. autorização não permite Publisher;
18. dataset diferente bloqueia;
19. package_digest divergente bloqueia;
20. manifesto divergente bloqueia;
21. proposta divergente bloqueia;
22. plano ou rollback divergente bloqueia;
23. acervo, taxonomia, schema ou política obsoletos bloqueiam;
24. alteração após validação invalida autorização;
25. CONDITIONAL_GO bloqueia escrita;
26. probable_duplicate não resolvido bloqueia;
27. resolução de provável obsoleta bloqueia;
28. alteração conflitante no worktree bloqueia;
29. HEAD ou branch divergente bloqueia quando vinculado;
30. arquivo fora do plano bloqueia;
31. path traversal bloqueia;
32. symlink bloqueia;
33. colisão case-insensitive bloqueia;
34. hash anterior divergente bloqueia;
35. pre-image ausente bloqueia;
36. pre-image inválida bloqueia;
37. adição registra inexistência anterior;
38. journal precede a primeira escrita;
39. escrita utiliza substituição atômica;
40. conteúdo escrito corresponde byte a byte à proposta;
41. campo não revisado não é criado;
42. frase_peca não é inferida;
43. falha de schema aciona rollback;
44. falha de validate:data aciona rollback;
45. falha de teste aciona rollback;
46. falha de build aciona rollback;
47. diff inesperado aciona rollback;
48. rollback remove somente adições da transação;
49. rollback restaura modificações pelos hashes originais;
50. rollback preserva alterações alheias;
51. rollback completo restaura o baseline;
52. rollback incompleto resulta INCIDENT;
53. sucesso só ocorre após todas as validações;
54. receipt promoted referencia autorização e hashes;
55. receipt rolled_back registra causa e recuperação;
56. receipt blocked não declara promoção;
57. repetição após promoted é idempotente;
58. repetição após rolled_back exige nova avaliação;
59. concorrência entre executores é bloqueada;
60. lock obsoleto tem tratamento seguro e auditável;
61. alteração durante a transação aciona abort/rollback;
62. dados operacionais não entram no YAML;
63. artefatos operacionais não entram em dist/;
64. Git real permanece sem commit, push ou PR;
65. branch, HEAD, índice e config Git permanecem preservados;
66. 115 testes herdados permanecem aprovados;
67. schemas jurídicos, taxonomia e conteúdo permanecem inalterados;
68. apenas os YAMLs autorizados podem diferir ao sucesso;
69. zero JusRatio, rede, cota e serviço externo;
70. zero Publisher, deploy e publicação.

FASE 4 — VALIDAÇÃO

Execute e registre:

- suíte integral de testes;
- validação dos schemas operacionais;
- validação do acervo jurídico;
- teste do validador de autorização com fixtures válidas e inválidas;
- simulação integral em sandbox isolado;
- falhas induzidas em cada estágio transacional;
- rollback e comparação de hashes;
- build pós-promoção somente se autorizado, ou no sandbox sintético;
- git diff --check;
- scanner de segredos;
- busca por primitivas de rede, push, PR, deploy e Publisher;
- verificação de resíduos e artefatos em dist/.

FASE 5 — EXECUÇÃO REAL CONDICIONAL

Somente se AUTHORIZED e todos os gates estiverem GO:

1. adquira lock exclusivo;
2. reconfirme autorização e baseline;
3. gere e valide pre-images;
4. abra journal;
5. aplique exatamente o plano autorizado;
6. execute validações completas;
7. compare diff real e autorizado;
8. finalize receipt promoted;
9. libere lock;
10. pare sem commit, push, PR ou publicação.

Em qualquer falha após a primeira escrita, execute rollback e valide a recuperação antes de encerrar.

FASE 6 — ENCERRAMENTO

Crie docs/predator-intelligence/relatorio-incremento-f.md contendo:

1. classificação técnica do incremento;
2. decisão de autoridade AUTHORIZED ou NO_GO;
3. baseline confirmado;
4. autorização avaliada, capacidades e validade;
5. matriz de segregação;
6. package_digest e hashes congelados;
7. preflight e deduplicação final;
8. lista exata de operações;
9. journal e recibo;
10. validações pós-escrita;
11. rollback executado ou prova em sandbox;
12. matriz dos 70 cenários;
13. arquivos efetivamente alterados;
14. pendências e incidentes;
15. estado final de cada capacidade;
16. declaração sobre Git, rede, JusRatio, Publisher e publicação.

Se não houver autorização válida, o relatório deve registrar NO_GO e nenhuma escrita canônica. Não faça commit, push, PR ou publicação.
```

---

## 5. Backlog fechado

| Entrega | Conteúdo | Critério de aceite |
| --- | --- | --- |
| F-00 | baseline e reconciliação A–E | 115 testes, 13 schemas e 55 gates E reconciliados |
| F-01 | contrato da autorização | decisão externa, capacidades, validade e revogação verificáveis |
| F-02 | validador de autoridade | fail-closed, segregação e dupla aprovação |
| F-03 | congelamento do pacote | digest determinístico e hashes atuais reconciliados |
| F-04 | preflight final | todos os gates em `GO`; nenhuma condição residual |
| F-05 | pre-image e journal | recuperação comprovável antes da primeira escrita |
| F-06 | executor transacional | somente operações autorizadas, escrita atômica e idempotente |
| F-07 | validação pós-escrita | schema, acervo, testes, build e diff aprovados |
| F-08 | rollback e recibo | reversão segura ou receipt final auditável |
| F-09 | relatório final | autoridade, execução, capacidades e limites documentados |

---

## 6. Estrutura inicial sugerida

```text
src/ingestion/promotion-execution/
├── authorization-contract.mjs
├── authorization-validator.mjs
├── capability-gate.mjs
├── package-freezer.mjs
├── final-preflight.mjs
├── transaction-journal.mjs
├── preimage-store.mjs
├── canonical-writer.mjs
├── post-write-validator.mjs
├── rollback-executor.mjs
├── execution-lock.mjs
└── promotion-receipt.mjs

ingestion/
├── config/promotion-execution-policy.example.yaml
├── fixtures/simulated-execution/
│   ├── authorization.valid.synthetic.json
│   └── authorization.invalid.synthetic.json
├── schemas/
│   ├── final-authorization.schema.json
│   ├── promotion-journal.schema.json
│   └── promotion-receipt.schema.json
├── execution-journals/.gitkeep
├── preimages/.gitkeep
└── receipts/.gitkeep

scripts/ingestion/run-controlled-promotion.mjs
tests/ingestion/increment-f.test.mjs
docs/predator-intelligence/relatorio-incremento-f.md
```

A estrutura é orientativa. Reutilize contratos existentes quando isso preservar a arquitetura e a proveniência.

---

## 7. Códigos mínimos de bloqueio e incidente

```text
authorization_missing
authorization_denied
authorization_expired
authorization_revoked
authorization_invalid
authorization_authenticity_unverifiable
authorization_digest_mismatch
authorization_scope_mismatch
authorization_capability_missing
dual_approval_missing
segregation_violation
package_changed
baseline_changed
canonical_index_stale
taxonomy_version_stale
legal_schema_version_stale
policy_version_stale
probable_unresolved
preflight_not_go
worktree_conflict
path_not_allowed
symlink_not_allowed
previous_hash_mismatch
preimage_failed
journal_failed
concurrent_execution
atomic_write_failed
post_validation_failed
unexpected_diff
rollback_required
rollback_incomplete
git_operation_not_authorized
external_operation_not_authorized
publication_not_authorized
```

`rollback_incomplete` deve elevar o estado para `incident`, nunca para sucesso parcial.

---

## 8. Gates de encerramento

O Incremento F pode ser aprovado tecnicamente em dois resultados legítimos:

### 8.1 Encerramento bloqueado seguro

- mecanismo implementado e testado em fixtures sintéticas;
- autorização produtiva ausente ou inválida;
- decisão `NO_GO` emitida antes da escrita;
- acervo oficial byte a byte inalterado;
- nenhum efeito Git ou externo.

### 8.2 Promoção local concluída

- autorização externa válida e verificável;
- todos os gates em `GO`;
- somente arquivos autorizados alterados;
- validações completas aprovadas;
- diff real idêntico ao autorizado;
- receipt `promoted` emitido;
- nenhuma operação Git remota ou publicação.

O incremento é reprovado se houver escrita sem autorização, efeito fora do plano, relaxamento de gate, rollback incompleto ocultado, operação Git não concedida ou publicação.

---

## 9. Matriz de resultado

| Autorização | Preflight | Escrita | Validação | Resultado |
| --- | --- | --- | --- | --- |
| ausente/inválida | não executável | proibida | n/a | `blocked / NO_GO` |
| válida | falha | proibida | n/a | `blocked / NO_GO` |
| válida | GO | falha antes do efeito | nenhuma alteração | `blocked` |
| válida | GO | parcial | falha | `rolled_back` ou `incident` |
| válida | GO | completa | falha | `rolled_back` ou `incident` |
| válida | GO | completa | aprovada | `promoted` |

Não existe estado `partially_promoted` aceitável.

---

## 10. Pendências externas preservadas

- definição e implantação do mecanismo produtivo de autenticidade da autorização;
- identificação dos autorizadores reais;
- confirmação definitiva da dupla aprovação;
- política produtiva de retenção, acesso e descarte das pre-images;
- janela operacional e responsável por incidentes;
- estratégia definitiva de IDs produtivos;
- decisão sobre branch/commit/PR após promoção local;
- branch protection e revisão GitHub;
- acesso, custos, cota, termos e retenção do JusRatio;
- integração com Publisher e publicação.

Essas lacunas não podem ser preenchidas por fixtures, identidades sintéticas, defaults ou inferências do agente.

---

## 11. Limite final do ciclo

O estado máximo deste ciclo, sem autorização adicional para Git e publicação, é:

```json
{
  "authorization_validated": true,
  "promotion_authorized": true,
  "promotion_started": true,
  "canonical_write_completed": true,
  "post_write_validation_passed": true,
  "promotion_result": "promoted",
  "git_operation_authorized": false,
  "publication_authorized": false
}
```

Esse estado somente pode existir após validação de uma autorização humana externa real e específica. Na ausência dela, o estado correto é:

```json
{
  "authorization_validated": false,
  "promotion_authorized": false,
  "promotion_started": false,
  "canonical_write_completed": false,
  "promotion_result": "blocked",
  "decision": "NO_GO"
}
```

O próximo ciclo, se houver promoção local bem-sucedida e autorização própria, deverá tratar separadamente o fluxo Git/PR. Publicação e Publisher exigem outro ato autorizativo expresso.

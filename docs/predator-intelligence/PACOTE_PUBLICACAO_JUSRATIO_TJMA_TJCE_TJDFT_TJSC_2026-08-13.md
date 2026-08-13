# Pacote preparatório de publicação — pesquisa JusRatio 2026-08-13

**Lote:** `dataset-002-jusratio-rmc-2026-08-13`  
**Dataset:** `DATASET-002`  
**Estado:** `AGUARDANDO_AUTORIZAÇÃO`  
**Baseline local:** `bfbb904260f2bda238afe092f4e6802b5605334c`  
**Base remota observada:** `a61944fe473b1f7b3267b901ad0ddc31a5991d38`  
**Branch:** `codex/fix-auto-layout`

## 1. Escopo reconciliado

| Classe | Quantidade | Tratamento |
|---|---:|---|
| Processos únicos pesquisados | 131 | Inventário preservado no relatório de pesquisa |
| Novos candidatos com fonte oficial e modelagem suficiente | 5 | Propostos para lote inicial |
| Caso oficial com lacuna de resultado no schema | 1 | Bloqueado, sem conversão forçada |
| Casos TJMA/TJCE sem URL oficial no achado atual | 8 prioritários | Retidos até confirmação oficial |
| Registros canônicos existentes revisados | 8 | Correções documentadas; não escritas sem autorização |
| Duplicatas de recuperação | 13 | Excluídas do lote |
| Identificador não normalizado | 1 | Excluído até recuperar CNJ |

## 2. Novas decisões propostas

### TJDFT

1. **0729634-88.2024.8.07.0001** — 5ª Turma Cível — Rel. Leonor Aguena — j. 27/11/2025, pub. 02/12/2025.
   - contrato: `mantido`;
   - conversão, repetição e dano moral: `indeferidos`;
   - provas: contrato, termo de consentimento, biometria, faturas e histórico de uso;
   - fundamentos reutilizados: `dever_informacao_qualificado`, `uso_reiterado_cartao_indicio_consentimento`;
   - revisão: `automatizada_pendente_revisao_humana`;
   - [fonte oficial](https://jurisdf.tjdft.jus.br/api/v1/pesquisa/download/9d6410ce-21a2-4f93-a132-1f0206c98bde).

2. **0710409-07.2023.8.07.0005** — 3ª Turma Recursal — Rel. Edi Maria Coutinho Bizzi — j. 05/08/2024, pub. 16/08/2024.
   - contrato: `mantido`;
   - conversão, repetição e dano moral: `indeferidos`;
   - provas/fatos: faturas, saque, compras, uso reiterado e quitação;
   - ratio: o uso típico e reiterado revelou ciência do produto; a alteração posterior da narrativa sustentou a má-fé específica do caso;
   - fundamentos reutilizados: `dever_informacao_qualificado`, `uso_reiterado_cartao_indicio_consentimento`;
   - revisão: `automatizada_pendente_revisao_humana`;
   - [fonte oficial](https://jurisdf.tjdft.jus.br/api/v1/pesquisa/download/d9fb19fb-b67e-44b1-8ee9-0843ffac80f4).

### TJSC

3. **5000228-24.2019.8.24.0051** — 3ª Câmara de Direito Comercial — Rel. Gilberto Gomes de Oliveira — j. 28/05/2020, pub. 14/05/2020.
   - contrato: `anulado`;
   - conversão: `nao_aplicavel`;
   - repetição: `nao_informado` — a fonte confirma retorno recíproco, mas não autoriza inferir simples/dobro;
   - dano moral: `deferido`;
   - fatos: cartão não contratado nem utilizado e descontos em benefício;
   - fundamentos reutilizados: `dever_informacao_qualificado`, `ausencia_uso_cartao_indicio_vicio`;
   - revisão: `automatizada_pendente_revisao_humana`;
   - [fonte oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321756502780517573282713654234).

4. **5007337-66.2022.8.24.0930** — 3ª Câmara de Direito Comercial — Rel. Gilberto Gomes de Oliveira — j. 02/02/2023, pub. 03/02/2023.
   - contrato: `mantido`;
   - conversão, repetição e dano moral: `indeferidos`;
   - prova: termo de consentimento esclarecido assinado e destacado;
   - fundamento reutilizado: `dever_informacao_qualificado`;
   - revisão: `automatizada_pendente_revisao_humana`;
   - [fonte oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321756779968344953761821741918).

5. **5034820-66.2025.8.24.0930** — 3ª Câmara de Direito Comercial — Rel. Rodolfo Tridapalli — j./pub. 06/11/2025.
   - contrato: `mantido`;
   - conversão, repetição e dano moral: `indeferidos`;
   - fatos/provas: documentação de ciência e uso do cartão; abusividade dos juros não demonstrada;
   - fundamentos reutilizados: `dever_informacao_qualificado`, `uso_reiterado_cartao_indicio_consentimento`;
   - revisão: `automatizada_pendente_revisao_humana`;
   - [fonte oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321762463277782329537682939937).

## 3. Caso bloqueado por modelagem

**TJDFT 0718071-46.2024.8.07.0018:** o acórdão reconhece contrato formalmente válido, mas abusivo em sua execução, e determina integração para quitação em até 84 parcelas pela taxa média. O enum atual não representa “validade formal com integração contratual”. Classificá-lo como `convertido` ou simplesmente `mantido` apagaria parte essencial do resultado. A inclusão fica bloqueada até decisão de impacto sobre schema, filtros e interface.

## 4. Catálogos

- tese reutilizada: `vicio_consentimento_cartao_consignado`;
- teses novas: nenhuma;
- fundamentos reutilizados: `dever_informacao_qualificado`, `ausencia_uso_cartao_indicio_vicio`, `uso_reiterado_cartao_indicio_consentimento`;
- fundamentos novos: nenhum;
- produto novo: nenhum;
- tema novo: nenhum.

## 5. Alteração técnica necessária

O gate de integridade possuía domínios oficiais para TJCE, TJMA, TJPI e TJDFT, mas não para TJSC. Foi acrescentado exclusivamente `tjsc.jus.br`. Isso amplia a validação de proveniência; não cria uma allowlist de tribunais permitidos para pesquisa ou inclusão.

## 6. Validações executadas

- schemas de ingestão: aprovados, 16 schemas;
- validação do acervo canônico: aprovada, 15 decisões, 1 tese e 6 fundamentos;
- testes dirigidos de fonte e staging: 12 aprovados;
- controle positivo de domínio oficial TJSC: aprovado;
- integridade referencial do acervo existente: aprovada.

## 7. Gate de autorização

A arquitetura exige autorização final externa vinculada a PR protegido, pacote congelado, hashes e lista exata de arquivos. A mensagem que solicitou a publicação expressa a intenção do usuário, mas não satisfaz o formato verificável exigido por `validateFinalAuthorization`.

Enquanto não existir autorização válida:

- nenhum YAML novo será escrito em `data/jurisprudencia/`;
- nenhum registro antigo será alterado;
- build pós-promoção, commit do lote, push, PR, merge, deploy e verificação pública permanecem bloqueados;
- não será fabricado digest definitivo de um pacote ainda não autorizado.

## 8. Próximo passo autorizativo

O autorizador cadastrado `oalexandreoliveira` deve emitir aprovação em PR protegido, com base `main`, depois que o pacote definitivo de cinco adições e das correções selecionadas for congelado. A aprovação deverá conter as capacidades efetivamente concedidas, inclusive publicação, se desejada.

**Estado final real deste ciclo:** `AGUARDANDO_AUTORIZAÇÃO`.

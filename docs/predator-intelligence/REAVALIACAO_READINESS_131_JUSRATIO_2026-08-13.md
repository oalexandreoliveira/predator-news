# Reavaliação de readiness dos 131 precedentes recuperados

**Data:** 13 de agosto de 2026  
**Lote:** `dataset-002-jusratio-rmc-2026-08-13`  
**Objeto:** TJMA, TJCE, TJDFT e TJSC — cartão de crédito consignado, RMC/RCC  
**Critério ajustado:** publicação com proveniência JusRatio expressa e revisão humana pós-publicação; sem bloqueio por ausência inicial de URL oficial e sem redução forçada a listas fechadas de resultados.

## Resultado

Dos **131 processos únicos** preservados no inventário:

| Tribunal | Inventário | Prontos após autorização | Pendentes |
|---|---:|---:|---:|
| TJMA | 33 | 31 | 2 |
| TJCE | 34 | 34 | 0 |
| TJDFT | 31 | 31 | 0 |
| TJSC | 33 | 33 | 0 |
| **Total** | **131** | **129** | **2** |

Consequentemente, **129 casos podem avançar para modelagem, promoção e publicação depois da autorização exigida pela governança**. O link recuperado pelo JusRatio será aceito como fonte auditável inicial quando não houver URL oficial já identificada. A necessidade de complementar ou substituir a URL por página oficial será tarefa de revisão pós-publicação.

## Critério de prontidão

Um caso foi considerado pronto quando o material recuperado permitiu identificar:

1. número CNJ válido;
2. tribunal e decisão individualizáveis;
3. link de auditoria;
4. controvérsia pertinente;
5. fatos ou provas determinantes;
6. razão de decidir identificável;
7. resultado processual ou material suficientemente definido.

Campos acessórios ausentes não impedem publicação. Devem permanecer abstidos. Resultados compostos serão preservados em descrição estruturada e narrativa técnica, ainda que não coincidam com um enum legado.

## Casos pendentes

### TJMA — 0404052017

- **Motivo:** identificador não corresponde ao padrão CNJ e o resultado recuperado não contém URL.
- **Situação:** conteúdo jurídico existe, mas a identidade documental não é suficientemente estável para publicação como processo real individualizado.
- **Ação:** recuperar número CNJ ou outro identificador oficial inequívoco.

### TJMA — 0800111-08.2022.8.10.0104

- **Motivo:** apareceu na rodada anterior, mas não foi novamente localizado nem pela consulta adversarial atual nem pela busca nominal exata.
- **Situação:** `não_confirmado`; não apagar do inventário.
- **Ação:** nova tentativa dirigida ou conferência em fonte externa antes da promoção.

## Seis processos ausentes do novo ranqueamento

Os seis processos do TJMA que não reapareceram automaticamente foram pesquisados por número exato. Cinco foram confirmados e reintegrados como prontos:

- 0800438-16.2020.8.10.0138;
- 0800782-27.2020.8.10.0031;
- 0800255-11.2021.8.10.0138;
- 0803803-74.2021.8.10.0031;
- 0800143-13.2022.8.10.0104.

Somente 0800111-08.2022.8.10.0104 permaneceu não localizado.

## Identificação dos 129 prontos

O inventário nominal integral está no relatório de pesquisa original. Para efeito operacional, consideram-se prontos **todos os processos listados naquele inventário, exceto**:

1. `0404052017`;
2. `0800111-08.2022.8.10.0104`.

Essa definição por complemento evita duplicar 129 identificadores e mantém uma única fonte de verdade para o inventário.

## Resultados jurídicos não fechados

O precedente TJDFT 0718071-46.2024.8.07.0018 deixa de ser bloqueado. Sua modelagem deve preservar cumulativamente:

- contrato formalmente válido;
- vício de consentimento afastado;
- execução contratual abusiva;
- integração contratual;
- quitação limitada a até 84 parcelas;
- aplicação da taxa média do crédito consignado;
- parcial provimento do recurso.

O caso demonstra que `resultado.contrato` não pode esgotar a representação do julgamento. O campo legado pode alimentar filtros, mas a solução material completa deve permanecer disponível em estrutura extensível e no resumo técnico.

## Proveniência

Para cada publicação:

- registrar `JusRatio` como mecanismo de recuperação;
- preservar o link recebido;
- registrar a data da consulta;
- indicar se a fonte oficial já foi confirmada;
- quando não confirmada, usar estado equivalente a `pendente_confirmacao_oficial_pos_publicacao`;
- nunca apresentar link do agregador como se fosse URL oficial do tribunal.

## Estado final

- **Prontos após autorização:** 129.
- **Pendentes por identidade/confirmação essencial:** 2.
- **Revisão humana anterior à publicação:** não bloqueante.
- **Revisão humana pós-publicação:** obrigatoriamente pendente em cada registro automatizado.
- **Promoção executada nesta reavaliação:** não.

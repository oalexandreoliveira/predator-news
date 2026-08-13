# Onda 0 — Etapa 0A — Inventário de pesquisa profunda do TJPI
**Data:** 13/08/2026  
**Estado:** pesquisa concluída para triagem; promoção canônica ainda não executada.

## Governança aplicada

Os 162 casos já publicados são baseline canônico humanamente aprovado. Marcadores históricos de revisão não reabrem esses registros. Os novos achados abaixo continuam sujeitos ao mecanismo de revisão aplicável a novos dados antes da promoção, conforme o prompt de execução nacional.

## Baseline confirmado

- 162 decisões, 16 teses, 25 fundamentos e cinco tribunais na `main` atual;
- TJPI: sete decisões publicadas, quatro órgãos, período de 2022-03-28 a 2026-03-12;
- os sete processos canônicos foram excluídos da fila por número CNJ.

## Estratégias e saturação

Foram executadas 16 consultas segmentadas por RMC/validade/informação, prova digital, fraude/inexistência, RCC/cartão de benefício, resultados, Turmas Recursais, câmaras sub-representadas, prescrição, conversão/readequação, analfabetismo e uso/saque. O corpus recuperado contém **157 decisões únicas**, sete órgãos e decisões entre 2020-05-11 e 2026-04-23.

A saturação é **parcial**. Consultas muito específicas tiveram retorno zero, mas as buscas por Turmas Recursais, câmaras e conversão ainda trouxeram ganho marginal elevado. O inventário é suficiente para formar lote estratificado, mas não autoriza declarar o TJPI consolidado antes da revisão, promoção, publicação e verificação pública.

| # | Estratégia | Retornados | Únicos na consulta |
|---:|---|---:|---:|
| 1 | q01_rmc_validade_informacao | 20 | 20 |
| 2 | q02_digital_prova | 20 | 20 |
| 3 | q03_prescricao | 0 | 0 |
| 4 | q04_fraude_inexistencia | 0 | 0 |
| 5 | q03_prescricao_retry | 0 | 0 |
| 6 | q04_fraude_retry | 20 | 20 |
| 7 | q05_conversao_revisao | 0 | 0 |
| 8 | q06_rcc_beneficio | 19 | 19 |
| 9 | q07_resultados_diversos | 16 | 16 |
| 10 | q08_historico_2020_2023 | 0 | 0 |
| 11 | q09_turmas_recursais | 15 | 15 |
| 12 | q10_segunda_quarta_camaras | 20 | 20 |
| 13 | q11_prescricao_ampla | 13 | 13 |
| 14 | q12_conversao_adequacao | 20 | 20 |
| 15 | q13_analfabeto_hipervulneravel | 0 | 0 |
| 16 | q14_uso_saque_confirmacao | 0 | 0 |

## Critério de seleção do lote

A triagem deve favorecer diversidade, e não volume repetitivo:

- ao menos uma decisão de cada um dos sete órgãos recuperados;
- equilíbrio entre manutenção, nulidade, conversão/revisão e resultados compostos;
- cobertura de prova digital, dever de informação, fraude, prescrição, restituição, dano moral e hipervulnerabilidade;
- amostra histórica e recente;
- exclusão de repetições de ementas materialmente idênticas, sobretudo séries da 3ª Câmara sobre readequação;
- conferência do inteiro teor e preservação da orientação por tese.

## Inventário deduplicado

| Processo | Órgão | Julgamento | Sinal de resultado | Sinais temáticos | Fonte |
|---|---|---|---|---|---|
| 0800673-06.2025.8.18.0131 | 2ª Turma Recursal | 2026-04-23 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31866887/public) |
| 0801949-42.2022.8.18.0078 | 3ª Câmara Especializada Cível | 2026-04-21 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31325388/public) |
| 0800355-73.2023.8.18.0040 | 3ª Câmara Especializada Cível | 2026-04-16 | nulidade/inexistência | prescrição, dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31653475/public) |
| 0835344-62.2024.8.18.0140 | 1ª Câmara Especializada Cível | 2026-04-16 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31570857/public) |
| 0016552-98.2019.8.18.0001 | 1ª Turma Recursal | 2026-04-15 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30431724/public) |
| 0801590-15.2023.8.18.0060 | 2ª Turma Recursal | 2026-04-14 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31294149/public) |
| 0802094-60.2024.8.18.0068 | 1ª Câmara Especializada Cível | 2026-04-13 | manutenção/validade | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31576379/public) |
| 0800668-81.2025.8.18.0131 | 1ª Turma Recursal | 2026-04-12 | manutenção/validade | digital | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31352254/public) |
| 0815616-69.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2026-04-10 | manutenção/validade | digital | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31533115/public) |
| 0800281-63.2025.8.18.0132 | 2ª Turma Recursal | 2026-04-07 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30386102/public) |
| 0800831-44.2025.8.18.0169 | 2ª Turma Recursal | 2026-04-07 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31616979/public) |
| 0801123-80.2025.8.18.0152 | 2ª Turma Recursal | 2026-04-07 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31643234/public) |
| 0804406-84.2024.8.18.0140 | 1ª Câmara Especializada Cível | 2026-04-07 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31533788/public) |
| 0801804-84.2025.8.18.0076 | 2ª Turma Recursal | 2026-04-06 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31440967/public) |
| 0802733-73.2025.8.18.0123 | 1ª Turma Recursal | 2026-03-31 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31835276/public) |
| 0805789-51.2024.8.18.0026 | 1ª Câmara Especializada Cível | 2026-03-30 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31348023/public) |
| 0807182-27.2023.8.18.0032 | 2ª Câmara Especializada Cível | 2026-03-30 | manutenção/validade | digital | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31395071/public) |
| 0801751-98.2024.8.18.0089 | 1ª Câmara Especializada Cível | 2026-03-27 | manutenção/validade | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31218608/public) |
| 0803525-41.2024.8.18.0162 | 3ª Turma Recursal | 2026-03-27 | nulidade/inexistência | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31039284/public) |
| 0846908-72.2023.8.18.0140 | 4ª Câmara Especializada Cível | 2026-03-27 | nulidade/inexistência | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31318508/public) |
| 0849798-47.2024.8.18.0140 | 1ª Câmara Especializada Cível | 2026-03-27 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31319691/public) |
| 0800261-72.2025.8.18.0132 | 2ª Turma Recursal | 2026-03-25 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30714995/public) |
| 0801258-47.2025.8.18.0167 | 3ª Turma Recursal | 2026-03-25 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30976584/public) |
| 0801760-84.2023.8.18.0060 | 4ª Câmara Especializada Cível | 2026-03-25 | manutenção/validade | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31327058/public) |
| 0800279-28.2021.8.18.0102 | 1ª Turma Recursal | 2026-03-21 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29973713/public) |
| 0801828-15.2025.8.18.0076 | 1ª Turma Recursal | 2026-03-21 | manutenção/validade | digital, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30525373/public) |
| 0800481-28.2025.8.18.0146 | 2ª Turma Recursal | 2026-03-20 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31231016/public) |
| 0801440-96.2024.8.18.0028 | 1ª Câmara Especializada Cível | 2026-03-19 | manutenção/validade | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31003465/public) |
| 0800305-03.2025.8.18.0129 | 1ª Turma Recursal | 2026-03-18 | nulidade/inexistência | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31033741/public) |
| 0800620-49.2025.8.18.0026 | 1ª Câmara Especializada Cível | 2026-03-17 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30648893/public) |
| 0800895-78.2024.8.18.0043 | 1ª Câmara Especializada Cível | 2026-03-17 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30122065/public) |
| 0801123-12.2024.8.18.0089 | 1ª Câmara Especializada Cível | 2026-03-17 | manutenção/validade | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30781891/public) |
| 0802567-46.2024.8.18.0068 | 1ª Câmara Especializada Cível | 2026-03-17 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30389281/public) |
| 0804038-42.2023.8.18.0033 | 1ª Câmara Especializada Cível | 2026-03-17 | nulidade/inexistência | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30642139/public) |
| 0805311-89.2024.8.18.0140 | 1ª Câmara Especializada Cível | 2026-03-17 | manutenção/validade | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30835311/public) |
| 0844851-81.2023.8.18.0140 | 2ª Câmara Especializada Cível | 2026-03-17 | manutenção/validade | digital | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30472516/public) |
| 0800500-76.2025.8.18.0132 | 2ª Turma Recursal | 2026-03-16 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30029105/public) |
| 0801068-84.2025.8.18.0167 | 2ª Turma Recursal | 2026-03-16 | nulidade/inexistência | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29841218/public) |
| 0805625-51.2024.8.18.0167 | 1ª Turma Recursal | 2026-03-16 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30345018/public) |
| 0821029-29.2024.8.18.0140 | 4ª Câmara Especializada Cível | 2026-03-16 | manutenção/validade | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31066988/public) |
| 0803095-74.2024.8.18.0167 | 1ª Turma Recursal | 2026-03-15 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29924742/public) |
| 0800357-67.2024.8.18.0053 | 2ª Câmara Especializada Cível | 2026-03-14 | manutenção/validade | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30713024/public) |
| 0801013-12.2024.8.18.0057 | 1ª Turma Recursal | 2026-03-13 | nulidade/inexistência | digital, dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30832113/public) |
| 0801840-47.2025.8.18.0167 | 1ª Turma Recursal | 2026-03-12 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30757617/public) |
| 0802500-18.2024.8.18.0089 | 3ª Câmara Especializada Cível | 2026-03-11 | manutenção/validade | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30658322/public) |
| 0807576-30.2025.8.18.0140 | 4ª Câmara Especializada Cível | 2026-03-11 | manutenção/validade | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30909891/public) |
| 0801428-88.2024.8.18.0123 | 1ª Turma Recursal | 2026-03-10 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30550617/public) |
| 0800471-49.2022.8.18.0029 | 1ª Câmara Especializada Cível | 2026-03-09 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30654233/public) |
| 0807823-45.2024.8.18.0140 | 3ª Câmara Especializada Cível | 2026-03-05 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30339751/public) |
| 0800052-72.2024.8.18.0089 | 1ª Câmara Especializada Cível | 2026-03-04 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30654473/public) |
| 0803090-29.2023.8.18.0089 | 4ª Câmara Especializada Cível | 2026-03-04 | nulidade/inexistência | digital, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29899556/public) |
| 0801176-83.2023.8.18.0038 | 4ª Câmara Especializada Cível | 2026-03-03 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30656883/public) |
| 0801278-38.2025.8.18.0167 | 2ª Turma Recursal | 2026-03-03 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30565077/public) |
| 0801646-43.2025.8.18.0136 | 2ª Turma Recursal | 2026-03-03 | nulidade/inexistência | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30200491/public) |
| 0807720-11.2023.8.18.0031 | 4ª Câmara Especializada Cível | 2026-03-03 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30507694/public) |
| 0802881-22.2023.8.18.0037 | 3ª Câmara Especializada Cível | 2026-02-28 | manutenção/validade | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30507876/public) |
| 0800696-45.2025.8.18.0100 | 4ª Câmara Especializada Cível | 2026-02-27 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29883847/public) |
| 0801180-23.2023.8.18.0038 | 4ª Câmara Especializada Cível | 2026-02-27 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30033520/public) |
| 0801499-61.2023.8.18.0047 | 3ª Câmara Especializada Cível | 2026-02-26 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30019226/public) |
| 0802596-13.2021.8.18.0065 | 1ª Câmara Especializada Cível | 2026-02-26 | manutenção/validade | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30580913/public) |
| 0813034-62.2024.8.18.0140 | 1ª Câmara Especializada Cível | 2026-02-26 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30579299/public) |
| 0800911-84.2023.8.18.0037 | 1ª Câmara Especializada Cível | 2026-02-24 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30441479/public) |
| 0801634-82.2024.8.18.0065 | 1ª Câmara Especializada Cível | 2026-02-24 | manutenção/validade | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29928592/public) |
| 0802765-50.2022.8.18.0037 | 1ª Câmara Especializada Cível | 2026-02-24 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30124867/public) |
| 0837904-11.2023.8.18.0140 | 1ª Câmara Especializada Cível | 2026-02-24 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30021820/public) |
| 0800319-52.2024.8.18.0054 | 3ª Câmara Especializada Cível | 2026-02-22 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/31140352/public) |
| 0800395-85.2024.8.18.0051 | 1ª Turma Recursal | 2026-02-22 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29871718/public) |
| 0812739-88.2025.8.18.0140 | 3ª Câmara Especializada Cível | 2026-02-20 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30146710/public) |
| 0801504-29.2023.8.18.0065 | 3ª Câmara Especializada Cível | 2026-02-19 | nulidade/inexistência | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30148244/public) |
| 0800014-04.2024.8.18.0043 | 3ª Câmara Especializada Cível | 2026-02-18 | manutenção/validade | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30360624/public) |
| 0800044-85.2024.8.18.0060 | 3ª Câmara Especializada Cível | 2026-02-17 | nulidade/inexistência | restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29998033/public) |
| 0802815-85.2024.8.18.0076 | 3ª Câmara Especializada Cível | 2026-02-17 | nulidade/inexistência | prescrição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30270393/public) |
| 0808947-02.2024.8.18.0031 | 3ª Câmara Especializada Cível | 2026-02-17 | conversão/revisão | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30364198/public) |
| 0841945-84.2024.8.18.0140 | 3ª Câmara Especializada Cível | 2026-02-17 | manutenção/validade | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30062010/public) |
| 0800186-36.2023.8.18.0089 | 3ª Câmara Especializada Cível | 2026-02-13 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30226407/public) |
| 0805737-74.2023.8.18.0031 | 1ª Câmara Especializada Cível | 2026-02-13 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30127734/public) |
| 0859977-40.2024.8.18.0140 | 1ª Câmara Especializada Cível | 2026-02-13 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30244667/public) |
| 0802877-82.2023.8.18.0037 | 3ª Câmara Especializada Cível | 2026-02-10 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29963874/public) |
| 0807127-19.2018.8.18.0140 | 3ª Câmara Especializada Cível | 2026-02-06 | nulidade/inexistência | prescrição, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29919785/public) |
| 0801536-79.2023.8.18.0050 | 3ª Câmara Especializada Cível | 2026-02-05 | manutenção/validade | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/29964481/public) |
| 0800220-37.2023.8.18.0048 | 3ª Câmara Especializada Cível | 2026-02-03 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30701506/public) |
| 0804353-40.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2026-02-03 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/30701504/public) |
| 0801423-52.2023.8.18.0042 | 3ª Câmara Especializada Cível | 2025-10-29 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/28857113/public) |
| 0805242-30.2023.8.18.0031 | 3ª Câmara Especializada Cível | 2025-10-29 | nulidade/inexistência | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/28816293/public) |
| 0800963-33.2022.8.18.0064 | 3ª Câmara Especializada Cível | 2025-07-14 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/26446238/public) |
| 0841752-06.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2025-07-04 | manutenção/validade | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/26229083/public) |
| 0800829-51.2022.8.18.0049 | 3ª Câmara Especializada Cível | 2025-03-20 | manutenção/validade | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/23075229/public) |
| 0801945-25.2023.8.18.0060 | 3ª Câmara Especializada Cível | 2025-03-19 | misto/a classificar | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/22536745/public) |
| 0831654-59.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2025-03-10 | nulidade/inexistência | digital, dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/21542016/public) |
| 0822559-05.2023.8.18.0140 | 4ª Câmara Especializada Cível | 2025-03-06 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/22051851/public) |
| 0845367-38.2022.8.18.0140 | 4ª Câmara Especializada Cível | 2025-02-27 | manutenção/validade | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/22404671/public) |
| 0800243-58.2024.8.18.0141 | 1ª Turma Recursal | 2025-02-24 | misto/a classificar | digital | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/21779225/public) |
| 0800282-19.2023.8.18.0132 | 2ª Turma Recursal | 2024-12-17 | nulidade/inexistência | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/21267203/public) |
| 0800844-62.2022.8.18.0132 | 2ª Turma Recursal | 2024-12-11 | nulidade/inexistência | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/21103081/public) |
| 0802039-70.2022.8.18.0039 | 1ª Câmara Especializada Cível | 2024-10-14 | nulidade/inexistência | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/19790045/public) |
| 0801198-82.2021.8.18.0048 | 1ª Câmara Especializada Cível | 2024-09-26 | conversão/revisão | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/19186789/public) |
| 0824694-87.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2024-09-23 | manutenção/validade | digital | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/18465723/public) |
| 0801392-17.2023.8.18.0047 | 1ª Câmara Especializada Cível | 2024-09-05 | nulidade/inexistência | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/18330211/public) |
| 0823200-61.2021.8.18.0140 | 3ª Câmara Especializada Cível | 2024-08-21 | conversão/revisão | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/18869302/public) |
| 0804103-11.2021.8.18.0032 | 2ª Câmara Especializada Cível | 2024-08-20 | misto/a classificar | prescrição, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/17714189/public) |
| 0805145-45.2023.8.18.0026 | 1ª Câmara Especializada Cível | 2024-08-19 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/20058735/public) |
| 0801900-05.2021.8.18.0088 | Vice-Presidência do Tribunal de Justiça | 2024-07-04 | conversão/revisão | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/17465490/public) |
| 0819537-36.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2024-07-04 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/17801852/public) |
| 0802608-38.2022.8.18.0050 | 2ª Câmara Especializada Cível | 2024-06-28 | misto/a classificar | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/17363129/public) |
| 0807400-22.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2024-06-04 | manutenção/validade | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/16166628/public) |
| 0810482-61.2023.8.18.0140 | 3ª Câmara Especializada Cível | 2024-05-29 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/16823299/public) |
| 0800802-53.2021.8.18.0033 | 2ª Câmara Especializada Cível | 2024-05-20 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/16286584/public) |
| 0808953-12.2020.8.18.0140 | 2ª Câmara Especializada Cível | 2024-05-20 | nulidade/inexistência | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/16424947/public) |
| 0807951-36.2022.8.18.0140 | 3ª Câmara Especializada Cível | 2024-05-03 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/16357764/public) |
| 0800869-45.2022.8.18.0045 | 3ª Câmara Especializada Cível | 2024-04-16 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14953684/public) |
| 0802869-79.2021.8.18.0036 | 3ª Câmara Especializada Cível | 2024-04-16 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14903023/public) |
| 0803288-51.2020.8.18.0031 | 3ª Câmara Especializada Cível | 2024-03-22 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/12008456/public) |
| 0800399-48.2022.8.18.0066 | 1ª Câmara Especializada Cível | 2024-03-18 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/15108955/public) |
| 0801586-17.2022.8.18.0026 | 1ª Câmara Especializada Cível | 2024-03-18 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/15080320/public) |
| 0800410-38.2023.8.18.0100 | 3ª Câmara Especializada Cível | 2024-02-29 | nulidade/inexistência | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14735910/public) |
| 0800686-73.2021.8.18.0089 | 3ª Câmara Especializada Cível | 2024-02-27 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14102711/public) |
| 0802399-26.2022.8.18.0032 | 2ª Câmara Especializada Cível | 2024-02-27 | nulidade/inexistência | prescrição, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14913882/public) |
| 0806322-63.2022.8.18.0031 | 3ª Câmara Especializada Cível | 2024-02-26 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13970054/public) |
| 0801576-40.2022.8.18.0036 | 3ª Câmara Especializada Cível | 2024-02-19 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13508139/public) |
| 0801597-48.2021.8.18.0069 | 3ª Câmara Especializada Cível | 2024-02-08 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14459479/public) |
| 0801115-91.2021.8.18.0072 | 3ª Câmara Especializada Cível | 2024-01-15 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13716735/public) |
| 0801913-44.2019.8.18.0065 | 3ª Câmara Especializada Cível | 2024-01-15 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13178712/public) |
| 0802357-72.2022.8.18.0065 | 1ª Câmara Especializada Cível | 2024-01-12 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14009972/public) |
| 0802535-43.2021.8.18.0069 | 1ª Câmara Especializada Cível | 2023-12-19 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/14130870/public) |
| 0825420-95.2022.8.18.0140 | 3ª Câmara Especializada Cível | 2023-12-14 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13631669/public) |
| 0800059-37.2023.8.18.0077 | 1ª Câmara Especializada Cível | 2023-12-13 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13981394/public) |
| 0801782-04.2020.8.18.0140 | 3ª Câmara Especializada Cível | 2023-11-29 | conversão/revisão | dano moral | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13937014/public) |
| 0803668-37.2021.8.18.0032 | 3ª Câmara Especializada Cível | 2023-11-28 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13118536/public) |
| 0835402-41.2019.8.18.0140 | 3ª Câmara Especializada Cível | 2023-11-13 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/13217054/public) |
| 0801468-60.2021.8.18.0031 | 3ª Câmara Especializada Cível | 2023-10-31 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/12745844/public) |
| 0800549-23.2019.8.18.0102 | 3ª Câmara Especializada Cível | 2023-10-06 | conversão/revisão | restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/12666921/public) |
| 0800489-12.2020.8.18.0071 | 2ª Câmara Especializada Cível | 2023-09-11 | nulidade/inexistência | restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/11500842/public) |
| 0803214-26.2019.8.18.0065 | 1ª Câmara Especializada Cível | 2023-08-14 | misto/a classificar | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/12163190/public) |
| 0801309-85.2021.8.18.0171 | 3ª Turma Recursal | 2023-04-18 | nulidade/inexistência | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/10216651/public) |
| 0802861-85.2019.8.18.0032 | 1ª Câmara Especializada Cível | 2022-12-19 | nulidade/inexistência | dano moral, restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/9090933/public) |
| 0800121-72.2021.8.18.0069 | 3ª Câmara Especializada Cível | 2022-11-07 | conversão/revisão | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/9061011/public) |
| 0800187-89.2021.8.18.0089 | 2ª Câmara Especializada Cível | 2022-09-28 | nulidade/inexistência | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/8294790/public) |
| 0800511-42.2021.8.18.0069 | 2ª Câmara Especializada Cível | 2022-09-09 | nulidade/inexistência | digital, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/8046519/public) |
| 0000860-55.2014.8.18.0059 | 4ª Câmara Especializada Cível | 2022-07-13 | nulidade/inexistência | prescrição, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4768397/public) |
| 0800539-63.2019.8.18.0074 | 4ª Câmara Especializada Cível | 2022-03-07 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/6163809/public) |
| 0803005-42.2018.8.18.0049 | 2ª Câmara Especializada Cível | 2022-03-07 | manutenção/validade | restituição, analfabetismo | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4906426/public) |
| 0800077-28.2021.8.18.0045 | 4ª Câmara Especializada Cível | 2022-02-21 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/6059361/public) |
| 0800994-97.2019.8.18.0051 | 4ª Câmara Especializada Cível | 2022-02-21 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/6033823/public) |
| 0800542-65.2020.8.18.0047 | 4ª Câmara Especializada Cível | 2021-12-21 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/5660357/public) |
| 0800254-51.2020.8.18.0069 | 4ª Câmara Especializada Cível | 2021-12-15 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4425945/public) |
| 0800356-47.2019.8.18.0089 | 4ª Câmara Especializada Cível | 2021-10-20 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/5054059/public) |
| 0800007-10.2020.8.18.0089 | 4ª Câmara Especializada Cível | 2021-08-30 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4617623/public) |
| 0800172-39.2019.8.18.0074 | 4ª Câmara Especializada Cível | 2021-08-30 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4630126/public) |
| 0800279-64.2020.8.18.0069 | 4ª Câmara Especializada Cível | 2021-08-15 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4183390/public) |
| 0812234-44.2018.8.18.0140 | 2ª Câmara Especializada Cível | 2021-08-09 | conversão/revisão | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4396703/public) |
| 0801978-87.2019.8.18.0049 | 4ª Câmara Especializada Cível | 2021-07-24 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4358490/public) |
| 0821385-97.2019.8.18.0140 | 4ª Câmara Especializada Cível | 2021-07-24 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4358195/public) |
| 0811122-40.2018.8.18.0140 | 3ª Câmara Especializada Cível | 2021-06-03 | nulidade/inexistência | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/4169056/public) |
| 0800773-92.2018.8.18.0102 | 4ª Câmara Especializada Cível | 2021-05-14 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/3730039/public) |
| 0806665-96.2017.8.18.0140 | 4ª Câmara Especializada Cível | 2021-04-29 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/3614014/public) |
| 0004621-40.2017.8.18.0140 | 4ª Câmara Especializada Cível | 2021-04-17 | conversão/revisão | RMC/informação | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/3556934/public) |
| 0701969-70.2019.8.18.0000 | 2ª Câmara Especializada Cível | 2020-05-11 | conversão/revisão | dano moral, restituição | [fonte](https://jurisprudencia.tjpi.jus.br/jurisprudences/1385328/public) |

## Gate atual

Nenhum item deste inventário foi escrito em `data/jurisprudencia`. A etapa seguinte é obter e conferir o conteúdo documental dos selecionados, modelar questões, ratio, teses, fundamentos e resultados compostos, gerar os artefatos de revisão e submeter o lote ao gate aplicável a **novas decisões**. A aprovação presumida do baseline não foi estendida aos candidatos.

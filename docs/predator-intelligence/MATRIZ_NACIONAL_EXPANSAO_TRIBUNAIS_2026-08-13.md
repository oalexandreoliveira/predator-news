# Matriz Nacional de Expansão dos Tribunais — Predator Intelligence

**Data-base:** 13 de agosto de 2026  
**Escopo:** planejamento, auditoria e priorização. Nenhuma decisão foi ingerida, promovida ou publicada nesta etapa.

## 1. Sumário executivo

O acervo publicado contém **162 decisões, 16 teses autônomas e 25 fundamentos**, distribuídos por TJCE, TJDFT, TJMA, TJPI e TJSC. A cobertura nominal de cinco tribunais não equivale, porém, a cinco tribunais consolidados: TJPI tem apenas sete julgados e TJSC concentra 30 de 33 decisões em uma única câmara. Por determinação superveniente de governança, todos os 162 registros publicados constituem baseline canônico humanamente revisado; marcadores históricos de revisão não reabrem fila nem bloqueiam a expansão.

A expansão recomendada preserva densidade e comparabilidade:

1. **Onda 0 — consolidação:** corrigir lacunas dos cinco tribunais atuais, sobretudo TJPI e a concentração orgânica do TJSC.
2. **Onda 1 — 10 tribunais:** acrescentar TJMG, TJRJ, TJSP, TJPE e TJGO.
3. **Onda 2 — 15 tribunais:** acrescentar TJAP, TJAL, TJES, TJPR e TJPA.
4. **Onda 3 — cobertura nacional:** incorporar os 12 restantes, começando por TJMS, TJAM, TJRS, TJRO, TJSE e TJRR e precedendo a ingestão de TJAC, TJBA, TJMT, TJPB, TJRN e TJTO por nova validação dirigida.

Essa ordem não cria lista rígida de tribunais admitidos. Ela é uma fila dinâmica: novos sinais de disponibilidade, divergência ou relevância podem alterar a posição de qualquer tribunal.

## 2. Método e limites

### 2.1 Fontes

A auditoria interna foi feita sobre a versão publicada da branch principal (`cbfd247`), contando diretamente os YAML canônicos. A exploração externa consultou separadamente cada um dos 22 tribunais ausentes no JusRatio, com busca temática ampla e, quando necessário, uma segunda busca simplificada por “cartão consignado RMC”. Também foi verificada a cobertura geral do índice: todos os 27 tribunais estaduais constam da base, com atualização geral entre outubro de 2025 e agosto de 2026.

As buscas exploratórias são amostras ranqueadas, limitadas a 30 resultados. O número de candidatos exibido pelo mecanismo foi frequentemente truncado em 80; portanto, **80 não é estimativa do universo real**. “Sem retorno” significa recuperação inconclusiva para as consultas executadas, não inexistência de jurisprudência.

### 2.2 Escore nacional

Cada tribunal recebe notas de 0 a 5 em sete dimensões:

- **R — relevância temática (25%)**;
- **A — disponibilidade e recuperabilidade (15%)**;
- **V — volume útil estimado (15%)**;
- **T — diversidade temática e interna (15%)**;
- **C — valor comparativo e potencial de divergência (15%)**;
- **N — atualidade/recência (10%)**;
- **K — eficiência operacional (5%)**, em que 5 significa menor custo de curadoria.

`Escore = 0,25R + 0,15A + 0,15V + 0,15T + 0,15C + 0,10N + 0,05K`.

O escore organiza a fila, mas não substitui juízo jurídico. Tribunais já publicados ficam na Onda 0, ainda que tenham escore alto, porque sua prioridade é consolidação e não nova entrada.

### 2.3 Confiança e divergência

- **Alta:** evidência interna canônica ou amostra externa atual, diversa e com fonte oficial direta.
- **Média:** amostra suficiente, mas limitada ou com parte dos links intermediada pelo agregador.
- **Baixa:** consultas sem amostra temática recuperada ou sinais insuficientes.
- A coluna **divergência** indica potencial observado na amostra, não uma conclusão sobre jurisprudência dominante.

## 3. Auditoria do acervo atual

| Tribunal | Decisões | Período | Órgãos | Teses distintas | Resultado contratual | Fonte | Revisão | Densidade | Maturidade |
|---|---:|---|---:|---:|---|---|---|---:|---|
| TJDFT | 54 | 2020-08-26 a 2026-07-30 | 11 | 15 | 26 mantidos; 6 convertidos; 5 anulados; 2 inexistentes; 15 NI | 23 oficiais; 31 agregadas auditáveis | 54 pendentes | 98/100 | 3 — consolidado operacional |
| TJCE | 36 | 2023-03-29 a 2026-06-30 | 11 | 13 | 14 mantidos; 12 convertidos; 5 anulados; 5 NI | 2 oficiais; 34 agregadas auditáveis | 34 pendentes; 2 sem metadado | 85/100 | 3 — consolidado operacional |
| TJMA | 32 | 2022-04-01 a 2025-07-18 | 10 | 14 | 19 mantidos; 5 convertidos; 2 anulados; 1 inexistente; 5 NI | 1 oficial; 31 agregadas auditáveis | 31 pendentes; 1 sem metadado | 87/100 | 3 — consolidado operacional |
| TJPI | 7 | 2022-03-28 a 2026-03-12 | 4 | 11 | 4 mantidos; 1 anulado; 2 inexistentes | 7 oficiais | 7 sem metadado | 51/100 | 1 — presença inicial |
| TJSC | 33 | 2020-05-12 a 2025-11-06 | 3 | 9 | 29 anulados; 4 mantidos | 33 agregadas auditáveis | 33 pendentes | 63/100 | 2 — cobertura parcial/concentrada |

### 3.1 Densidade jurisprudencial

A densidade mede cobertura útil, não quantidade bruta:

`D = 30% volume + 20% diversidade de órgãos + 20% cobertura de teses + 15% diversidade de resultados + 10% amplitude temporal + 5% qualidade da fonte`.

Normalizações: volume satura em 40 decisões; órgãos em oito; teses em 16; resultados contratuais em cinco; amplitude temporal em cinco anos. Fonte oficial vale 1,0 e fonte agregada auditável 0,7. A métrica deve ser recalculada a cada lote e acompanhada de uma penalidade separada de qualidade/revisão; não se deve esconder backlog humano dentro da cobertura temática.

### 3.2 Diagnóstico por tribunal

**TJDFT.** É o acervo mais denso e diversificado: 11 órgãos, 15 teses e cinco classes de resultado. Os 54 registros publicados são baseline aprovado e não serão reabertos por marcadores históricos. A prioridade é pesquisar lacunas dirigidas e reduzir, por correção superveniente somente quando houver nova evidência, os 15 resultados contratuais não informados. A variedade de contratação digital, fraude, revisão por desvantagem exagerada e prescrição deve ser preservada.

**TJCE.** Tem boa pluralidade orgânica e resultados equilibrados, mas 34 de 36 links são de recuperação agregada. A prioridade é amostrar fontes oficiais, preencher metadados de revisão e buscar mais contratação digital, analfabetismo e prescrição.

**TJMA.** Tem boa diversidade de órgãos e teses, com forte presença de Turmas Recursais. A prioridade é ampliar câmaras de direito privado, aprofundar fraude/inexistência, dano moral e prescrição e revisar os cinco resultados não informados.

**TJPI.** É o maior déficit atual. Sete decisões não sustentam consolidação estadual nem comparação interna. Deve receber busca dirigida por câmaras, contratação digital, dever de informação, RMC/RCC, prescrição, revisão e resultados desfavoráveis ao consumidor.

**TJSC.** O volume aparente oculta concentração: 30 casos pertencem à 3ª Câmara de Direito Comercial e 29 de 33 terminam em anulação. Antes de expandir volume no mesmo órgão, deve-se buscar outras câmaras, Turmas Recursais e decisões de manutenção, integração/revisão, assinatura eletrônica, prescrição e dano moral.

## 4. Matriz nacional de priorização

| Ordem | Tribunal | Estado atual | R | A | V | T | C | N | K | Escore | Confiança | Divergência | Onda |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| 0.1 | TJPI | 7 publicados | 5 | 4 | 2 | 3 | 4 | 4 | 4 | 3,80 | alta | parcial | 0 |
| 0.2 | TJSC | 33 publicados, concentrados | 5 | 4 | 4 | 2 | 5 | 4 | 3 | 4,05 | alta | alta entre órgãos a explorar | 0 |
| 0.3 | TJDFT | 54 publicados | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 4,90 | alta | alta | 0 |
| 0.4 | TJCE | 36 publicados | 5 | 4 | 5 | 4 | 5 | 5 | 3 | 4,60 | alta | alta | 0 |
| 0.5 | TJMA | 32 publicados | 5 | 4 | 4 | 4 | 5 | 4 | 3 | 4,35 | alta | alta | 0 |
| 1 | TJMG | amostra 20; 9 órgãos | 5 | 5 | 5 | 5 | 5 | 5 | 4 | **4,95** | alta | alta | 1 |
| 2 | TJRJ | amostra 20; 12 órgãos | 5 | 5 | 5 | 5 | 5 | 5 | 4 | **4,95** | alta | alta | 1 |
| 3 | TJSP | amostra 12; fontes oficiais | 5 | 5 | 5 | 5 | 5 | 5 | 3 | **4,90** | alta | alta | 1 |
| 4 | TJPE | amostra 16; 10 órgãos | 5 | 4 | 4 | 5 | 5 | 5 | 4 | **4,65** | média-alta | alta | 1 |
| 5 | TJGO | amostra 13; 8 órgãos | 5 | 4 | 4 | 5 | 5 | 5 | 3 | **4,60** | média-alta | média-alta | 1 |
| 6 | TJPR | amostra 13; 5 órgãos | 5 | 5 | 4 | 4 | 5 | 5 | 4 | **4,65** | alta | alta | 2 |
| 7 | TJAP | amostra 20; 4 órgãos | 5 | 4 | 4 | 4 | 4 | 5 | 3 | **4,30** | média | média-alta | 2 |
| 8 | TJAL | amostra 19; 3 órgãos | 5 | 4 | 4 | 4 | 4 | 5 | 3 | **4,30** | média | média | 2 |
| 9 | TJPA | amostra 20; 4 órgãos | 5 | 4 | 5 | 3 | 4 | 5 | 3 | **4,30** | média | média | 2 |
| 10 | TJES | amostra 11; 6 órgãos | 5 | 4 | 3 | 5 | 4 | 5 | 3 | **4,30** | média | alta | 2 |
| 11 | TJRS | amostra 11; 5 órgãos | 5 | 4 | 3 | 4 | 5 | 5 | 3 | 4,30 | média | alta | 3 |
| 12 | TJMS | amostra 16; 3 órgãos | 5 | 4 | 4 | 3 | 4 | 5 | 4 | 4,20 | média | média | 3 |
| 13 | TJAM | amostra 19; 3 órgãos | 5 | 5 | 4 | 3 | 4 | 3 | 4 | 4,15 | média | média | 3 |
| 14 | TJRO | amostra 13; 4 órgãos | 5 | 4 | 3 | 4 | 4 | 4 | 3 | 4,05 | média | média-alta | 3 |
| 15 | TJSE | amostra 17; 3 órgãos | 5 | 5 | 4 | 3 | 3 | 3 | 4 | 4,00 | média | baixa/média | 3 |
| 16 | TJRR | amostra 15; 1 órgão | 5 | 5 | 3 | 2 | 3 | 5 | 4 | 3,90 | média | a confirmar | 3 |
| 17 | TJBA | busca temática inconclusiva | 2 | 1 | 1 | 1 | 3 | 5 | 2 | 2,00 | baixa | desconhecida | 3-validação |
| 18 | TJMT | busca temática inconclusiva | 2 | 1 | 1 | 1 | 3 | 5 | 2 | 2,00 | baixa | desconhecida | 3-validação |
| 19 | TJPB | busca temática inconclusiva | 2 | 1 | 1 | 1 | 3 | 5 | 3 | 2,05 | baixa | desconhecida | 3-validação |
| 20 | TJRN | busca temática inconclusiva | 2 | 1 | 1 | 1 | 3 | 5 | 3 | 2,05 | baixa | desconhecida | 3-validação |
| 21 | TJTO | busca temática inconclusiva | 2 | 1 | 1 | 1 | 3 | 5 | 3 | 2,05 | baixa | desconhecida | 3-validação |
| 22 | TJAC | busca temática inconclusiva | 2 | 1 | 1 | 1 | 3 | 4 | 3 | 1,95 | baixa | desconhecida | 3-validação |

### 4.1 Leitura da matriz

Os maiores tribunais não foram escolhidos apenas pelo porte. TJMG e TJRJ lideram por combinar volume, fontes oficiais, diversidade orgânica e atualidade. TJSP oferece contraste interno explícito entre validade digital, manutenção, conversão e nulidade. TJPE e TJGO completam a primeira onda porque entregam variedade suficiente sem depender exclusivamente de um único órgão.

TJPR tem escore de primeira onda, mas foi colocado no início da Onda 2 para limitar a primeira expansão a cinco tribunais e manter capacidade de revisão. TJAP, TJAL, TJES e TJPA completam 15 estados com diversidade regional e temas comparáveis.

Os seis casos inconclusivos não ficam proibidos. Entram em uma trilha de validação com buscas por sinônimos, classes processuais, órgãos e períodos; quando houver amostra auditável, seus escores devem ser recalculados e eles podem ultrapassar qualquer posição da Onda 3.

## 5. Evidências exploratórias e candidatos registrados

Os precedentes abaixo são **candidatos de pesquisa**, não registros aprovados para publicação.

| Tribunal | Processo candidato | Órgão/data | Valor exploratório | Fonte de conferência |
|---|---|---|---|---|
| TJMG | 5024513-46.2024.8.13.0105 | 10ª Câmara Cível, 03/02/2026 | contratação, informação e remédios | [inteiro teor oficial](https://www5.tjmg.jus.br/jurisprudencia/relatorioEspelhoAcordao.do?inteiroTeor=true&ano=25&ttriCodigo=1&codigoOrigem=0&numero=445155&sequencial=1&sequencialAcordao=0) |
| TJRJ | 0832119-27.2024.8.19.0004 | 8ª Câmara de Direito Privado, 24/02/2026 | contraste entre validade e revisão | [inteiro teor oficial](https://www3.tjrj.jus.br/gedcacheweb/default.aspx?UZIP=1&GEDID=0004805530AFC91EF2F32D90A1D91CA7232AC51A2F5A2D4A) |
| TJSP | 1162898-94.2024.8.26.0100 | Núcleo 4.0-T. VII, 04/02/2026 | dever qualificado, conversão e restituição | [inteiro teor oficial](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20111841&cdForo=0) |
| TJPE | 0003004-66.2023.8.17.8222 | 1ª Turma Justiça Eficiente, 04/04/2026 | Juizados, prescrição e remédios | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjpe-acordao-733593-00030046620238178222/inteiro-teor) |
| TJGO | 5019763-51.2025.8.09.0113 | 8ª Câmara Cível, 05/11/2025 | abusividade e conversão | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjgo-acordao-50197635120258090113/inteiro-teor) |
| TJPR | 0004450-33.2021.8.16.0194 | 14ª Câmara Cível, 09/02/2026 | contratação não provada, restituição e dano | [inteiro teor oficial](https://portal.tjpr.jus.br/jurisprudencia/j/4100000033551921/Ac%C3%B3rd%C3%A3o-0004450-33.2021.8.16.0194) |
| TJAP | 6100633-79.2025.8.03.0001 | Pleno, 09/04/2026 | autoridade interna e conversão | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjap-acordao-6635499/inteiro-teor) |
| TJAL | 0746756-55.2024.8.02.0001 | 2ª Câmara Cível, 12/02/2026 | prescrição, restituição e consumidor idoso | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjal-acordao-790314/inteiro-teor) |
| TJES | 5000928-18.2024.8.08.0003 | 2ª Câmara Cível, 30/03/2026 | diversidade de resultados e órgãos | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjes-acordao-17961179/inteiro-teor) |
| TJPA | 0803206-31.2025.8.14.0039 | 1ª Turma Recursal, 17/03/2026 | RMC em Juizados e consumidor vulnerável | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjpa-acordao-34668544/inteiro-teor) |
| TJMS | 0844648-82.2024.8.12.0001 | 2ª Câmara Cível, 08/04/2026 | conversão e efeitos patrimoniais | [inteiro teor oficial](https://esaj.tjms.jus.br/cjsg/getArquivo.do?cdAcordao=1874582) |
| TJAM | 0645851-22.2023.8.04.0001 | 1ª Câmara Cível, 25/11/2024 | contraste regional e conversão | [inteiro teor oficial](https://consultasaj.tjam.jus.br/cjsg/getArquivo.do?cdAcordao=3355871&cdForo=0) |
| TJRS | 5001868-89.2022.8.21.0132 | 23ª Câmara Cível, 27/03/2026 | orientação sobre conversão | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjrs-acordao-11751336/inteiro-teor) |
| TJRO | 0802205-09.2025.8.22.0000 | Câmaras Cíveis Reunidas, 19/12/2025 | potencial uniformizador interno | [cópia auditável](https://api.jusratio.com.br/v1/docs/tjro-acordao-30530895/inteiro-teor) |
| TJRR | 0800785-76.2025.8.23.0020 | Câmara Cível, 20/03/2026 | prescrição, informação e restituição | [inteiro teor oficial](https://jurisprudencia.tjrr.jus.br/pdf?id=120669) |
| TJSE | 0009837-14.2024.8.25.0084 | 2ª Turma Recursal, 12/12/2024 | Juizados, dano moral e prescrição | [inteiro teor oficial](https://www.tjse.jus.br:443/tjnet/jurisprudencia/relatorio.wsp?tmp_numprocesso=202401166479&tmp_numacordao=202468619&tmp.expressao=*%3A*) |

## 6. Plano operacional por ondas

### Onda 0 — consolidar os cinco atuais

Critério de saída por tribunal:

- ao menos 20 decisões, salvo indisponibilidade documentada;
- ao menos cinco órgãos ou justificativa estrutural do tribunal;
- ao menos oito teses distintas, com questões jurídicas e fundamentos individualizados;
- presença de resultados favoráveis, desfavoráveis e intermediários;
- cobertura temporal mínima de três anos ou justificativa;
- zero resultado essencial “não informado” sem nota explicativa;
- backlog humano mensurado, sem impedir publicação autorizada.

Backlog prioritário: expansão de TJPI; diversificação orgânica do TJSC; buscas dirigidas no TJDFT; e complementação de fontes e metadados de TJCE/TJMA somente quando nova evidência justificar correção superveniente.

### Onda 1 — chegar a dez tribunais

Entrada: **TJMG, TJRJ, TJSP, TJPE e TJGO**. Para cada tribunal, formar lote inicial estratificado por órgão, tema e resultado, evitando que a primeira câmara ranqueada domine a amostra. Meta inicial: 20 a 30 decisões por tribunal, 5 ou mais órgãos quando a estrutura permitir e pelo menos três classes de resultado.

### Onda 2 — chegar a quinze tribunais

Entrada: **TJPR, TJAP, TJAL, TJPA e TJES**. A curadoria deve reforçar diversidade regional e comparar câmaras cíveis com Turmas Recursais. TJPA e TJAL exigem controle especial de concentração; TJES deve ser usado para ampliar fraude e contratação digital.

### Onda 3 — cobertura nacional

Primeiro grupo: **TJRS, TJMS, TJAM, TJRO, TJSE e TJRR**. Segundo grupo, após validação dirigida: **TJAC, TJBA, TJMT, TJPB, TJRN e TJTO**. A ausência de amostra nesta rodada não autoriza exclusão permanente nem escore zero.

## 7. Indicadores e cobertura nacional

### 7.1 Índice de cobertura

Para cada tribunal:

`IC = 35% densidade + 25% qualidade/completude + 20% diversidade de orientação + 10% atualidade + 10% revisão`.

Indicadores mínimos do painel:

- decisões por tribunal, órgão, ano, produto, tema, tese, fundamento e resultado;
- proporção de fontes oficiais, agregadas auditáveis e links quebrados;
- proporção de campos essenciais completos;
- proporção favorável ao consumidor, desfavorável e intermediária/mista;
- concentração Herfindahl por órgão julgador;
- decisões pendentes de revisão humana e tempo médio no backlog;
- duplicatas por número CNJ e por identidade decisória;
- teses/fundamentos novos ainda não representáveis no schema;
- taxa de candidatos promovidos, rejeitados e mantidos em observação.

### 7.2 Regra de orientação

“Favorável/desfavorável” deve ser derivado por questão, não por um rótulo único do processo. Uma decisão pode manter a contratação, reconhecer falha informativa, negar dano moral e deferir revisão. O painel deve registrar orientação por tese e por remédio, preservando resultados intermediários.

## 8. Backlog e lacunas do schema

1. **Resultado composto:** permitir múltiplas soluções materiais sem forçar `mantido/anulado/inexistente/convertido` como descrição exaustiva.
2. **Orientação por tese:** registrar acolhida, rejeitada, parcial, prejudicada ou não enfrentada em cada vínculo.
3. **Fonte em camadas:** separar URL de recuperação auditável, URL oficial e status de conferência, sem bloquear publicação apenas pela ausência imediata do link oficial.
4. **Revisão pós-publicação:** preservar o estado automatizado pendente e trilha de correção, conforme autorização vigente.
5. **Questões e fundamentos livres:** taxonomia apoia busca, mas não substitui texto individualizado do que o colegiado efetivamente decidiu.
6. **Órgãos e competência:** normalizar variações de caixa/nome sem apagar a unidade julgadora original.
7. **Métricas de concentração:** incorporar o índice por órgão ao build de inteligência.
8. **Registro de busca negativa:** armazenar consulta, data, tribunal, termos e motivo de incerteza para evitar interpretar falha de recuperação como ausência de casos.

## 9. Recomendação final

A próxima ação não deve ser uma ingestão nacional indiscriminada. Deve ser a execução da Onda 0 em paralelo à montagem de lotes estratificados da Onda 1. A expansão só é saudável quando cada novo tribunal agrega contraste jurisprudencial, diversidade interna e temas novos, e não apenas mais decisões da mesma orientação.

O plano recomendado leva o acervo de cinco para dez tribunais com alto valor comparativo, depois a quinze com equilíbrio regional, e somente então à cobertura integral. A matriz deve ser recalculada após cada lote e nunca operar como whitelist rígida.

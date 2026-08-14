# Onda 0 / Etapa 0C — complementação dirigida

Tribunais: TJDFT, TJCE e TJMA. Data de corte: 14 de agosto de 2026.

## Readiness

`BLOCKED_REVIEW`

Foram preparados seis candidatos novos para revisão humana. Nenhum arquivo canônico foi criado e nenhuma aprovação foi presumida.

## Baseline confirmado

| Tribunal | Decisões | Lacuna principal |
| --- | ---: | --- |
| TJDFT | 56 | concentração temporal em 2025–2026; 4ª Turma Cível e Segunda Turma Recursal pouco representadas |
| TJCE | 36 | baixa cobertura anterior a 2023 e vínculos taxonômicos ainda concentrados; necessidade de contrastes probatórios e resultados compostos |
| TJMA | 32 | concentração em Turmas Recursais locais, mas forte saturação do inventário recuperado |

## Pesquisa e deduplicação

A consulta dirigida examinou 80 candidatos brutos e ranqueou 20 acórdãos. A deduplicação por CNJ contra as 186 decisões canônicas encontrou 14 precedentes já publicados. Todos os resultados úteis do TJMA eram duplicados do acervo; por isso, nenhum caso redundante foi retido apenas para assegurar representação nominal do tribunal.

Dos seis documentos novos, dois pertencem ao TJDFT e quatro ao TJCE. Eles foram classificados como prioridade A ou B por acrescentarem órgão sub-representado, resultado composto, eixo probatório ou divergência interna relevante.

## Seleção proposta

| Prioridade | Tribunal | Processo | Órgão | Data | Ganho marginal | Fonte |
| --- | --- | --- | --- | --- | --- | --- |
| A | TJDFT | 0711235-84.2024.8.07.0009 | 4ª Turma Cível | 25/03/2026 | biometria facial, validade do RCC, conversão e danos rejeitados em órgão pouco representado | [oficial](https://jurisdf.tjdft.jus.br/api/v1/pesquisa/download/530dedb0-3585-47bf-8d39-7b8fa2aa85c6) |
| A | TJDFT | 0823275-51.2025.8.07.0016 | Terceira Turma Recursal | 29/06/2026 | prova digital, TCE e saque; reforma de nulidade parcial para reconhecer validade | [oficial](https://jurisdf.tjdft.jus.br/api/v1/pesquisa/download/8ed90b44-52d1-4143-82a7-89f7e7f2ff1e) |
| A | TJCE | 0200024-39.2023.8.06.0117 | 1ª Turma do Núcleo 4.0 | 01/04/2026 | prescrição quinquenal parcial, restituição mista, conversão e dano moral | [JusRatio](https://api.jusratio.com.br/v1/docs/tjce-sjuris-35406086/inteiro-teor) |
| A | TJCE | 3002087-43.2025.8.06.0070 | 6ª Câmara de Direito Privado | 04/03/2026 | consumidor idoso e analfabeto, informação qualificada, conversão e restituição mista sem dano moral | [JusRatio](https://api.jusratio.com.br/v1/docs/tjce-sjuris-34439784/inteiro-teor) |
| B | TJCE | 0204225-47.2023.8.06.0029 | 2ª Turma do Núcleo 4.0 | 20/11/2025 | biometria, selfie, geolocalização e recebimento dos valores; validade e dano moral afastado | [JusRatio](https://api.jusratio.com.br/v1/docs/tjce-sjuris-31205463/inteiro-teor) |
| B | TJCE | 3051806-07.2025.8.06.0001 | 6ª Câmara de Direito Privado | 12/03/2026 | contraste no mesmo órgão: biometria e geolocalização suficientes, restituição e dano rejeitados | [JusRatio](https://api.jusratio.com.br/v1/docs/tjce-sjuris-34690014/inteiro-teor) |

## Valor comparativo

Os dois casos da 6ª Câmara do TJCE são deliberadamente mantidos como par comparativo, não como duplicação: um exige proteção informacional qualificada diante de consumidor idoso e analfabeto e converte o negócio; o outro considera biometria, geolocalização e documentação suficientes e mantém o contrato. A diferença deve ser modelada pelos fatos e pela suficiência material da informação, não por rótulos contraditórios abstratos.

No TJDFT, o caso da 4ª Turma Cível amplia um órgão quase ausente; o caso da Turma Recursal separa autoria digital, TCE, saque e resultado processual de reforma. No TJCE, o processo 0200024 acrescenta prescrição parcial e restituição temporalmente mista, e não pode ser reduzido a “contrato convertido”.

## Taxonomia

Não há necessidade preliminar de nova tese ou fundamento. Devem ser reutilizados, conforme confirmação humana, os itens sobre contratação digital, força probatória da assinatura, saque como prova, contratação de analfabeto, hipervulnerabilidade, dever de informação, conversão, prescrição, repetição, dano moral e rastreabilidade digital.

## Qualidade e gate

Os dois candidatos do TJDFT possuem fonte oficial direta. Os quatro do TJCE possuem inteiro teor recuperável pelo JusRatio e link auditável, mas a revisão deve conferir identidade, órgão, relator, dispositivo e correspondência da modelagem antes da geração de `reviewed`. A fonte agregada não será apresentada como confirmação oficial inexistente.

O próximo gate é a decisão humana individual sobre os seis processos: `APROVADO`, `APROVADO_COM_AJUSTES`, `NECESSITA_MAIS_EVIDENCIA` ou `EXCLUIR`.

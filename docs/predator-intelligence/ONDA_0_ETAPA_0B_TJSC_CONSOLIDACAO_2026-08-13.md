# Onda 0 / Etapa 0B — consolidação profunda do TJSC

Data de corte: 13 de agosto de 2026.

## Estado de governança

`BLOCKED_REVIEW`

O baseline já publicado permanece canônico, humanamente revisado e aprovado. Os sete novos candidatos abaixo foram descobertos, deduplicados, classificados e modelados para revisão, mas não foram promovidos: não existe decisão humana final para esses achados e não foi fabricado `reviewer_id`.

## Baseline canônico

| Métrica | Valor confirmado |
| --- | ---: |
| Decisões TJSC | 33 |
| Órgãos identificados | 3 |
| 3ª Câmara de Direito Comercial | 30 (90,91%) |
| Outros órgãos | 3 (9,09%) |
| Contratos anulados | 29 |
| Contratos mantidos | 4 |
| Período | 2020–2025 |
| Teses efetivamente vinculadas | 1 |
| HHI orgânico | 0,8301 |

Dois registros antigos usam `Indefinido` como órgão. Eles não foram reabertos porque o prompt considera o acervo publicado baseline aprovado e não surgiu evidência concreta que autorize alteração.

## Pesquisa e saturação

A consulta ampla foi estruturada para RMC, RCC, cartão consignado, contratação digital, biometria, assinatura eletrônica, geolocalização, uso, saque, fraude, nulidade, conversão, prescrição, repetição e dano moral, com filtro TJSC e acórdãos. O conector examinou 80 candidatos brutos e devolveu 16 documentos ranqueados.

O ganho marginal concentrou-se em quatro órgãos pouco ou não representados e em uma orientação oposta ao baseline: validade da contratação e improcedência quando contrato, termo de consentimento e rastros digitais demonstram autoria e ciência. Entre os 16 ranqueados, nove foram classificados como redundantes por repetirem a mesma combinação de órgão, prova e resultado; sete foram retidos. A pesquisa atingiu saturação prática para esse eixo porque os resultados restantes reiteravam, predominantemente, contratação digital válida e improcedência.

## Triagem

| Classe | Quantidade | Critério aplicado |
| --- | ---: | --- |
| A — prioridade máxima | 5 | Órgão ausente, resultado raro e/ou fato probatório novo |
| B — alta utilidade | 2 | Contraste orgânico ou probatório relevante |
| C — confirmação útil | 0 | Nenhum selecionado apenas para reforçar padrão |
| D — redundante | 9 | Repetição material entre os 16 ranqueados |
| E — excluir | 0 | Nenhum dos ranqueados estava fora do tema |

## Candidatos selecionados

| Prioridade | Processo | Órgão | Ano | Resultado material | Ganho marginal | Fonte |
| --- | --- | --- | ---: | --- | --- | --- |
| A | 5093865-06.2022.8.24.0930 | 5ª Câmara de Direito Comercial | 2024 | contrato mantido; ação improcedente; dano moral e repetição afastados | selfie, IP, TCE e menção ao IRDR | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321756902374565941974684226921) |
| A | 5002158-11.2025.8.24.0005 | 6ª Câmara de Direito Comercial | 2025 | contrato mantido; conversão rejeitada | biometria, geolocalização e compras no comércio | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321763042435696022161172099848) |
| A | 5035991-29.2023.8.24.0930 | 2ª Câmara de Direito Comercial | 2025 | contrato mantido; dano moral afastado | biometria, documento e protocolo de aceite | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321757028417812590827870443561) |
| A | 5032158-32.2025.8.24.0930 | 4ª Câmara de Direito Comercial | 2026 | sentença reformada; pedidos declaratórios e condenatórios improcedentes | uso comprovado e dever de informação | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321772567821172503347214203114) |
| A | 5002086-81.2023.8.24.0041 | 4ª Câmara de Direito Comercial | 2024 | contrato mantido; improcedência preservada | selfie repetida contestada e rastreabilidade eletrônica | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321756907426641708435173672849) |
| B | 5094500-50.2023.8.24.0930 | 2ª Câmara de Direito Comercial | 2025 | contrato mantido; venda casada rejeitada | saque como uso lícito da modalidade | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321757021355075169767217401743) |
| B | 5011111-52.2025.8.24.0008 | 4ª Câmara de Direito Comercial | 2025 | sentença reformada; contrato mantido | TCE digital e ausência de ato ilícito | [oficial](https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=321764685331951331372941703956) |

## Questões e fundamentos efetivamente enfrentados

Os candidatos não foram reduzidos à fórmula genérica de “vício de consentimento”. As questões modeladas distinguem: validade formal e material da contratação eletrônica; suficiência conjunta de selfie, biometria, IP, geolocalização, documento pessoal e protocolo; força do termo de consentimento esclarecido; compras, saque e uso posterior como confirmação; licitude autônoma da modalidade RMC/RCC; inexistência de ato ilícito e consequente rejeição da repetição e do dano moral; e reforma de sentença que havia invalidado o negócio.

Foram reutilizadas as teses canônicas `validade_contratacao_digital`, `forca_probatoria_assinatura`, `uso_reiterado_confirma_contratacao`, `credito_saque_como_prova_negocio`, `violacao_dever_informacao_transparencia`, `fraude_inexistencia_contratacao`, `repeticao_indebito_descontos`, `dano_moral_desconto_consignado` e `litigancia_predatoria_prova_individualizada`. Não foi criada tese nova.

Foram reutilizados os fundamentos `rastreabilidade_contratacao_digital`, `assinatura_como_prova_autoria`, `conduta_posterior_como_prova`, `uso_reiterado_cartao_indicio_consentimento`, `credito_em_conta_comprova_liberacao`, `dever_informacao_qualificado`, `informacao_sobre_amortizacao_e_custo`, `dano_moral_exige_repercussao_concreta` e `padronizacao_demanda_nao_basta`. Não foi criado fundamento novo.

## Divergência e evolução

O baseline é dominado pela 3ª Câmara e por anulação. O conjunto novo evidencia orientação materialmente distinta nas 2ª, 4ª, 5ª e 6ª Câmaras: o produto não é invalidado abstratamente; a solução depende da clareza do instrumento e da convergência entre consentimento documentado, rastros digitais e comportamento posterior. A 5ª Câmara registra expressamente que selfie, IP compatível com a residência e TCE afastam vício; a 6ª agrega biometria, geolocalização e compras; a 2ª reconhece fotografia, documento e protocolo; a 4ª valoriza uso comprovado e pode reformar sentença anulatória.

A pesquisa localizou decisões de 2024, 2025 e 2026 nessa orientação. Isso sugere mudança ou consolidação recente em comparação com o baseline concentrado entre 2020 e 2023, mas não autoriza afirmar uniformidade institucional sem examinar o IRDR e o inteiro teor de todos os paradigmas.

## Qualidade documental

Os sete registros têm CNJ, órgão, relator, data, dispositivo resumido e URL oficial do TJSC. O conector retornou ementa e decisão colegiada, mas não entregou texto integral separado (`total_chunks = 0`). A URL oficial redirecionou para o novo domínio do eproc e a recuperação automatizada foi encerrada pelo portal. Portanto, o status fiel é: identidade e conteúdo decisório oficial auditáveis pelo link, inteiro teor ainda não conferido integralmente.

## Concentração projetada

Se os sete candidatos forem humanamente aprovados e publicados, o TJSC passará de 33 para 40 decisões e de 3 para 6 categorias orgânicas registradas. A participação da 3ª Câmara cairá de 90,91% para 75,00%; o HHI orgânico cairá de 0,8301 para 0,5825. Os contratos mantidos passarão de 4 para 11, reduzindo a distorção anulatória sem retirar ou reescrever precedentes antigos.

## Próximo gate real

É necessária revisão humana dos sete arquivos da fila, com especial conferência do inteiro teor oficial e da correspondência entre ementa, dispositivo e modelagem. Após as decisões humanas finais, somente os aprovados poderão gerar `reviewed`, `proposal`, manifesto congelado, digest, pacote de autorização e promoção.

# Onda 1 / Etapa 1F — saneamento documental e metadados do TJSP

Data de corte: 14 de agosto de 2026.

## A. Escopo e gate

O universo consolidado possui **25 processos**: os 19 registros da Etapa 1A, os cinco acórdãos de novas Câmaras incorporados na Etapa 1B e o contraste do Núcleo 4.0 já documentado na matriz nacional. Não houve busca ampla, substituição de registro difícil ou incorporação incidental.

Foram feitas consultas exatas pelos 25 números CNJ e identificadores conhecidos. Dez registros tinham ao menos órgão, relator ou julgamento ausente no campo estruturado; todos foram saneados diretamente pelo fecho identificador do acórdão oficial. Os 25 inteiros teores foram recuperados, têm URL oficial persistente e identificador `cdAcordao`; não subsiste conflito entre fontes oficiais.

- corpus inicial e final: **25**;
- registros com metadado estruturado incompleto no início: **10**;
- registros integralmente saneados: **25**;
- registros incompletos ao final: **0**;
- inteiros teores preservados por referência oficial: **25**;
- conflitos de fonte: **0**;
- busca dirigida adicional de contraste: **não realizada**;
- novos `DIRECTED_CONTRAST_CANDIDATE`: **0**;
- novo estado: **`READY_FOR_STRATIFIED_SELECTION`**.

O saneamento não antecipa classificação A/B/C/D nem cria `PROMOVER`, `RESERVA` ou `REDUNDANTE`.

## B. Matriz de saneamento

Em todas as linhas, número CNJ, órgão, relator e julgamento foram conferidos no próprio acórdão oficial; “completo” significa decisão colegiada suficiente para distinguir resultado, prova-chave e questão enfrentada.

| Processo | Fonte oficial | Acórdão/ID | Órgão | Relator | Julgamento | Inteiro teor | Estado documental | Observação |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| 1033980-33.2024.8.26.0016 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=2135357&cdForo=9061) | 2135357 | 6ª Turma Recursal Cível | Vera Lúcia Calviño de Campos | 14/11/2025 | completo | `DOCUMENT_COMPLETE` | validade; selfie, geolocalização, TED e compras reiteradas |
| 1010389-57.2025.8.26.0032 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20082741&cdForo=0) | 20082741 | 20ª Câmara de Direito Privado | Lidia Regina Rodrigues Monteiro Cabrini | 28/01/2026 | completo | `DOCUMENT_COMPLETE` | órgão, relator e data recuperados do fecho; validade digital |
| 1002348-40.2025.8.26.0505 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20261213&cdForo=0) | 20261213 | Núcleo 4.0-T. III (DP2) | Gilberto Franceschini | 10/03/2026 | completo | `DOCUMENT_COMPLETE` | campos recuperados do fecho; biometria, IP, autenticação e depósito |
| 1008350-04.2025.8.26.0577 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20134476&cdForo=0) | 20134476 | Núcleo 4.0-T. VII (DP2) | Gustavo Santini Teodoro | 10/02/2026 | completo | `DOCUMENT_COMPLETE` | validade; saque inicial e compras |
| 1013494-15.2024.8.26.0020 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20309173&cdForo=0) | 20309173 | 20ª Câmara de Direito Privado | Maria Salete Corrêa Dias | 20/03/2026 | completo | `DOCUMENT_COMPLETE` | validade; biometria, IP, termo esclarecido e saque |
| 1030109-22.2024.8.26.0007 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20164424&cdForo=0) | 20164424 | Núcleo 4.0-T. II (DP2) | João Battaus Neto | 18/02/2026 | completo | `DOCUMENT_COMPLETE` | fraude rejeitada; contratação eletrônica validada |
| 1011697-27.2024.8.26.0077 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19323301&cdForo=0) | 19323301 | 20ª Câmara de Direito Privado | Lidia Regina Rodrigues Monteiro Cabrini | 09/06/2025 | completo | `DOCUMENT_COMPLETE` | data recuperada do fecho; selfies e geolocalização |
| 1155268-21.2023.8.26.0100 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19959927&cdForo=0) | 19959927 | Núcleo 4.0-T. IV (DP2) | Ricardo Hoffmann | 13/11/2025 | completo | `DOCUMENT_COMPLETE` | metadados recuperados do fecho; validade eletrônica |
| 1015958-12.2024.8.26.0020 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20261247&cdForo=0) | 20261247 | Núcleo 4.0-T. III (DP2) | Gilberto Franceschini | 10/03/2026 | completo | `DOCUMENT_COMPLETE` | data confirmada; biometria, uso e recebimento |
| 1004257-33.2024.8.26.0318 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19069372&cdForo=0) | 19069372 | Núcleo 4.0-T. IV (DP2) | Léa Duarte | 01/04/2025 | completo | `DOCUMENT_COMPLETE` | órgão e data recuperados; selfie, IP, geolocalização e crédito |
| 1019088-64.2024.8.26.0196 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20197375&cdForo=0) | 20197375 | Núcleo 4.0-T. IV (DP2) | Ricardo Hoffmann | 25/02/2026 | completo | `DOCUMENT_COMPLETE` | validade e uso; multa por má-fé no resultado processual |
| 1013971-65.2024.8.26.0302 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19990953&cdForo=0) | 19990953 | Núcleo 4.0-T. III (DP2) | Daniella Carla Russo | 24/11/2025 | completo | `DOCUMENT_COMPLETE` | data confirmada; biometria, documento e saques |
| 1013449-83.2025.8.26.0405 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20264079&cdForo=0) | 20264079 | Núcleo 4.0-T. II (DP2) | João Battaus Neto | 11/03/2026 | completo | `DOCUMENT_COMPLETE` | sentença reformada para improcedência; biometria e uso |
| 1002898-63.2024.8.26.0022 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20394761&cdForo=0) | 20394761 | Núcleo 4.0-T. II (DP2) | Marcio Bonetti | 14/04/2026 | completo | `DOCUMENT_COMPLETE` | metadados recuperados; biometria e termo esclarecido |
| 1020417-84.2024.8.26.0011 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20137198&cdForo=0) | 20137198 | Núcleo 4.0-T. III (DP2) | Gilberto Franceschini | 10/02/2026 | completo | `DOCUMENT_COMPLETE` | conversão rejeitada; prova documental da contratação |
| 1000064-96.2025.8.26.0040 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20147958&cdForo=0) | 20147958 | 20ª Câmara de Direito Privado | Maria Salete Corrêa Dias | 12/02/2026 | completo | `DOCUMENT_COMPLETE` | data confirmada; dois contratos, autenticação e uso |
| 1000200-78.2025.8.26.0045 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19905733&cdForo=0) | 19905733 | Núcleo 4.0-T. II (DP2) | João Battaus Neto | 30/10/2025 | completo | `DOCUMENT_COMPLETE` | validade; termo destacado, uso e lapso temporal |
| 1001802-25.2025.8.26.0136 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20629525&cdForo=0) | 20629525 | Núcleo 4.0-T. II (DP2) | Marcia Tessitore | 09/06/2026 | completo | `DOCUMENT_COMPLETE` | registrado em 16/06/2026; biometria e geolocalização |
| 1014202-29.2025.8.26.0344 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20300815&cdForo=0) | 20300815 | Núcleo 4.0-T. II (DP2) | Marcio Bonetti | 19/03/2026 | completo | `DOCUMENT_COMPLETE` | caso prioritário integralmente saneado |
| 1001452-98.2024.8.26.0515 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19447049&cdForo=0) | 19447049 | 13ª Câmara de Direito Privado | Ana de Lourdes Coutinho Silva da Fonseca | 11/07/2025 | completo | `DOCUMENT_COMPLETE` | validade; contrato e crédito recebido |
| 1004977-73.2024.8.26.0132 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19329093&cdForo=0) | 19329093 | 15ª Câmara de Direito Privado | Rodolfo Pellizari | 10/06/2025 | completo | `DOCUMENT_COMPLETE` | assinatura eletrônica sem ICP-Brasil e depósito |
| 1007977-84.2025.8.26.0637 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20392267&cdForo=0) | 20392267 | 18ª Câmara de Direito Privado | Wilson Julio Zanluqui | 13/04/2026 | completo | `DOCUMENT_COMPLETE` | validade; biometria, IP, hash e saque único sem compras |
| 1026261-63.2023.8.26.0071 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19863417&cdForo=0) | 19863417 | 38ª Câmara de Direito Privado | Flavia Beatriz Goncalez da Silva | 20/10/2025 | completo | `DOCUMENT_COMPLETE` | validade; uso reiterado e possibilidade de cancelamento |
| 1004025-78.2024.8.26.0008 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=19167371&cdForo=0) | 19167371 | 19ª Câmara de Direito Privado | João Camillo de Almeida Prado Costa | 30/04/2025 | completo | `DOCUMENT_COMPLETE` | contratação digital insuficiente; inexistência, restituição simples e moral de R$ 5 mil |
| 1162898-94.2024.8.26.0100 | [TJSP](https://esaj.tjsp.jus.br/cjsg/getArquivo.do?cdAcordao=20111841&cdForo=0) | 20111841 | Núcleo 4.0-T. VII (DP2) | Gustavo Santini Teodoro | 04/02/2026 | completo | `DOCUMENT_COMPLETE` | falha informacional; conversão, compensação e restituição |

## C. Caso 1014202-29.2025.8.26.0344 — acórdão 20300815

A identidade documental está comprovada pelo encadeamento convergente do acórdão oficial:

- número CNJ no fecho: `1014202-29.2025.8.26.0344`;
- identificador oficial e URL: `cdAcordao=20300815`;
- classe: Apelação Cível;
- foro de origem: Capão Bonito, 2ª Vara;
- órgão: Núcleo 4.0-T. II (Direito Privado 2);
- relator: Marcio Bonetti;
- julgamento e registro: 19/03/2026;
- resultado: recurso desprovido, contratação eletrônica mantida, vício/falha informacional rejeitados, sem repetição ou dano moral;
- prova determinante: validação biométrica, instrumento e termo informacional, acompanhados da disponibilização do crédito.

O documento pertence inequivocamente ao processo e o registro deixa de ser `INSUFFICIENT_METADATA`, passando a **`DOCUMENT_COMPLETE`**.

## D. Auditoria de proveniência

- URLs oficiais persistentes: **25/25**;
- identificadores oficiais de acórdão: **25/25**;
- registros reidentificáveis a partir deste relatório: **25/25**;
- registros dependentes apenas de fonte externa secundária: **0**;
- conflitos oficiais: **0**.

O relatório reutiliza a estrutura documental existente e preserva URL, `cdAcordao`, identidade, órgão, relator e julgamento. O conteúdo integral permanece reproduzível diretamente no eSAJ; não foi criada arquitetura paralela nem alterado conteúdo canônico. A única dependência externa remanescente é a disponibilidade operacional futura do portal oficial, mitigada pela preservação simultânea do identificador e dos metadados decisórios.

## E. Auditoria de representatividade

Órgãos representados: 13ª, 15ª, 18ª, 19ª, 20ª e 38ª Câmaras de Direito Privado; Núcleos 4.0 II, III, IV e VII; e 6ª Turma Recursal Cível — **11 unidades funcionais**.

Concentração por órgão:

- Núcleo 4.0-T. II: 6/25 (24%);
- Núcleo 4.0-T. III: 4/25 (16%);
- 20ª Câmara: 4/25 (16%);
- Núcleo 4.0-T. IV: 3/25 (12%);
- Núcleo 4.0-T. VII: 2/25 (8%);
- cada um dos seis órgãos restantes: 1/25 (4%).

A cobertura temporal vai de abril de 2025 a junho de 2026. O corpus continua materialmente inclinado à manutenção: **23** decisões mantêm ou restauram a validade e **2** oferecem contraste invalidante/revisional. O contraste, embora minoritário, é utilizável e não meramente nominal:

- `1004025-78.2024.8.26.0008`, 19ª Câmara: a documentação digital não comprovou vínculo seguro; reconhecidos inexistência, restituição simples e dano moral;
- `1162898-94.2024.8.26.0100`, Núcleo 4.0-T. VII: contrato formalmente existente, mas dever de informação insuficiente; conversão e efeitos patrimoniais.

Esses casos permitem comparar inexistência por insuficiência de autenticação com conversão por insuficiência informacional, além de contratação robusta por biometria/IP/hash, saque único, compras reiteradas e crédito sem contestação. Assim, o predomínio numérico de validade não impede futura seleção estratificada e não foi artificialmente corrigido por expansão.

## F. Casos de contraste dirigidos

Não houve nova busca dirigida nem incorporação de `DIRECTED_CONTRAST_CANDIDATE`. Os dois contrastes necessários já pertenciam ao universo consolidado e foram apenas recuperados e saneados. Nenhum processo incidental foi incorporado.

## G. Próximo gate e quadro assimétrico

Os requisitos documentais foram satisfeitos. Novo gate do TJSP: **`READY_FOR_STRATIFIED_SELECTION`**.

Próxima ação autorizada: **Onda 1 / Etapa 1G — seleção estratificada do TJSP**.

| Tribunal | Estado | Próxima ação autorizada |
| --- | --- | --- |
| TJMG | `READY_FOR_HUMAN_REVIEW` | revisão humana dos 13 `PROMOVER` |
| TJRJ | `READY_FOR_HUMAN_REVIEW` | revisão humana dos 13 `PROMOVER` |
| TJGO | `READY_FOR_HUMAN_REVIEW` | revisão humana dos 15 `PROMOVER` |
| TJPE | `READY_FOR_HUMAN_REVIEW` | revisão humana dos 22 `PROMOVER` |
| TJSP | `READY_FOR_STRATIFIED_SELECTION` | Onda 1 / Etapa 1G — seleção estratificada do TJSP |

A execução termina neste gate. Não houve seleção A/B/C/D, revisão humana, proposta, autorização, promoção, alteração canônica, publicação ou deploy.

# Integração oficial de jurisprudência

## Escopo operacional

O monitoramento inicial cobre acórdãos cíveis sobre consignado/RMC/RCC, seguros prestamistas e juros abusivos, usando os termos: cartão de crédito consignado, RMC, RCC, reserva de margem consignável, dever de informação, vício de consentimento, fraude bancária e seguro prestamista.

## Fontes e publicação

- A API pública do TJDFT é a fonte de descoberta e o inteiro teor oficial do tribunal é a fonte canônica de publicação. Um candidato só pode ser publicado quando houver URL direta verificável, inteiro teor, integridade da fonte e deduplicação aprovadas.
- O DataJud é usado exclusivamente para descoberta e enriquecimento de metadados/movimentos. Ele não fornece o inteiro teor canônico e nunca autoriza publicação isolada de um resultado DataJud.
- A operação do Predator News é não comercial. A chave DataJud deve ser fornecida em `DATAJUD_API_KEY` em tempo de execução e nunca deve ser gravada no repositório.

Referências oficiais: [API de pesquisa do TJDFT](https://jurisdf.tjdft.jus.br/api/v1/pesquisa), [documentação dos endpoints DataJud](https://datajud-wiki.cnj.jus.br/api-publica/endpoints), [acesso e autenticação DataJud](https://datajud-wiki.cnj.jus.br/api-publica/acesso) e [termos de uso](https://datajud-wiki.cnj.jus.br/api-publica/termos-de-uso).

## Componentes

`src/ingestion/adapters/tjdft-public-api.mjs` consulta a API SETI, normaliza os registros e constrói somente URLs oficiais de acórdãos. `src/ingestion/adapters/datajud-public-api.mjs` consulta os aliases oficiais do DataJud com Query DSL, paginação por `search_after` e autenticação por variável de ambiente. Ambos produzem candidatos; a promoção continua submetida às regras de integridade e publicação automática do dataset.


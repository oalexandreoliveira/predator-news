# Dados da Inteligência Jurídica

## Escopo atual

Esta camada implementa a infraestrutura do EP01, o dataset piloto DATASET-001, as páginas de Jurisprudência do EP02 e os bancos de Teses e Fundamentos do EP03 e EP04. Não existe integração com as edições.

## Organização

- `data/jurisprudencia/`: uma decisão por arquivo YAML.
- `data/teses/`: catálogo extensível de teses.
- `data/fundamentos/`: catálogo extensível de fundamentos.
- `data/taxonomy/`: valores controlados e aliases.
- `schemas/`: contratos JSON Schema Draft 2020-12.
- `scripts/data/`: carregamento e validações estrutural, taxonômica, referencial e de duplicidade.

O nome do arquivo deve ser idêntico ao `id` da decisão ou ao `slug` da tese/fundamento.

## Validação

```text
npm run validate:data
npm test
npm run build
```

O build valida os dados antes de gerar o site. Um erro de schema, taxonomia, referência ou duplicidade encerra o comando com falha.

Após a validação, o build gera `/jurisprudencia/`, `/teses/` e `/fundamentos/`, além de uma página individual para cada entidade ativa. Busca, filtros, contagens, relações inversas e indicadores são derivados dos registros validados; nenhum índice jurídico paralelo é mantido manualmente.

As relações decisão → tese e decisão → fundamento partem das decisões. A relação fundamento → tese parte do catálogo de teses. Nas páginas de tese, os fundamentos exibidos são apenas aqueles efetivamente usados pelas decisões relacionadas na amostra atual. Entidades sem decisões permanecem navegáveis e exibem contagem zero, sem inferências.

## Rastreabilidade

Toda decisão deve apontar para uma página ou documento oficial em HTTPS. `fonte.natureza` identifica a fonte jurídica; `fonte.recuperado_via` registra apenas o meio usado para localizá-la.

Campos não comprovados pela fonte não devem ser inferidos. Quando o contrato exige a presença do campo, deve ser utilizado `null` ou `nao_informado`, conforme o tipo previsto na taxonomia.

## Deduplicação

A chave natural é tribunal + número CNJ sem pontuação. O identificador persistente segue:

```text
{tribunal}-{numero-cnj-com-pontos-substituidos-por-hifens}
```

## Revisão jurídica

A validação automatizada confirma integridade técnica, não substitui revisão jurídica do inteiro teor. Alterações em tese, fundamentos, enums ou classificação de resultados exigem revisão de domínio.

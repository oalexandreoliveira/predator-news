# Manutenção técnica

## Tecnologias utilizadas

O site é estático e gerado em Node.js, sem framework de front-end.

- JavaScript em módulo ES para o gerador.
- Markdown com front matter simples para as edições.
- HTML gerado pelo script de build.
- CSS próprio.
- Canvas em página isolada para o radar.
- GitHub Actions para build e deploy.
- GitHub Pages para hospedagem.

## Organização relevante

- `content/edicoes/`: edições em Markdown e `_MODELO.md`.
- `scripts/build.mjs`: leitura do conteúdo, transformação do Markdown e geração de todas as páginas.
- `src/style.css`: estilos, temas e responsividade.
- `src/radar.html`: implementação visual do radar em canvas.
- `dist/`: saída gerada pelo build; é recriada do zero.
- `package.json`: comando de build e metadados do projeto.
- `.github/workflows/deploy-pages.yml`: pipeline de publicação.
- `data/`: decisões, teses, fundamentos e taxonomia da Inteligência Jurídica.
- `schemas/`: contratos JSON Schema dos dados estruturados.
- `scripts/data/`: carregamento e validação dos dados.
- `tests/`: testes de integridade estrutural, referencial e de duplicidade.

## Validação da Inteligência Jurídica

O comando `npm run validate:data` valida schemas, taxonomia, aliases, referências e duplicidades. `npm test` executa também cenários negativos. O comando `npm run build` executa a validação antes de recriar `dist/`.

Os dados estruturados geram as listagens `/jurisprudencia/`, `/teses/` e `/fundamentos/`, com páginas individuais em `/jurisprudencia/{decision-id}/`, `/teses/{slug}/` e `/fundamentos/{slug}/`. As relações e contagens das páginas de Teses e Fundamentos são agregadas no build a partir dos registros validados. A Home, o arquivo e as páginas de edição continuam sendo produzidos exclusivamente a partir de `content/edicoes/` e não foram integrados à camada jurídica.

## Publicação editorial e manutenção técnica

### Publicação editorial

Cria uma nova edição em `content/edicoes/`. Não modifica código, estilos, layout ou workflow.

### Manutenção técnica

Altera `scripts/`, `src/`, `package.json`, workflow, comportamento visual ou processo de geração. Deve ser tratada separadamente da publicação diária e exigir validação técnica mais ampla.

## Home e arquivo de edições

A home não é mantida como HTML manual. Ela é criada por `scripts/build.mjs` e gravada em `dist/index.html`.

O script:

1. lê os arquivos `.md` de `content/edicoes/`;
2. ignora nomes iniciados por `_`;
3. interpreta o front matter;
4. ordena as edições por data decrescente;
5. usa a primeira como edição atual;
6. gera os cards da seção de arquivo;
7. gera a home completa.

A seção `#edicoes` da própria home funciona como arquivo de edições. Não foi identificado arquivo-fonte separado para uma página autônoma de arquivo.

## Processamento do Markdown

`parseEdition()` separa front matter e corpo. Os campos obrigatórios no código são `titulo`, `data`, `categoria` e `resumo`.

O conversor interno aceita:

- títulos `#`, `##` e `###`;
- listas iniciadas por `-`;
- blockquotes iniciados por `>`;
- negrito e itálico simples;
- links HTTP ou HTTPS.

O parser não é uma implementação Markdown completa. Tabelas, HTML embutido, blocos de código e sintaxes avançadas não devem ser usados sem alteração e teste do gerador.

## Páginas individuais

Para cada edição, o build cria:

`dist/edicoes/<slug>/index.html`

O slug vem do campo `slug`, quando presente, ou do nome do arquivo sem `.md`. O padrão editorial atual não utiliza campo `slug`; portanto, o nome do arquivo define a URL.

A página individual exibe metadados, resumo e corpo convertido para HTML.

## Aplicação imediata

O gerador procura no corpo as primeiras seções `##` com os nomes:

- Tese do dia;
- Prova que não pode faltar;
- Risco processual;
- Frase de peça;
- Pergunta da edição ou Pergunta para comentário.

Esses trechos alimentam o bloco “Da notícia para a atuação” mostrado na home para a edição mais recente. Como as edições atuais repetem esses títulos em três notícias, o código captura apenas a primeira ocorrência de cada seção, correspondente à notícia principal.

## Busca

Os cards recebem um campo normalizado composto por:

- número;
- título;
- resumo;
- categoria.

A normalização remove acentos, converte para minúsculas e substitui caracteres não alfanuméricos por espaços. A busca ocorre no navegador e pode ser combinada com filtro de categoria.

## Filtros

As categorias são obtidas diretamente dos front matters e deduplicadas. O botão “Todas” mostra todos os cards; os demais filtram por correspondência exata da categoria.

Variações de grafia ou capitalização em `categoria` criam filtros distintos. A taxonomia deve ser controlada editorialmente.

## Botão de copiar frase

Quando a seção “Frase de peça” contém conteúdo, o gerador cria um botão com `data-copy-quote`. O script da página usa `navigator.clipboard.writeText()` e altera temporariamente o texto do botão para “Copiado”.

A funcionalidade depende de contexto seguro, normalmente HTTPS, e da disponibilidade da API de clipboard do navegador.

## Radar em canvas

A home incorpora o radar por um `iframe` apontando para:

`/assets/radar.html`

Durante o build, `src/radar.html` é copiado para `dist/assets/radar.html`. Parâmetros de consulta controlam velocidade, cor, fundo e comportamento visual.

A integração é carregada de forma lazy e marcada como decorativa para tecnologias assistivas.

## Responsividade e temas

A responsividade e os estilos ficam em `src/style.css`. O HTML gerado inclui `meta viewport`.

O site possui temas claro e escuro. A preferência é armazenada em `localStorage` sob a chave `predator-theme`, e o botão de alternância atualiza `data-theme` no elemento raiz.

Qualquer alteração estrutural em classes geradas por `scripts/build.mjs` deve ser sincronizada com `src/style.css`.

## GitHub Actions e Pages

O workflow `.github/workflows/deploy-pages.yml`:

1. executa em push na `main` para caminhos configurados;
2. baixa o projeto;
3. configura Node.js 22;
4. executa `npm run build` com `BASE_PATH=/predator-news`;
5. envia `dist` como artefato;
6. publica no ambiente `github-pages`.

A pasta `dist` é gerada e não deve ser editada manualmente.

## Pontos de atenção antes de alterar código

- Ler o arquivo inteiro antes de modificar funções compartilhadas.
- Verificar se a mudança afeta home e páginas individuais.
- Preservar `BASE_PATH`, pois o site é publicado em subdiretório.
- Não incluir `_MODELO.md` como edição.
- Não alterar a lógica de ordenação sem considerar datas ISO.
- Testar busca com e sem acentos.
- Testar filtros com todas as categorias existentes.
- Testar clipboard em HTTPS.
- Testar radar e fallback visual.
- Validar tema claro, escuro e persistência.
- Conferir responsividade em largura móvel e desktop.
- Não misturar manutenção técnica com publicação editorial.

## Arquivos responsáveis

- Home: `scripts/build.mjs`, com estilos em `src/style.css` e radar em `src/radar.html`.
- Arquivo de edições: seção gerada dentro da home por `scripts/build.mjs`.
- Páginas individuais: `scripts/build.mjs`.
- Deploy: `.github/workflows/deploy-pages.yml` e comando definido em `package.json`.

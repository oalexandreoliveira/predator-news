# Fluxo de publicação

## Visão geral

Pesquisa → validação → seleção → numeração → geração do Markdown → validação → commit → GitHub Actions → verificação do site.

A publicação diária ocorre em uma única execução autônoma.

A tarefa não depende de resultados produzidos por outros chats, tarefas ou conversas.

Quando não houver três notícias válidas, a execução termina como `PUBLICAÇÃO INTERROMPIDA`, sem alterações no repositório.

## 1. Pesquisa e validação

Pesquisar acontecimentos das últimas 24 a 48 horas conforme `docs/EDITORIAL.md`. Reunir de cinco a oito candidatos e confirmar data, fonte direta, natureza do acontecimento e utilidade prática.

## 2. Seleção

Escolher três notícias conectadas por um fio condutor. A primeira notícia define título, categoria, resumo e slug.

## 3. Localização das edições

As edições ficam em:

`content/edicoes/`

O arquivo `_MODELO.md` é referência estrutural e não é edição publicada.

## 4. Nome do arquivo

Usar:

`AAAA-MM-DD-slug-descritivo.md`

O slug deve estar em letras minúsculas, sem acentos, com palavras separadas por hífen e sem termos desnecessários.

## 5. Cálculo do próximo número

A numeração nunca deve ser inferida pela quantidade de arquivos.

Procedimento obrigatório:

1. Ler o campo `numero` dos front matters das edições existentes.
2. Ignorar `_MODELO.md` e qualquer arquivo cujo nome comece com `_`.
3. Descartar números ausentes ou inválidos.
4. Encontrar o maior número válido.
5. Somar 1.
6. Preservar dois dígitos enquanto o número for inferior a 100.

## 6. Prevenção de duplicidade

Antes da redação e imediatamente antes do commit:

- verificar se já existe arquivo iniciado pela data editorial;
- verificar se o número calculado já está em uso;
- comparar título, data e slug;
- não criar segunda edição ordinária para a mesma data.

Se já existir edição do dia, a execução deve ser interrompida ou tratada como correção explicitamente autorizada.

## 7. Front matter

Usar exatamente:

```yaml
---
titulo: "Título editorial da edição"
numero: "NN"
data: "AAAA-MM-DD"
categoria: "Categoria dominante"
resumo: "Resumo curto para a página inicial e o arquivo."
tempo_leitura: "N min"
---
```

O gerador exige `titulo`, `data`, `categoria` e `resumo`. Quando ausentes, o build falha. O código usa `numero` e `tempo_leitura` com valores padrão, mas a publicação editorial deve sempre preenchê-los expressamente.

## 8. Validação do Markdown

Confirmar:

- abertura e fechamento do front matter;
- seis campos preenchidos;
- data ISO;
- três notícias;
- fio condutor e fechamento;
- seções editoriais de cada notícia;
- links completos;
- ausência de placeholders;
- ausência de informação inventada.

## 9. Escopo permitido na publicação editorial

A publicação ordinária cria um único arquivo em `content/edicoes/`.

Não alterar durante essa operação:

- `scripts/build.mjs`;
- `src/style.css`;
- `src/radar.html`;
- `.github/workflows/deploy-pages.yml`;
- `package.json`;
- edições anteriores.

## 10. Commit

Mensagem padrão:

`Publica Predator News NN — AAAA-MM-DD`

Correções e manutenção usam mensagens próprias e descritivas.

## 11. Situações que interrompem a publicação

- menos de três notícias válidas;
- fonte essencial inacessível;
- front matter inválido;
- placeholders remanescentes;
- duplicidade de data ou número;
- repositório, modelo ou pasta de edições inacessível;
- diferença material em edição já publicada sem autorização de correção.

## 12. GitHub Actions

O workflow `.github/workflows/deploy-pages.yml` é acionado por push na `main` quando há alteração em:

- `content/**`;
- `scripts/**`;
- `src/**`;
- `package.json`;
- no próprio workflow.

O job usa Node.js 22, executa `npm run build`, envia a pasta `dist` como artefato e publica no GitHub Pages.

Alterações somente em `docs/**` não acionam automaticamente o deploy, conforme o filtro atual de caminhos.

## 13. Verificação do site

Após o workflow, verificar:

### Home

- HTTP 200;
- edição mais recente em destaque;
- número, data, título e resumo corretos;
- card presente no arquivo de edições.

### Arquivo de edições

A home contém a seção de arquivo, identificada por `#edicoes`, com busca, filtros por categoria e cards de todas as edições.

Validar:

- inclusão da nova edição;
- ordenação por data decrescente;
- busca por número, título, resumo e categoria;
- busca sem diferenciação de acentos;
- filtro da categoria dominante.

### Página individual

URL:

`/predator-news/edicoes/SLUG/`

Validar:

- HTTP 200;
- número, data, categoria e título;
- resumo;
- corpo completo;
- links externos;
- botão de copiar frase, quando houver bloco de frase.

## 14. Resultado da execução

Registrar o resultado em formato compatível com `docs/RELATORIO-DE-EXECUCAO.md`.

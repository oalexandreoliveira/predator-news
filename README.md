# Predator News

Newsletter jurídica publicada automaticamente no GitHub Pages a partir de arquivos Markdown.

## Criar uma nova edição

1. Copie `content/edicoes/_MODELO.md`.
2. Renomeie o arquivo usando `AAAA-MM-DD-titulo-curto.md`.
3. Preencha os campos entre `---` e escreva o informativo abaixo.
4. Envie o arquivo para a branch `main`.

O GitHub Actions atualizará automaticamente:

- a edição em destaque;
- o histórico;
- a busca;
- os filtros por categoria;
- a página individual da edição.

Não é necessário editar HTML, CSS ou JavaScript para publicar uma nova edição.

## Estrutura de uma edição

```md
---
titulo: "Título da edição"
numero: "03"
data: "2026-07-05"
categoria: "Consignado INSS"
resumo: "Resumo exibido no arquivo."
tempo_leitura: "6 min"
---

## O que aconteceu

Conteúdo da edição.
```

Site: https://oalexandreoliveira.github.io/predator-news/

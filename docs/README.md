# Documentação do Predator News

## Documentos

- [Diretrizes editoriais](EDITORIAL.md)
- [Fluxo de publicação](PUBLICACAO.md)
- [Manutenção técnica](MANUTENCAO.md)
- [Relatório de execução](RELATORIO-DE-EXECUCAO.md)
- [Dados da Inteligência Jurídica](DADOS-INTELIGENCIA-JURIDICA.md)

## Fontes de verdade

- Repositório: estado atual do site.
- `content/edicoes/_MODELO.md`: formato oficial das edições.
- `docs/EDITORIAL.md`: regras editoriais.
- `docs/PUBLICACAO.md`: processo operacional.
- `docs/MANUTENCAO.md`: arquitetura e manutenção.

## Escopo

Esta pasta concentra a documentação permanente do Predator News. Ela separa as decisões editoriais do procedimento de publicação e da manutenção técnica do site.

Em caso de divergência, deve-se primeiro verificar o comportamento efetivo de `scripts/build.mjs` e do workflow `.github/workflows/deploy-pages.yml`. A documentação deve ser atualizada quando a arquitetura, o padrão editorial ou o processo de publicação forem modificados.

# Ingestão jurisprudencial

Área operacional privada do pipeline Predator Intelligence. Nada neste diretório é fonte jurídica canônica ou deve ser copiado para `dist/`.

- `config/` e `schemas/` são versionados.
- `fixtures/` contém somente dados sintéticos.
- `state/`, `cache/` e `batches/` são efêmeros e ignorados pelo Git, exceto `.gitkeep`.
- O orçamento de exemplo é deliberadamente inoperante. Uma operação onerosa falha enquanto limite, hard stop ou custo não forem configurados.
- Não há adaptador JusRatio neste incremento.

Validação: `npm run validate:ingestion` e `node --test --test-concurrency=1`.

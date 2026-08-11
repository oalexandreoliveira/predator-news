import { searchTjdf } from '../../src/ingestion/adapters/tjdft-public-api.mjs';
import { buildDatajudDiscoveryQuery, searchDatajud } from '../../src/ingestion/adapters/datajud-public-api.mjs';

const args = process.argv.slice(2);
const value = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const query = value('--query');
if (!query) { console.error('Uso: npm run search:official -- --query "termo" [--pagina 0] [--tamanho 10] [--datajud-alias tjdft]'); process.exit(2); }
const pagina = Number(value('--pagina') ?? 0);
const tamanho = Number(value('--tamanho') ?? 10);
const tjdft = await searchTjdf({ query, pagina, tamanho });
const output = { tjdft: { hits: tjdft.hits, pagina: tjdft.pagina, tamanho: tjdft.tamanho, candidates: tjdft.candidates } };
const alias = value('--datajud-alias');
if (alias) {
  const body = buildDatajudDiscoveryQuery({ text: query, size: Math.max(10, tamanho) });
  output.datajud = await searchDatajud({ tribunalAlias: alias, body });
}
console.log(JSON.stringify(output, null, 2));

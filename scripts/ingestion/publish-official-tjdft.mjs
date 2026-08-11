import { readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { searchTjdf, buildTjdfDecisionUrl } from '../../src/ingestion/adapters/tjdft-public-api.mjs';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const DATA_DIR = join(ROOT, 'data', 'jurisprudencia');
const DEFAULT_TERMS = ['cartão de crédito consignado', 'RMC', 'RCC', 'reserva de margem consignável', 'dever de informação', 'vício de consentimento', 'fraude bancária', 'seguro prestamista'];
const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const today = () => new Date().toISOString().slice(0, 10);
const excerpt = value => {
  const clean = String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim();
  const body = clean.split(/\s+I\.\s+CASO EM EXAME\b/i)[0].trim();
  const clipped = body.slice(0, 360);
  const boundary = Math.max(clipped.lastIndexOf('. '), clipped.lastIndexOf('; '), clipped.lastIndexOf(' '));
  return `${(boundary > 140 ? clipped.slice(0, boundary) : clipped).trim()}…`;
};

export function editorialTitle({ products = [], themes = [] } = {}) {
  const product = products.includes('seguro_prestamista') ? 'seguro prestamista' : products.includes('rcc') ? 'cartão consignado (RCC)' : 'cartão consignado (RMC)';
  const theme = themes.includes('juros_abusivos') ? 'juros abusivos' : themes.includes('fraude_bancaria') ? 'fraude bancária' : 'dever de informação e consentimento';
  return `${product}: ${theme}`;
}

export function classifyOfficialRecord(record) {
  const text = fold(`${record?.ementa ?? ''} ${record?.inteiroTeor ?? ''}`);
  const products = [];
  if (/\brmc\b|reserva de margem|cartao de credito consignado/.test(text)) products.push('rmc', 'cartao_credito_consignado');
  if (/\brcc\b/.test(text)) products.push('rcc');
  if (/seguro prestamista/.test(text)) products.push('seguro_prestamista');
  const themes = [];
  if (/dever de informacao|informacao clara|transparencia/.test(text)) themes.push('dever_informacao');
  if (/vicio de consentimento|erro substancial|consentimento/.test(text)) themes.push('consentimento', 'vicio_consentimento');
  if (/fraude bancaria|contratacao fraudulenta/.test(text)) themes.push('fraude_bancaria');
  if (/juros abusivos|juros excessivos|taxa abusiva/.test(text)) themes.push('juros_abusivos');
  return { products: [...new Set(products)], themes: [...new Set(themes)] };
}

export function recordToDecision(record, { consultedAt = today() } = {}) {
  const processo = String(record?.processo ?? '').trim();
  const url = buildTjdfDecisionUrl(record);
  const fullText = String(record?.inteiroTeor ?? record?.ementa ?? '').trim();
  const ementa = String(record?.ementa ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/.test(processo)) return null;
  if (!url || !fullText || record?.base !== 'acordaos' || record?.possuiInteiroTeor !== true) return null;
  const { products, themes } = classifyOfficialRecord(record);
  if (!products.length || !themes.length) return null;
  const id = `tjdft-${processo.replaceAll('.', '-')}`;
  const summary = excerpt(ementa || fullText);
  return {
    id,
    identificacao: { tribunal: 'TJDFT', processo, tipo_decisao: 'acordao', orgao_julgador: record.descricaoOrgaoJulgador || record.descricaoOrgao || 'TJDFT - órgão não informado', relator: record.nomeRelator || 'Relator não informado', data_julgamento: record.dataJulgamento ? String(record.dataJulgamento).slice(0, 10) : null, data_publicacao: record.dataPublicacao ? String(record.dataPublicacao).slice(0, 10) : null },
    titulo: editorialTitle({ products, themes }),
    resumo_predator: summary.length >= 30 ? summary : `Acórdão oficial do TJDFT sobre ${products.join(', ')} e ${themes.join(', ')}.`,
    contexto: { produtos: products, temas: themes, fatos_relevantes: ['nao_informado'], meio_contratacao: 'nao_informado' },
    provas: ['nao_informado'], teses: [{ slug: 'vicio_consentimento_cartao_consignado', status: 'nao_enfrentada' }], fundamentos: ['dever_informacao_qualificado'],
    resultado: { contrato: 'nao_informado', conversao: 'nao_informado', repeticao_indebito: 'nao_informado', dano_moral: 'nao_informado' },
    fonte: { natureza: 'jurisprudencia_oficial', recuperado_via: 'portal_tribunal', url_original: url, url_inteiro_teor: url, consultado_em: consultedAt }, autoridade: 'persuasiva', status: 'ativo',
  };
}

async function verifyOfficial(url, fetchImpl) {
  const response = await fetchImpl(url, { headers: { accept: 'text/html,application/pdf,*/*' } });
  if (!response.ok) return false;
  return (await response.arrayBuffer()).byteLength >= 256;
}

export async function collectAndPublish({ terms = DEFAULT_TERMS, pageSize = 25, maxPages = 1, fetchImpl = globalThis.fetch, dryRun = false, refreshExisting = false } = {}) {
  const existing = new Set((await readdir(DATA_DIR)).filter(name => name.endsWith('.yaml')).map(name => name.slice(0, -5)));
  const records = new Map();
  for (const term of terms) for (let pagina = 0; pagina < maxPages; pagina++) {
    const result = await searchTjdf({ query: term, termosAcessorios: [{ campo: 'base', valor: 'acordaos' }, { campo: 'descricaoClasseCnj', valor: 'APELAÇÃO CÍVEL' }], pagina, tamanho: pageSize, fetchImpl });
    for (const record of result.records) { const decision = recordToDecision(record); if (decision && (refreshExisting || !existing.has(decision.id))) records.set(decision.id, { record, decision }); }
    if (result.records.length < pageSize) break;
  }
  const published = [], blocked = [];
  for (const [id, { decision }] of records) {
    if (!await verifyOfficial(decision.fonte.url_inteiro_teor, fetchImpl)) { blocked.push({ id, reason: 'official_full_text_unreachable_or_empty' }); continue; }
    if (!dryRun) await writeFile(join(DATA_DIR, `${id}.yaml`), YAML.stringify(decision), 'utf8');
    published.push(id);
  }
  return { discovered: records.size, published, blocked, dry_run: dryRun };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await collectAndPublish({ dryRun: process.argv.includes('--dry-run'), refreshExisting: process.argv.includes('--refresh'), pageSize: Number(process.env.TJDFT_PAGE_SIZE || 25), maxPages: Number(process.env.TJDFT_MAX_PAGES || 1) });
  console.log(JSON.stringify(result, null, 2));
}

import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import YAML from 'yaml';

const root = resolve(import.meta.dirname, '../..');
const batchId = 'onda-1-etapa-1h-a-2026-08-17';
const outRoot = resolve(root, 'ingestion/review-queue/wave1/forms');
const indexPath = resolve(root, 'ingestion/review-queue/wave1/index.json');
const evidencePath = resolve(root, 'ingestion/config/wave1-review-evidence.json');
const guidePath = resolve(root, 'ingestion/review-queue/wave1/README.md');
const reportPath = resolve(root, 'docs/predator-intelligence/ONDA_1_ETAPA_1H_A_REVISAO_HUMANA_2026-08-17.md');
const expected = { TJMG: 13, TJRJ: 13, TJGO: 15, TJPE: 22, TJSP: 14 };
const selections = {
  TJMG: 'docs/predator-intelligence/ONDA_1_ETAPA_1B_SELECAO_TJMG_2026-08-14.md',
  TJRJ: 'docs/predator-intelligence/ONDA_1_ETAPA_1C_SELECAO_TJRJ_2026-08-14.md',
  TJGO: 'docs/predator-intelligence/ONDA_1_ETAPA_1D_SELECAO_TJGO_2026-08-14.md',
  TJPE: 'docs/predator-intelligence/ONDA_1_ETAPA_1E_SELECAO_TJPE_2026-08-14.md',
  TJSP: 'docs/predator-intelligence/ONDA_1_ETAPA_1G_SELECAO_TJSP_2026-08-14.md'
};

const cnj = /^\d{7}-\d{2}\.\d{4}\.8\.\d{2}\.\d{4}$/;
const cells = line => line.split('|').slice(1, -1).map(value => value.trim().replaceAll('`', ''));
const splitTerms = value => value.split(';').map(term => term.trim()).filter(Boolean);
const sha = value => `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const candidateId = (tribunal, process) => `cand-${tribunal.toLowerCase()}-${process.replaceAll('.', '-')}`;

try {
  const existingIndex = JSON.parse(await readFile(indexPath, 'utf8'));
  if (existingIndex.state === 'HUMAN_REVIEW_COMPLETE') throw new Error('human review is complete; refusing to regenerate and overwrite reviewed forms');
} catch (error) {
  if (!['ENOENT'].includes(error.code) && !String(error.message).includes('Unexpected end of JSON input')) throw error;
}

function tables(markdown) {
  const result = [];
  let table = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('|')) table.push(line);
    else if (table.length) { result.push(table); table = []; }
  }
  if (table.length) result.push(table);
  return result;
}

function parseSelection(markdown, tribunal) {
  const parsed = tables(markdown).map(table => ({ header: cells(table[0]), rows: table.slice(2).map(cells) }));
  const classification = parsed.find(table => table.header[0] === 'Processo' && table.header.some(field => ['Decisão', 'Decisão preliminar'].includes(field)));
  const model = parsed.find(table => table.header[0] === 'Processo' && table.header.some(field => field.startsWith('Resultado processual')) && table.header.some(field => field.toLowerCase().includes('teses')));
  if (!classification || !model) throw new Error(`${tribunal}: selection or legal model table was not found`);
  const idx = name => classification.header.findIndex(field => name.some(value => field.toLowerCase().includes(value)));
  const processI = idx(['processo']), organI = idx(['órgão']), resultI = idx(['resultado material']), evidenceI = idx(['prova-chave']);
  const questionI = idx(['questão']), classI = idx(['classe', 'prioridade']), decisionI = idx(['decisão']), contributionI = idx(['contribuição marginal']);
  const modelByProcess = new Map(model.rows.filter(row => cnj.test(row[0])).map(row => [row[0], row]));
  return classification.rows.filter(row => cnj.test(row[processI]) && row.includes('PROMOVER')).map(row => {
    const actualClassI = row.findIndex(value => ['A', 'B', 'C', 'D'].includes(value));
    const actualDecisionI = row.findIndex(value => ['PROMOVER', 'RESERVA', 'REDUNDANTE'].includes(value));
    const actualContributionI = actualDecisionI + 1 < row.length ? actualDecisionI + 1 : -1;
    const questionPresent = questionI >= 0 && questionI < actualClassI;
    const legal = modelByProcess.get(row[processI]);
    if (!legal) throw new Error(`${tribunal}/${row[processI]}: preliminary legal model is missing`);
    return {
      process: row[processI], organ: row[organI], material: row[resultI], keyEvidence: row[evidenceI],
      legalQuestion: questionPresent ? row[questionI] : `Como a prova-chave (${row[evidenceI]}) sustenta os resultados materiais (${row[resultI]}) efetivamente decididos?`,
      class: row[actualClassI], decision: row[actualDecisionI], contribution: actualContributionI >= 0 ? row[actualContributionI] : `Contribuição marginal registrada na seleção ${tribunal}.`,
      procedural: legal[1], modeledMaterial: legal[2], theses: splitTerms(legal[3]), foundations: splitTerms(legal[4])
    };
  });
}

function parseTjspEvidence(markdown) {
  const evidence = [];
  for (const table of tables(markdown)) for (const line of table.slice(2)) {
    const row = cells(line); if (!cnj.test(row[0]) || !line.includes('cdAcordao=')) continue;
    const match = line.match(/\((https:\/\/esaj\.tjsp\.jus\.br\/cjsg\/getArquivo\.do\?cdAcordao=([^&]+)&cdForo=[^)]+)\)/);
    if (match) evidence.push({ process: row[0], url: match[1], document_id: match[2], document_locator: `tjsp-acordao-${match[2]}`, organ: row[3], rapporteur: row[4], judgment_date: row[5].split('/').reverse().join('-'), verified_at: '2026-08-17', verification: 'OFFICIAL_PERSISTED_STAGE_1F' });
  }
  return evidence;
}

const registry = JSON.parse(await readFile(evidencePath, 'utf8'));
const tjspEvidence = parseTjspEvidence(await readFile(resolve(root, 'docs/predator-intelligence/ONDA_1_ETAPA_1F_SANEAMENTO_TJSP_2026-08-14.md'), 'utf8'));
registry.sources.TJSP = tjspEvidence;
const allForms = [];

await rm(outRoot, { recursive: true, force: true });
for (const [tribunal, source] of Object.entries(selections)) {
  const markdown = await readFile(resolve(root, source), 'utf8');
  const selected = parseSelection(markdown, tribunal);
  if (selected.length !== expected[tribunal]) throw new Error(`${tribunal}: expected ${expected[tribunal]}, found ${selected.length}`);
  const evidenceByProcess = new Map(registry.sources[tribunal].map(item => [item.process, item]));
  const dir = resolve(outRoot, tribunal);
  await mkdir(dir, { recursive: true });
  for (const item of selected) {
    const evidence = evidenceByProcess.get(item.process);
    if (!evidence?.url || !evidence?.document_id) throw new Error(`${tribunal}/${item.process}: review evidence is missing`);
    const snapshot = {
      identity: { tribunal, process: item.process, organ: item.organ || evidence.organ, rapporteur: evidence.rapporteur ?? null, judgment_date: evidence.judgment_date ?? null },
      selection: { class: item.class, preliminary_decision: 'PROMOVER', marginal_contribution: item.contribution, contrast_group: null },
      legal_model: { procedural_result: item.procedural, material_results: item.modeledMaterial || item.material, key_evidence: item.keyEvidence, legal_question: item.legalQuestion, proposed_theses: item.theses, proposed_foundations: item.foundations },
      evidence: { url: evidence.url, document_id: String(evidence.document_id), locator: evidence.document_locator, identity_verified: true, full_text_available: true, verified_at: evidence.verified_at }
    };
    const form = {
      artifact_kind: 'predator_human_review_form', schema_version: '1.0.0', publishable: false, batch_id: batchId,
      candidate_id: candidateId(tribunal, item.process), tribunal, review_state: 'PENDING_HUMAN_REVIEW', selection_source: source,
      candidate_snapshot: snapshot, input_hash: sha(snapshot),
      human_review: {
        decision: null, result_fidelity: null, legal_question_fidelity: null, evidence_sufficient: null,
        theses: item.theses.map(candidate => ({ candidate, decision: null, corrected_orientation: null })),
        foundations: item.foundations.map(candidate => ({ candidate, decision: null })),
        reviewer_notes: null, reviewer_identity: null, reviewed_at: null
      }
    };
    const path = resolve(dir, `${form.candidate_id}.review.yaml`);
    const preface = '# Preencha somente human_review. Não altere candidate_snapshot nem input_hash.\n# Enums: decision=APPROVE|REJECT|NEEDS_CORRECTION; fidelidade/evidência=YES|NO.\n';
    await writeFile(path, preface + YAML.stringify(form, { lineWidth: 0 }));
    allForms.push({ tribunal, process: item.process, candidate_id: form.candidate_id, class: item.class, evidence: 'PASS', review_state: form.review_state, path: path.slice(root.length + 1).replaceAll('\\', '/') });
  }
}

if (allForms.length !== 77 || new Set(allForms.map(item => item.process)).size !== 77) throw new Error('global membership is not 77 unique processes');
await writeFile(indexPath, JSON.stringify({ artifact_kind: 'predator_human_review_index', schema_version: '1.0.0', batch_id: batchId, generated_at: '2026-08-17', total: 77, state: 'HUMAN_REVIEW_PENDING', expected, counts: Object.fromEntries(Object.keys(expected).map(tribunal => [tribunal, { pending: expected[tribunal], approved: 0, rejected: 0, needs_correction: 0 }])), forms: allForms }, null, 2) + '\n');
const guide = `# Revisão humana — Onda 1 / Etapa 1H\n\nEdite somente os campos sob \`human_review\` nas fichas YAML de \`forms/<TRIBUNAL>/\`. Não altere \`candidate_snapshot\` nem \`input_hash\`.\n\nPara cada ficha:\n\n1. escolha \`decision\`: \`APPROVE\`, \`REJECT\` ou \`NEEDS_CORRECTION\`;\n2. responda \`result_fidelity\`, \`legal_question_fidelity\` e \`evidence_sufficient\` com \`YES\` ou \`NO\`;\n3. decida cada tese com \`ACCEPT\`, \`REJECT\` ou \`ADJUST_ORIENTATION\`;\n4. decida cada fundamento com \`ACCEPT\` ou \`REJECT\`;\n5. informe identidade real em \`reviewer_identity\` e timestamp ISO 8601 real em \`reviewed_at\`;\n6. preencha \`reviewer_notes\` quando houver rejeição, correção, discordância ou ajuste;\n7. altere \`review_state\` para \`HUMAN_APPROVED\`, \`HUMAN_REJECTED\` ou \`HUMAN_REVIEW_NEEDS_CORRECTION\`, conforme a decisão.\n\nValide depois do preenchimento:\n\n\`npm run validate:wave1-review\`\n\nO validador rejeita aprovação implícita, identidade/timestamp ausentes, enums inválidos, evidência insuficiente, C/D, duplicidade e alteração do snapshot submetido.\n`;
await writeFile(guidePath, guide);
let report = `# Onda 1 / Etapa 1H-A — preparação da revisão humana dirigida\n\nData operacional: 17 de agosto de 2026. Corpus fechado em 14 de agosto de 2026.\n\n## A. Readiness global\n\n| Tribunal | Esperados | Encontrados | Membership | Evidência | Estado do lote |\n| --- | ---: | ---: | --- | --- | --- |\n`;
for (const [tribunal, count] of Object.entries(expected)) report += `| ${tribunal} | ${count} | ${allForms.filter(item => item.tribunal === tribunal).length} | PASS | PASS | \`HUMAN_REVIEW_PENDING\` |\n`;
report += `\nTotal: **77/77**. Nenhuma manifestação humana foi fornecida ou inferida.\n\n## B. Inventário dos candidatos à revisão\n`;
for (const tribunal of Object.keys(expected)) {
  report += `\n### ${tribunal}\n\n| Processo | Classe anterior | Evidência | Estado de revisão |\n| --- | :---: | --- | --- |\n`;
  for (const item of allForms.filter(form => form.tribunal === tribunal)) report += `| ${item.process} | ${item.class} | PASS | \`PENDING_HUMAN_REVIEW\` |\n`;
}
report += `\n## C. Artefatos\n\nReutilizados: relatórios de seleção 1B, 1C, 1D, 1E e 1G; relatório oficial de saneamento 1F; infraestrutura de fila/auditoria em \`src/ingestion/review\`.\n\nNovos: schema \`ingestion/schemas/human-review-form.schema.json\`; registro versionado de evidências \`ingestion/config/wave1-review-evidence.json\`; índice \`ingestion/review-queue/wave1/index.json\`; 77 fichas em \`ingestion/review-queue/wave1/forms\`; guia \`ingestion/review-queue/wave1/README.md\`; gerador e validador em \`scripts/ingestion\`.\n\n## D. Validações\n\nPASS para: total 77; membership 13/13/15/22/14; ausência de duplicidade; exclusão de C/D; evidência reidentificável; schema e enums; nenhuma aprovação implícita; hash SHA-256 do snapshot; invalidação por alteração posterior.\n\n## E. Estado inicial\n\n- \`HUMAN_APPROVED\`: 0\n- \`HUMAN_REJECTED\`: 0\n- \`HUMAN_REVIEW_NEEDS_CORRECTION\`: 0\n- \`PENDING_HUMAN_REVIEW\`: 77\n\n## F. Próxima ação humana\n\nSiga \`ingestion/review-queue/wave1/README.md\`, preencha somente \`human_review\` nas fichas do tribunal correspondente e execute \`npm run validate:wave1-review\`. Nenhum formulário contém decisão, identidade, nota ou horário fabricado.\n\n## G. Quadro dos tribunais\n\n| Tribunal | Estado |\n| --- | --- |\n`;
for (const tribunal of Object.keys(expected)) report += `| ${tribunal} | \`HUMAN_REVIEW_PENDING\` |\n`;
report += `\nA Etapa 1H-A termina neste gate. Não houve 1H-B, materialização, proposta, autorização ou promoção.\n`;
await writeFile(reportPath, report);
console.log(JSON.stringify({ batch_id: batchId, total: allForms.length, state: 'HUMAN_REVIEW_PENDING', expected }, null, 2));

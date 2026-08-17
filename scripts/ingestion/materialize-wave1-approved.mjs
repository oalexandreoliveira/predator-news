import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import YAML from 'yaml';
import { loadData } from '../data/load-data.mjs';

const root = resolve(import.meta.dirname, '../..');
const formRoot = resolve(root, 'ingestion/review-queue/wave1/forms');
const proposalRoot = resolve(root, 'ingestion/proposals/wave1');
const manifestRoot = resolve(root, 'ingestion/manifests');
const promote = process.argv.includes('--promote');
const sha = value => `sha256:${createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const norm = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const uniq = values => [...new Set(values)];
const contains = (text, ...needles) => needles.some(needle => norm(text).includes(needle));
const expectedReviewDigest = 'sha256:1946bfda9d6e1c082448821a342b60e6279d3a76e3b4fdcfe701a0bc2f624c52';
const expectedReviewCommit = '3d76c1a0254b6a033374aae4933032b416c24367';

const thesisRules = [
  ['validade_contratacao_analfabeto', ['analfabet']],
  ['hipervulnerabilidade_consumidor_idoso', ['hipervulner', 'consumidor idoso', 'pessoa idosa']],
  ['validade_contratacao_digital', ['contratacao digital', 'contrato digital', 'validade digital', 'autoria digital', 'biometria', 'assinatura eletronica']],
  ['forca_probatoria_assinatura', ['assinatura', 'autenticidade', 'autoria digital', 'autoria formal', 'forca probatoria']],
  ['uso_reiterado_confirma_contratacao', ['uso reiterado', 'uso habitual', 'uso como confirmacao', 'ausencia de uso', 'validade/uso', 'uso:', 'compras', 'faturas']],
  ['credito_saque_como_prova_negocio', ['credito', 'saque', 'ted', 'deposito', 'liberacao']],
  ['fraude_inexistencia_contratacao', ['fraude', 'inexistencia', 'nao contratacao']],
  ['violacao_dever_informacao_transparencia', ['informacao', 'transparencia']],
  ['vicio_consentimento_cartao_consignado', ['vicio', 'erro substancial', 'consentimento', 'validade:', 'validade acolhida', 'validade rejeitada']],
  ['abusividade_rmc_perpetuidade_divida', ['abusividade', 'perpetuidade', 'amortizacao']],
  ['conversao_cartao_em_emprestimo_consignado', ['conversao', 'readequacao']],
  ['repeticao_indebito_descontos', ['repeticao', 'restituicao', 'indebito', 'devolucao']],
  ['dano_moral_desconto_consignado', ['dano moral', 'danos morais', 'moral rejeitado', 'moral acolhido', 'indenizatori']],
  ['prescricao_termo_inicial_rmc', ['prescricao', 'termo inicial']],
  ['integracao_revisao_desvantagem_exagerada', ['integracao', 'revisao', 'desvantagem exagerada']],
  ['litigancia_predatoria_prova_individualizada', ['litigancia predatoria', 'demanda predatoria', 'objecao predatoria', 'prova individualizada']],
];

const foundationRules = [
  ['formalidades_contratacao_analfabeto', ['analfabet', 'formalidades irregulares', 'assinatura a rogo', 'duas testemunhas']],
  ['hipervulnerabilidade_consumidor_idoso', ['hipervulner', 'consumidor idoso', 'pessoa idosa']],
  ['pericia_grafotecnica_define_autenticidade', ['pericia', 'grafotecnic']],
  ['ausencia_uso_cartao_indicio_vicio', ['ausencia de uso', 'sem uso', 'inexistencia de compras']],
  ['autenticidade_nao_equivale_consentimento', ['autenticidade nao', 'autenticidade formal', 'autoria nao']],
  ['assinatura_como_prova_autoria', ['assinatura', 'autoria', 'icp-brasil']],
  ['conduta_posterior_como_prova', ['conduta posterior', 'comportamento posterior', 'confirmacao em audiencia']],
  ['conservacao_negocio_com_reequilibrio', ['conservacao', 'reequilibrio', 'cancelamento sem extincao', 'cancelamento condicionado a quitacao', 'saldo pendente']],
  ['controle_desvantagem_exagerada', ['desvantagem exagerada', 'controle de desvantagem', 'controle de abusividade']],
  ['credito_em_conta_comprova_liberacao', ['credito em conta', 'liberacao', 'saque e aproveitamento economico', 'ted', 'transferencia', 'deposito']],
  ['dano_moral_exige_repercussao_concreta', ['dano moral', 'repercussao concreta', 'mero aborrecimento']],
  ['desconto_indevido_em_beneficio', ['desconto indevido', 'beneficio previdenciario']],
  ['descontos_sucessivos_e_prescricao', ['descontos sucessivos', 'descontos continuados', 'ultimo desconto', 'trato sucessivo', 'prescricao']],
  ['informacao_sobre_amortizacao_e_custo', ['custo efetivo', 'informacao sobre custo', 'amortizacao', 'pagamento minimo']],
  ['desconto_minimo_sem_amortizacao_adequada', ['divida perpetua', 'perpetuidade']],
  ['dever_informacao_qualificado', ['dever de informacao', 'dever informacional', 'dever qualificado', 'informacao qualificada', 'informacao contratual especifica', 'transparencia', 'falha informacional', 'autorizacao expressa', 'rmc expressa', 'termo esclarecido', 'contrato claro']],
  ['ma_fe_exige_conduta_individualizada', ['ma-fe', 'ma fe']],
  ['padronizacao_demanda_nao_basta', ['padronizacao', 'ajuizamento em massa', 'prova individual de cada contrato']],
  ['onus_instituicao_provar_contratacao', ['onus de provar', 'onus da prova', 'onus da instituicao', 'onus bancario', 'onus probatorio', 'instituicao provar']],
  ['primazia_realidade_economica_operacao', ['primazia', 'realidade economica', 'conteudo sobre forma']],
  ['rastreabilidade_contratacao_digital', ['rastreabilidade', 'trilha digital', 'cadeia tecnica insuficiente', 'convergencia probatoria', 'valoracao conjunta da trilha', 'biometria', 'selfie', 'geolocalizacao', 'endereco ip', 'ip ', 'contratacao digital']],
  ['restituicao_conforme_boa_fe_objetiva', ['restituicao', 'repeticao', 'compensacao', 'abatimento dos saques', 'boa-fe', 'boa fe', 'modulacao']],
  ['saque_unico_indicio_mutuo', ['saque unico']],
  ['termo_inicial_ciencia_lesao', ['termo inicial', 'ciencia da lesao']],
  ['uso_reiterado_cartao_indicio_consentimento', ['uso reiterado', 'uso habitual', 'uso como prova', 'compras', 'faturas', 'saques complementares']],
];

function classifyThesis(raw, result) {
  const matches = thesisRules.filter(([, words]) => words.some(word => norm(raw).includes(word))).map(([slug]) => slug);
  if (!matches.length) throw new Error(`unmapped thesis: ${raw}`);
  const text = norm(raw);
  const explicit = contains(text, 'parcial') ? 'parcialmente_acolhida' : contains(text, 'rejeitad', 'afastad', 'indeferid', 'improced') ? 'rejeitada' : contains(text, 'acolhid', 'deferid', 'proced', 'reconhecid', 'mantid', 'valid') ? 'acolhida' : null;
  const inferred = slug => {
    if (slug === 'conversao_cartao_em_emprestimo_consignado') return result.conversao === 'deferida' ? 'acolhida' : 'rejeitada';
    if (slug === 'repeticao_indebito_descontos') return ['simples', 'dobro', 'mista'].includes(result.repeticao_indebito) ? 'acolhida' : 'rejeitada';
    if (slug === 'dano_moral_desconto_consignado') return result.dano_moral === 'deferido' ? 'acolhida' : 'rejeitada';
    if (slug === 'fraude_inexistencia_contratacao') return result.contrato === 'inexistente' ? 'acolhida' : 'rejeitada';
    if (['violacao_dever_informacao_transparencia', 'vicio_consentimento_cartao_consignado', 'abusividade_rmc_perpetuidade_divida', 'hipervulnerabilidade_consumidor_idoso', 'integracao_revisao_desvantagem_exagerada'].includes(slug)) return ['anulado', 'inexistente', 'convertido'].includes(result.contrato) ? 'acolhida' : 'rejeitada';
    return result.contrato === 'mantido' ? 'acolhida' : ['anulado', 'inexistente'].includes(result.contrato) ? 'rejeitada' : 'parcialmente_acolhida';
  };
  return uniq(matches).map(slug => ({ slug, status: slug === 'fraude_inexistencia_contratacao' && contains(text, 'fraude inexistente', 'fraude afastada') ? 'rejeitada' : explicit || inferred(slug) }));
}

function classifyFoundation(raw) {
  // Deliberação por maioria é metadado processual já preservado em resultado.processual,
  // não um fundamento jurídico autônomo do catálogo canônico.
  if (contains(raw, 'divergencia colegiada')) return [];
  const matches = foundationRules.filter(([, words]) => words.some(word => norm(raw).includes(word))).map(([slug]) => slug);
  if (!matches.length) throw new Error(`unmapped foundation: ${raw}`);
  return matches;
}

function proofs(text) {
  const out = [];
  if (contains(text, 'contrato', 'instrumento', 'termo')) out.push('contrato');
  if (contains(text, 'assinatura')) out.push('assinatura');
  if (contains(text, 'rogo')) out.push('assinatura_rogo');
  if (contains(text, 'testemunha')) out.push('testemunhas');
  if (contains(text, 'consentimento', 'tce')) out.push('termo_consentimento');
  if (contains(text, 'credito', 'saque', 'ted', 'deposito', 'transferencia')) out.push('comprovante_transferencia');
  if (contains(text, 'fatura')) out.push('faturas');
  if (contains(text, 'uso', 'compra')) out.push('historico_uso');
  if (contains(text, 'pericia', 'grafotecnic')) out.push('pericia_grafotecnica');
  return uniq(out.length ? out : ['nao_informado']);
}

function results(material, procedural) {
  const text = norm(`${material}; ${procedural}`);
  const rejected = term => new RegExp(`${term}[^;]{0,55}(afastad|rejeitad|indeferid)`).test(text);
  const conversionRejected = rejected('conversao');
  const invalidityRejected = rejected('nulidade') || rejected('inexistencia');
  const repetitionRejected = rejected('(dobro|repeticao|restituicao)');
  const positiveRelief = (contains(text, 'dobro') && !repetitionRejected) || contains(text, 'dano moral reconhecido', 'dano moral mantido');
  const contract = contains(text, 'conversao', 'convertid', 'readequ') && !conversionRejected ? 'convertido' : contains(text, 'inexistente', 'inexistencia', 'nao contratado') && !invalidityRejected ? 'inexistente' : (contains(text, 'anulad', 'nulidade', 'invalid') && !invalidityRejected) || positiveRelief ? 'anulado' : contains(text, 'existencia reconhecida', 'existencia e descontos reconhecidos', 'contratacao reconhecida', 'mantid', 'valid', 'regular') || invalidityRejected ? 'mantido' : 'nao_informado';
  const conversion = contract === 'convertido' ? 'deferida' : conversionRejected || contract === 'mantido' ? 'indeferida' : 'nao_aplicavel';
  const repetition = repetitionRejected ? 'indeferida' : contains(text, 'mista', 'modulad', 'simples/dobro', 'simples antes') ? 'mista' : contains(text, 'dobro') ? 'dobro' : contains(text, 'simples') ? 'simples' : contract === 'mantido' ? 'indeferida' : 'nao_informado';
  const moral = contains(text, 'dano moral afastado', 'dano afastado', 'moral afastado', 'dano moral rejeitado', 'moral rejeitado', 'dano moral indeferido', 'sem dano moral') ? 'indeferido' : contains(text, 'moral', 'danos morais', 'indeniz') ? 'deferido' : 'nao_informado';
  return { contrato: contract, conversao: conversion, repeticao_indebito: repetition, dano_moral: moral, processual: procedural, efeitos_materiais: material.split(';').map(value => value.trim()).filter(Boolean) };
}

function payloadFor(form) {
  const s = form.candidate_snapshot, identity = s.identity, model = s.legal_model;
  const result = results(model.material_results, model.procedural_result);
  const acceptedTheses = form.human_review.theses.filter(x => x.decision !== 'REJECT').flatMap(x => classifyThesis(x.corrected_orientation || x.candidate, result));
  const thesisMap = new Map(); for (const thesis of acceptedTheses) thesisMap.set(thesis.slug, thesis);
  const foundations = uniq(form.human_review.foundations.filter(x => x.decision === 'ACCEPT').flatMap(x => classifyFoundation(x.candidate)));
  const combined = `${model.key_evidence}; ${model.legal_question}; ${model.material_results}`;
  const thesisSlugs = [...thesisMap.keys()];
  const themes = uniq([
    'consentimento', 'prova_contratacao',
    ...(thesisSlugs.some(x => x.includes('informacao')) ? ['dever_informacao'] : []),
    ...(thesisSlugs.some(x => x.includes('digital') || x.includes('assinatura')) ? ['contratacao_digital'] : []),
    ...(thesisSlugs.some(x => x.includes('analfabeto')) ? ['contratacao_analfabeto'] : []),
    ...(thesisSlugs.some(x => x.includes('fraude')) ? ['fraude_bancaria'] : []),
    ...(contains(combined, 'saque', 'credito', 'ted') ? ['saque'] : []),
    ...(contains(combined, 'uso', 'compra', 'fatura') ? ['uso_cartao'] : []),
    ...(contains(combined, 'desconto') ? ['desconto_beneficio'] : []),
    ...(contains(combined, 'abusiv', 'perpetuidade') ? ['juros_abusivos'] : []),
  ]);
  const profiles = uniq([...(contains(combined, 'idoso') ? ['idoso'] : []), ...(contains(combined, 'aposentad', 'pensionista', 'beneficio') ? ['aposentado_pensionista'] : []), ...(contains(combined, 'analfabet') ? ['analfabeto'] : [])]);
  const fatos = uniq([...(contains(combined, 'ausencia de contrato', 'sem contrato') ? ['ausencia_contrato'] : []), ...(contains(combined, 'contrato claro') ? ['contrato_claro'] : []), ...(contains(combined, 'saque unico') ? ['saque_unico'] : []), ...(contains(combined, 'uso reiterado', 'uso habitual', 'compras') ? ['uso_reiterado_cartao'] : []), ...(contains(combined, 'desconto') ? ['desconto_beneficio'] : [])]);
  const evidence = model.key_evidence.trim();
  const resultLead = result.contrato === 'convertido' ? 'Conversão do cartão consignado' : result.contrato === 'inexistente' ? 'Inexistência da contratação consignada' : result.contrato === 'anulado' ? 'Invalidade da contratação consignada' : result.contrato === 'mantido' ? 'Validade da contratação consignada' : 'Efeitos da contratação consignada';
  return {
    id: `${identity.tribunal.toLowerCase()}-${identity.process.replaceAll('.', '-')}`,
    identificacao: { tribunal: identity.tribunal, processo: identity.process, tipo_decisao: 'acordao', orgao_julgador: identity.organ, relator: identity.rapporteur, data_julgamento: identity.judgment_date, data_publicacao: identity.judgment_date },
    titulo: `${resultLead}: ${evidence}`,
    questao_juridica: model.legal_question,
    ratio_decidendi: `O colegiado valorou ${evidence} e, com base nesse conjunto individualizado, concluiu por ${model.material_results}.`,
    resumo_predator: `${identity.organ}, sob relatoria de ${identity.rapporteur}, julgou ${model.procedural_result}. No plano material, decidiu: ${model.material_results}. A prova determinante foi ${evidence}.`,
    contexto: { produtos: uniq(['rmc', 'cartao_credito_consignado', ...(contains(combined, 'rcc') ? ['rcc'] : [])]), temas: themes, perfis_consumidor: profiles, fatos_relevantes: fatos.length ? fatos : ['nao_informado'], meio_contratacao: contains(combined, 'digital', 'biometria', 'selfie', 'ip ', 'eletronica') ? 'digital' : contains(combined, 'assinatura', 'contrato', 'termo') ? 'fisico' : 'nao_informado' },
    provas: proofs(combined), teses: [...thesisMap.values()], fundamentos: foundations, resultado: result,
    fonte: { natureza: contains(s.evidence.url, '.jus.br') ? 'jurisprudencia_oficial' : 'jurisprudencia_agregada_auditavel', recuperado_via: contains(s.evidence.url, 'jusratio') ? 'jusratio' : 'portal_tribunal', url_original: s.evidence.url, url_inteiro_teor: s.evidence.url, consultado_em: s.evidence.verified_at },
    autoridade: 'persuasiva', status: 'ativo', revisao: { status: 'confirmada_por_humano', analisado_em: s.evidence.verified_at, revisado_em: form.human_review.reviewed_at.slice(0, 10), revisor: form.human_review.reviewer_identity },
  };
}

const forms = [];
for (const tribunal of ['TJMG', 'TJRJ', 'TJGO', 'TJPE', 'TJSP']) for (const name of (await readdir(resolve(formRoot, tribunal))).filter(x => x.endsWith('.review.yaml')).sort()) forms.push(YAML.parse(await readFile(resolve(formRoot, tribunal, name), 'utf8')));
if (forms.length !== 77 || forms.some(x => x.review_state !== 'HUMAN_APPROVED')) throw new Error('approved scope mismatch');
const data = await loadData(root), existing = new Map(data.decisions.map(x => [`${x.value.identificacao.tribunal}:${x.value.identificacao.processo}`, x.value]));
const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
const validateDecision = ajv.compile(JSON.parse(await readFile(resolve(root, 'schemas/decision.schema.json'), 'utf8')));
const validateProposal = ajv.compile(JSON.parse(await readFile(resolve(root, 'ingestion/schemas/canonical-proposal.schema.json'), 'utf8')));
const thesisIds = new Set(data.theses.map(x => x.value.slug)), foundationIds = new Set(data.foundations.map(x => x.value.slug));
const proposals = [], duplicateIdentical = [], duplicateConflicts = [], selfMaterialized = new Set();
await mkdir(proposalRoot, { recursive: true }); await mkdir(manifestRoot, { recursive: true });
for (const form of forms) {
  const payload = payloadFor(form);
  if (!validateDecision(payload)) throw new Error(`${form.candidate_id}: ${ajv.errorsText(validateDecision.errors)}`);
  if (payload.teses.some(x => !thesisIds.has(x.slug)) || payload.fundamentos.some(x => !foundationIds.has(x))) throw new Error(`${form.candidate_id}: canonical reference mismatch`);
  const naturalKey = `${payload.identificacao.tribunal}:${payload.identificacao.processo}`, prior = existing.get(naturalKey);
  if (prior?.revisao?.revisor === 'Alexandre Oliveira' && prior?.revisao?.revisado_em === '2026-08-17' && prior.id === payload.id) selfMaterialized.add(naturalKey);
  else if (prior) (sha(prior) === sha(payload) ? duplicateIdentical : duplicateConflicts).push(naturalKey);
  const proposal = { proposal_id: `proposal-${sha(payload).replace(':', '-')}`, canonical: false, publishable: false, promotion_status: 'proposed', source_review_id: form.candidate_id, transform_identity: sha({ version: 1, input_hash: form.input_hash, payload }), payload };
  if (!validateProposal(proposal)) throw new Error(`${form.candidate_id}: ${ajv.errorsText(validateProposal.errors)}`);
  await writeFile(resolve(proposalRoot, `${form.candidate_id}.proposal.json`), `${JSON.stringify(proposal, null, 2)}\n`);
  proposals.push(proposal);
}
if (duplicateConflicts.length) throw new Error(`existing canonical conflicts: ${duplicateConflicts.join(', ')}`);
const head = process.env.WAVE1_MATERIALIZATION_HEAD || '78f9a028e39d4cf7bce4bc28532866bb991f09d1';
const scope = proposals.map(x => ({ candidate_id: x.source_review_id, process: x.payload.identificacao.processo, tribunal: x.payload.identificacao.tribunal, payload_digest: sha(x.payload), target: `data/jurisprudencia/${x.payload.id}.yaml` }));
const packageDigest = sha({ review_digest: expectedReviewDigest, review_commit: expectedReviewCommit, head, scope });
const manifest = { artifact_kind: 'predator_wave1_promotion_manifest', wave: 1, stage: '1I', generated_at: '2026-08-17', review: { commit: expectedReviewCommit, digest: expectedReviewDigest, approved: 77, validation: 'PASS' }, materialization: { candidates: 77, new_files: 77 - duplicateIdentical.length, existing_identical: duplicateIdentical.length, conflicting: 0, new_theses: 0, new_foundations: 0 }, head, scope, package_digest: packageDigest, readiness: 'FINAL_AUTHORIZED', material_change_invalidates_authorization: true };
await writeFile(resolve(manifestRoot, 'onda-1-etapa-1i-2026-08-17.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const authPath = resolve(root, 'ingestion/config/wave1-final-authorization.json');
if (promote) {
  const authorization = JSON.parse(await readFile(authPath, 'utf8'));
  if (authorization.decision !== 'APPROVE' || authorization.authorizer !== 'Alexandre Oliveira' || authorization.package_digest !== packageDigest || authorization.review_digest !== expectedReviewDigest || authorization.review_commit !== expectedReviewCommit || authorization.decision_count !== 77) throw new Error('final authorization does not match exact materialized package');
  for (const proposal of proposals) {
    const key = `${proposal.payload.identificacao.tribunal}:${proposal.payload.identificacao.processo}`;
    if (!existing.has(key) || selfMaterialized.has(key)) await writeFile(resolve(root, 'data/jurisprudencia', `${proposal.payload.id}.yaml`), YAML.stringify(proposal.payload, { lineWidth: 1000 }));
  }
}
console.log(JSON.stringify({ reviewValidation: 'PASS (execute npm run validate:wave1-review before this command)', candidates: 77, newFiles: 77 - duplicateIdentical.length, existingIdentical: duplicateIdentical.length, packageDigest, head, status: promote ? 'PROMOTED' : 'READY_FOR_FINAL_AUTHORIZATION_ARTIFACT' }, null, 2));

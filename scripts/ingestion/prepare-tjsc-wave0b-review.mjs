import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '../..');
const batchId = 'onda-0-etapa-0b-tjsc-2026-08-13';
const out = resolve(root, 'ingestion/review-queue/tjsc-wave0b');
const sha = (value) => `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;

const cases = [
  ['A','5093865-06.2022.8.24.0930','5ª Câmara de Direito Comercial','SILVIO FRANCO','2024-02-08','321756902374565941974684226921',['selfie','documento_identificacao','endereco_ip','termo_consentimento'],['validade_contratacao_digital','forca_probatoria_assinatura','fraude_inexistencia_contratacao','repeticao_indebito_descontos','dano_moral_desconto_consignado'],['rastreabilidade_contratacao_digital','assinatura_como_prova_autoria','dever_informacao_qualificado','dano_moral_exige_repercussao_concreta']],
  ['A','5002158-11.2025.8.24.0005','6ª Câmara de Direito Comercial','RUBENS SCHULZ','2025-11-13','321763042435696022161172099848',['biometria_facial','documento_identificacao','geolocalizacao','compras'],['validade_contratacao_digital','forca_probatoria_assinatura','uso_reiterado_confirma_contratacao','conversao_cartao_em_emprestimo_consignado'],['rastreabilidade_contratacao_digital','assinatura_como_prova_autoria','uso_reiterado_cartao_indicio_consentimento','conduta_posterior_como_prova']],
  ['A','5035991-29.2023.8.24.0930','2ª Câmara de Direito Comercial','GETULIO CORREA','2025-02-18','321757028417812590827870443561',['biometria_facial','documento_identificacao','protocolo_aceite'],['validade_contratacao_digital','forca_probatoria_assinatura','violacao_dever_informacao_transparencia','dano_moral_desconto_consignado'],['rastreabilidade_contratacao_digital','assinatura_como_prova_autoria','dever_informacao_qualificado','dano_moral_exige_repercussao_concreta']],
  ['A','5032158-32.2025.8.24.0930','4ª Câmara de Direito Comercial','SILVIO FRANCO','2026-03-03','321772567821172503347214203114',['contrato','termo_consentimento','uso_cartao'],['validade_contratacao_digital','uso_reiterado_confirma_contratacao','violacao_dever_informacao_transparencia','repeticao_indebito_descontos','dano_moral_desconto_consignado'],['conduta_posterior_como_prova','uso_reiterado_cartao_indicio_consentimento','dever_informacao_qualificado','dano_moral_exige_repercussao_concreta']],
  ['A','5002086-81.2023.8.24.0041','4ª Câmara de Direito Comercial','JOSÉ CARLOS CARSTENS KOHLER','2024-02-27','321756907426641708435173672849',['assinatura_eletronica','selfie','documento_identificacao'],['validade_contratacao_digital','forca_probatoria_assinatura','fraude_inexistencia_contratacao'],['rastreabilidade_contratacao_digital','assinatura_como_prova_autoria']],
  ['B','5094500-50.2023.8.24.0930','2ª Câmara de Direito Comercial','GETULIO CORREA','2025-02-04','321757021355075169767217401743',['assinatura_digital','termo_consentimento','saque'],['validade_contratacao_digital','forca_probatoria_assinatura','credito_saque_como_prova_negocio','violacao_dever_informacao_transparencia'],['assinatura_como_prova_autoria','conduta_posterior_como_prova','dever_informacao_qualificado']],
  ['B','5011111-52.2025.8.24.0008','4ª Câmara de Direito Comercial','SILVIO FRANCO','2025-12-02','321764685331951331372941703956',['contrato_digital','termo_consentimento'],['validade_contratacao_digital','forca_probatoria_assinatura','violacao_dever_informacao_transparencia','dano_moral_desconto_consignado'],['rastreabilidade_contratacao_digital','assinatura_como_prova_autoria','dever_informacao_qualificado','dano_moral_exige_repercussao_concreta']]
];

await mkdir(out, { recursive: true });
for (const [priority, process, chamber, rapporteur, date, sourceId, evidence, theses, foundations] of cases) {
  const artifact = {
    artifact_kind: 'predator_human_review_queue_item',
    publishable: false,
    batch_id: batchId,
    candidate_id: `cand-tjsc-${process.replaceAll('.', '-')}`,
    priority,
    identity: { tribunal: 'TJSC', process, chamber, rapporteur, judgment_date: date },
    source: {
      nature: 'jurisprudencia_oficial',
      recovered_via: 'jusratio',
      official_url: `https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php?acao=jurisprudencia@jurisprudencia/download_inteiro_teor&id_jurisprudencia=${sourceId}`,
      identity_verified: true,
      full_text_verified: false,
      limitation: 'Conector retornou ementa e decisão colegiada, mas não texto integral paginado; conferência humana do inteiro teor pendente.'
    },
    classification: {
      products: ['rmc', 'cartao_credito_consignado'],
      themes: ['consentimento', 'dever_informacao', 'prova_contratacao', 'contratacao_digital'],
      evidence,
      proposed_theses: theses,
      proposed_foundations: foundations,
      proposed_result: { contract: 'mantido', conversion: 'indeferida', refund: 'indeferida', moral_damage: 'indeferido' }
    },
    review: { status: 'pending_human_review', reviewer_id: null, occurred_at: null, final: false },
  };
  artifact.input_hash = sha(artifact);
  await writeFile(resolve(out, `${artifact.candidate_id}.review.json`), `${JSON.stringify(artifact, null, 2)}\n`);
}

console.log(JSON.stringify({ batch_id: batchId, review_queue: cases.length, readiness: 'BLOCKED_REVIEW' }, null, 2));

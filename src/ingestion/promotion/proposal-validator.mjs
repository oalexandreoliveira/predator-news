import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { validateData } from '../../../scripts/data/validate-data.mjs';
import { PromotionBlockedError } from './proposal-contract.mjs';
export async function validateCanonicalProposal({ proposal, proposalSchema, decisionSchema, canonicalData, root }) {
  const ajv = new Ajv2020({ allErrors: true, strict: true }); addFormats(ajv);
  for (const [kind, schema, value] of [['proposal',proposalSchema,proposal],['decision',decisionSchema,proposal.payload]]) {
    const validate = ajv.compile(schema); if (!validate(value)) { const error = validate.errors[0]; throw new PromotionBlockedError(`${kind}_schema_invalid`, error.instancePath || '/', error.message); }
  }
  const record = { file: `proposal:${proposal.payload.id}`, stem: proposal.payload.id, value: proposal.payload };
  const result = await validateData({ root, data: { ...canonicalData, decisions: [...canonicalData.decisions, record] } });
  if (!result.valid) throw new PromotionBlockedError('legal_validation_failed', '/', result.errors[0]); return { valid: true, counts: result.counts };
}

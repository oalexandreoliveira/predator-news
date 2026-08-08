import { IngestionBlockedError } from '../errors.mjs';
const known=new Set(['validate_authorization','canonical_write_local','commit_local','push','open_pr_by_executor','merge','publisher','deploy','publish']);
const fail=(code,message=code)=>{throw new IngestionBlockedError(code,message);};
export function validateFinalAuthorization(authorization,context,{now=()=>new Date(),verifyProtectedPr}={}){
  if(!authorization)fail('authorization_missing');
  if(authorization.kind==='authorization_request'||authorization.authorization_requested)fail('authorization_invalid','request is not authorization');
  if(authorization.dataset_id!=='DATASET-002')fail('authorization_digest_mismatch','dataset');
  if(authorization.revoked===true)fail('authorization_revoked');
  if(new Date(authorization.expires_at)<=now()||new Date(authorization.issued_at)>now())fail('authorization_expired');
  const pr=authorization.protected_pr;
  if(!pr)fail('authorization_pr_missing');
  if(typeof verifyProtectedPr!=='function'||!verifyProtectedPr(pr))fail('authorization_authenticity_unverifiable');
  if(pr.repository!==context.repository||pr.author_login!==context.registered_authorizer||pr.base_branch!=='main'||pr.protected!==true||!['open','merged'].includes(pr.state))fail('authorization_pr_invalid');
  if(!Array.isArray(authorization.capabilities)||authorization.capabilities.some(c=>!known.has(c)))fail('authorization_capability_missing');
  const hashes=['package_digest','manifest_hash','proposal_hash','plan_hash','rollback_hash','canonical_index_hash','taxonomy_hash','legal_schema_hash','policy_hash'];
  for(const key of hashes)if(!authorization[key]||authorization[key]!==context[key])fail('authorization_digest_mismatch',key);
  if(JSON.stringify(authorization.files)!==JSON.stringify(context.files))fail('authorization_scope_mismatch');
  const approvals=authorization.authorizers?.filter(a=>a.decision==='approve')??[];
  if(authorization.authorizers?.some(a=>a.decision==='deny'))fail('authorization_denied');
  if(approvals.length<context.required_approvals)fail('authorization_approval_missing');
  if(new Set(approvals.map(a=>a.identity)).size!==approvals.length)fail('dual_approval_missing');
  if(approvals.some(a=>a.synthetic||a.identity===context.preparer||a.identity===context.executor))fail('segregation_violation');
  if(approvals.some(a=>a.identity!==context.registered_authorizer))fail('role_not_allowed');
  if(approvals.some(a=>a.package_digest!==authorization.package_digest))fail('authorization_digest_mismatch');
  const review=authorization.technical_review;
  if(!review?.completed||!review.reviewer_id||!review.report_hash)fail('technical_review_missing');
  if(review.reservations?.length&&!review.authorizer_acknowledged)fail('technical_reservations_unacknowledged');
  if(authorization.single_use!==true||authorization.consumed===true)fail('authorization_consumed');
  const effective_capabilities=authorization.capabilities.filter(c=>context.policy_capabilities.includes(c));
  return Object.freeze({authorization_validated:true,promotion_authorized:effective_capabilities.includes('canonical_write_local'),effective_capabilities,authorization_id:authorization.authorization_id,single_use:true});
}
export function requireCapability(validated,capability){if(!validated?.effective_capabilities?.includes(capability))fail(capability==='commit_local'?'git_operation_not_authorized':['publisher','deploy','publish'].includes(capability)?'publication_not_authorized':'authorization_capability_missing');return true;}

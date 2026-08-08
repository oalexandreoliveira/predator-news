export function assertReviewer(reviewer, policy) {
  if (!reviewer?.id || !policy.authorized_roles.includes(reviewer.role)) throw new Error('reviewer role is not authorized'); return reviewer;
}
export function assertReason(reason, policy) { if (!reason || !policy.reason_codes.includes(reason)) throw new Error('standard reason is required'); return reason; }
export function assertChecklist(checklist, policy) { if (!policy.required_checklist.every(item => checklist?.[item] === true)) throw new Error('complete legal checklist is required'); return checklist; }

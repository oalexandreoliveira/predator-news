import { createHash } from 'node:crypto';
const stable=value=>JSON.stringify(value,Object.keys(value).sort());
export const digestBytes=value=>`sha256:${createHash('sha256').update(value).digest('hex')}`;
export function freezePackage(artifacts){const hashes=Object.fromEntries(Object.entries(artifacts).map(([key,value])=>[key,digestBytes(typeof value==='string'?value:stable(value))]));return Object.freeze({hashes,package_digest:digestBytes(stable(hashes))});}
export function assertPackageFrozen(frozen,artifacts){const current=freezePackage(artifacts);if(current.package_digest!==frozen.package_digest){const error=new Error('package changed');error.code='package_changed';throw error;}return true;}

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';

const root=resolve(import.meta.dirname,'../..');
const manifest=JSON.parse(await readFile(resolve(root,'ingestion/manifests/onda-0-etapa-0a-tjpi-2026-08-13.manifest.json')));
const authorization=JSON.parse(await readFile(resolve(root,'ingestion/manifests/onda-0-etapa-0a-tjpi-2026-08-13.authorization-package.json')));
const expected=manifest.freeze?.digest;
if(!expected?.startsWith('sha256:')||authorization.digest!==expected||authorization.readiness!=='READY_FOR_AUTHORIZATION')throw new Error('authorization_package_mismatch');
if(manifest.approved!==17||authorization.decision_count!==17||manifest.excluded.some(x=>authorization.processes.includes(x.processo)))throw new Error('scope_mismatch');
const names=(await readdir(resolve(root,'ingestion/proposals/tjpi-wave0'))).filter(x=>x.endsWith('.proposal.json')).sort();
if(names.length!==17)throw new Error('proposal_count_mismatch');
for(const name of names){
 const proposal=JSON.parse(await readFile(resolve(root,'ingestion/proposals/tjpi-wave0',name)));
 if(!authorization.processes.includes(proposal.payload.identificacao.processo))throw new Error('unauthorized_process');
 const target=resolve(root,'data/jurisprudencia',proposal.payload.id+'.yaml');
 await writeFile(target,YAML.stringify(proposal.payload,{lineWidth:1000}));
}
console.log(JSON.stringify({promoted:names.length,digest:expected,targets:authorization.canonical_targets},null,2));

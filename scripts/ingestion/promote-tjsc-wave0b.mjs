import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';

const root=resolve(import.meta.dirname,'../..'),stem='onda-0-etapa-0b-tjsc-2026-08-14';
const manifest=JSON.parse(await readFile(resolve(root,`ingestion/manifests/${stem}.manifest.json`)));
const authorization=JSON.parse(await readFile(resolve(root,`ingestion/manifests/${stem}.authorization-package.json`)));
const grant=JSON.parse(await readFile(resolve(root,`ingestion/manifests/${stem}.authorization-grant.json`)));
const expected=manifest.freeze?.digest;
if(!expected?.startsWith('sha256:')||authorization.digest!==expected||grant.digest!==expected)throw new Error('digest_mismatch');
if(grant.head!==authorization.head||grant.decision!=='approve'||grant.authorizer!=='oalexandreoliveira')throw new Error('authorization_invalid');
if(authorization.readiness!=='READY_FOR_AUTHORIZATION'||authorization.decision_count!==7||manifest.approved!==7)throw new Error('scope_invalid');
const names=(await readdir(resolve(root,'ingestion/proposals/tjsc-wave0b'))).filter(x=>x.endsWith('.proposal.json')).sort();
if(names.length!==7)throw new Error('proposal_count_mismatch');
for(const name of names){
 const proposal=JSON.parse(await readFile(resolve(root,'ingestion/proposals/tjsc-wave0b',name)));
 if(!authorization.processes.includes(proposal.payload.identificacao.processo))throw new Error('unauthorized_process');
 const target=resolve(root,'data/jurisprudencia',proposal.payload.id+'.yaml');
 await writeFile(target,YAML.stringify(proposal.payload,{lineWidth:1000}));
}
console.log(JSON.stringify({promoted:names.length,digest:expected,targets:authorization.canonical_targets},null,2));

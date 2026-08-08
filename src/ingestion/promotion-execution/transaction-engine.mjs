import { mkdir,open,readFile,rename,rm,stat,writeFile } from 'node:fs/promises';
import { dirname,join,resolve,sep } from 'node:path';
import { digestBytes } from './package-freezer.mjs';
const blocked=(code,message=code)=>Object.assign(new Error(message),{code});
const safePath=(root,path)=>{if(!/^data\/jurisprudencia\/[a-z0-9-]+\.yaml$/.test(path)||path.includes('..'))throw blocked('path_not_allowed');const target=resolve(root,...path.split('/'));if(!target.startsWith(resolve(root)+sep))throw blocked('path_not_allowed');return target;};
export async function executeSyntheticTransaction({root,plan,contents,authorization,revalidate,validate,now=()=>new Date().toISOString(),induce,foreignPath}){
  const tx=`tx-${digestBytes(JSON.stringify({plan:plan.plan_id,authorization:authorization.authorization_id})).slice(7,23)}`;const journal=[];const preimages=new Map();let wrote=false;
  const record=(state,detail={})=>journal.push({sequence:journal.length+1,timestamp:now(),state,...detail});
  try{
    record('journal_opened');
    for(const op of plan.operations){const target=safePath(root,op.path);let before=null;try{const bytes=await readFile(target);before={exists:true,bytes,hash:digestBytes(bytes)};}catch(e){if(e.code!=='ENOENT')throw e;before={exists:false,bytes:null,hash:null};}preimages.set(op.path,before);record('preimage_captured',{path:op.path,exists:before.exists,hash:before.hash});}
    if(induce==='preimage')throw blocked('preimage_failed');
    await revalidate(); record('authorization_revalidated');
    for(const op of plan.operations){const target=safePath(root,op.path);const before=preimages.get(op.path);if(op.operation!=='add'||before.exists||op.previous_hash!==null)throw blocked('previous_hash_mismatch');await mkdir(dirname(target),{recursive:true});const temp=`${target}.tmp-${tx}`;const handle=await open(temp,'wx',0o600);try{await handle.writeFile(contents[op.path]);await handle.sync();}finally{await handle.close();}await rename(temp,target);wrote=true;record('written',{path:op.path,expected_hash:op.new_hash,observed_hash:digestBytes(contents[op.path])});if(induce==='write')throw blocked('atomic_write_failed');}
    if(foreignPath)await writeFile(foreignPath,'foreign',{flag:'wx'});
    if(induce==='schema'||induce==='data'||induce==='test'||induce==='build'||induce==='diff')throw blocked(induce==='diff'?'unexpected_diff':'post_validation_failed',induce);
    await validate();record('validated');return{result:'promoted',transaction_id:tx,journal,preimages:[...preimages].map(([path,v])=>({path,exists:v.exists,hash:v.hash}))};
  }catch(error){if(wrote){let incomplete=false;for(const op of [...plan.operations].reverse()){const target=safePath(root,op.path);const before=preimages.get(op.path);try{if(before?.exists)await writeFile(target,before.bytes);else await rm(target,{force:true});record('rolled_back',{path:op.path});}catch{incomplete=true;}}return{result:incomplete?'incident':'rolled_back',cause:error.code??error.message,transaction_id:tx,journal};}return{result:'blocked',cause:error.code??error.message,transaction_id:tx,journal};}
}

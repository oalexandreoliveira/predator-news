import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';
import { loadData } from '../../scripts/data/load-data.mjs';
import { validateSourceIntegrity } from '../../src/ingestion/index.mjs';

const exec = promisify(execFile);
const root = resolve(new URL('../..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'));
const real = YAML.parse(await readFile(new URL('../../data/jurisprudencia/tjce-0201664-84-2022-8-06-0029.yaml', import.meta.url), 'utf8'));
const synthetic = JSON.parse(await readFile(new URL('../../ingestion/fixtures/simulated-promotion/eligible.reviewed.json', import.meta.url), 'utf8'));
const clone = value => structuredClone(value);

test('caso real do TJCE é aceito como controle positivo',()=>assert.deepEqual(validateSourceIntegrity({candidate:real}),{valid:true,reasons:[]}));
test('fonte oficial do TJSC é aceita pelo gate de integridade',()=>{const value=clone(real);value.identificacao.tribunal='TJSC';value.identificacao.processo='5000228-24.2019.8.24.0051';value.fonte.url_original='https://eproc1g.tjsc.jus.br/eproc/externo_controlador.php';value.fonte.url_inteiro_teor=value.fonte.url_original;assert.deepEqual(validateSourceIntegrity({candidate:value}),{valid:true,reasons:[]});});
test('antigo candidato sintético é rejeitado',()=>assert.ok(validateSourceIntegrity({candidate:synthetic}).reasons.includes('synthetic_candidate_forbidden')));
test('domínio reservado example.invalid é rejeitado',()=>{const value=clone(real);value.fonte.url_original='https://example.invalid/case';assert.ok(validateSourceIntegrity({candidate:value}).reasons.includes('reserved_source_domain'));});
test('domínio incompatível com o tribunal é rejeitado',()=>{const value=clone(real);value.fonte.url_original='https://www.tjma.jus.br/case';assert.ok(validateSourceIntegrity({candidate:value}).reasons.includes('source_domain_mismatch'));});
test('URL sem HTTPS é rejeitada',()=>{const value=clone(real);value.fonte.url_original='http://www.tjce.jus.br/case';assert.ok(validateSourceIntegrity({candidate:value}).reasons.includes('source_https_required'));});
test('número CNJ inválido é rejeitado',()=>{const value=clone(real);value.identificacao.processo='0201664-85.2022.8.06.0029';assert.ok(validateSourceIntegrity({candidate:value}).reasons.includes('invalid_cnj'));});
test('manifesto dry_run não pode ingressar em promoção canônica',()=>assert.ok(validateSourceIntegrity({candidate:real,manifest:{dry_run:true}}).reasons.includes('dry_run_candidate_forbidden')));
test('todos os casos reais publicados continuam íntegros',async()=>{const data=await loadData(root);for(const record of data.decisions)assert.deepEqual(validateSourceIntegrity({candidate:record.value}),{valid:true,reasons:[]},record.value.id);});
test('controlled promotion bloqueia antes da autorização e sem alvo ou operações',async()=>{const {stdout}=await exec(process.execPath,['scripts/ingestion/run-controlled-promotion.mjs'],{cwd:root});const result=JSON.parse(stdout);assert.equal(result.decision,'NO_GO');assert.equal(result.reason,'synthetic_candidate_forbidden');assert.equal(result.authority.consulted,false);assert.equal(result.package_freeze.executed,false);assert.equal(result.states.authorization_validated,false);assert.equal(result.proof.writes,0);assert.equal(result.proof.git_operations,0);assert.equal(result.proof.external_operations,0);assert.equal('canonical_target' in result.proof,false);});

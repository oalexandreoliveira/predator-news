import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

test('schemas operacionais compilam e rejeitam documento vazio', async () => {
  const directory = new URL('../../ingestion/schemas/', import.meta.url);
  const files = (await readdir(directory)).filter(file => file.endsWith('.json'));
  assert.equal(files.length, 16);
  for (const file of files) {
    const ajv = new Ajv2020({ allErrors: true }); addFormats(ajv);
    const validate = ajv.compile(JSON.parse(await readFile(new URL(file, directory), 'utf8')));
    assert.equal(validate({}), false, file);
  }
  const readinessSchema = JSON.parse(await readFile(new URL('../../ingestion/schemas/readiness-report.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(readinessSchema.properties.decision.enum, ['GO', 'NO_GO']);
});

test('build não contém artefatos de ingestão', async () => {
  const build = await readFile(new URL('../../scripts/build.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(build, /ingestion[\\/](state|cache|batches|reports)/);
  const publicFiles = await readdir(new URL('../../dist/', import.meta.url), { recursive: true });
  assert.equal(publicFiles.some(file => /(^|[\\/])ingestion([\\/]|$)/.test(file)), false);
  const workflow = await readFile(new URL('../../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');
  assert.ok(workflow.indexOf('run: npm run build') < workflow.indexOf('run: npm test'), 'o workflow deve criar dist antes da suíte');
});

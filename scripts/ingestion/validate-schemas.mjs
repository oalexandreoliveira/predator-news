import { readFile, readdir } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020({ allErrors: true }); addFormats(ajv);
const files = (await readdir(new URL('../../ingestion/schemas/', import.meta.url))).filter(name => name.endsWith('.json'));
const validators = new Map();
for (const file of files) validators.set(file.replace('.schema.json', ''), ajv.compile(JSON.parse(await readFile(new URL(`../../ingestion/schemas/${file}`, import.meta.url), 'utf8'))));
for (const validity of ['valid', 'invalid']) {
  const directory = new URL(`../../ingestion/fixtures/${validity}/`, import.meta.url);
  for (const file of (await readdir(directory)).filter(name => name.endsWith('.json'))) {
    const validate = validators.get(file.replace('.json', ''));
    if (!validate) throw new Error(`Fixture sem schema: ${file}`);
    const accepted = validate(JSON.parse(await readFile(new URL(file, directory), 'utf8')));
    if (accepted !== (validity === 'valid')) throw new Error(`Fixture ${validity} teve resultado inesperado: ${file}`);
  }
}
console.log(`Schemas de ingestão válidos: ${files.length}; fixtures positivas e negativas confirmadas.`);

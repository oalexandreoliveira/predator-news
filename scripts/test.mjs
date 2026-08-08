import { readdir } from 'node:fs/promises';

async function findTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) paths.push(...await findTests(url));
    else if (entry.name.endsWith('.test.mjs')) paths.push(url);
  }
  return paths;
}

for (const testFile of (await findTests(new URL('../tests/', import.meta.url))).sort((a, b) => a.href.localeCompare(b.href))) {
  await import(testFile.href);
}

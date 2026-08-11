import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const base = "/predator-news/";

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }));
  return nested.flat();
}

const htmlFiles = (await files(root)).filter((path) => extname(path) === ".html");
const missing = [];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith(base)) continue;
    const pathname = href.slice(base.length).split(/[?#]/, 1)[0];
    let target = join(root, pathname);
    if (pathname.endsWith("/") || !extname(target)) target = join(target, "index.html");
    if (!existsSync(target)) missing.push({ source: relative(root, file), href });
  }
}

if (missing.length) {
  throw new Error(`Links internos inexistentes:\n${missing.map(({ source, href }) => `- ${source}: ${href}`).join("\n")}`);
}

console.log(`Links internos válidos em ${htmlFiles.length} página(s) HTML.`);

import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import YAML from "yaml";

export async function readYaml(path) {
  const source = await readFile(path, "utf8");
  return YAML.parse(source, { prettyErrors: true, uniqueKeys: true });
}

async function readCollection(directory) {
  const names = (await readdir(directory)).filter((name) => /\.ya?ml$/i.test(name)).sort();
  return Promise.all(names.map(async (name) => ({
    file: join(directory, name),
    stem: basename(name).replace(/\.ya?ml$/i, ""),
    value: await readYaml(join(directory, name)),
  })));
}

export async function loadData(root) {
  const data = join(root, "data");
  return {
    taxonomy: await readYaml(join(data, "taxonomy", "taxonomy.yaml")),
    aliases: await readYaml(join(data, "taxonomy", "aliases.yaml")),
    decisions: await readCollection(join(data, "jurisprudencia")),
    theses: await readCollection(join(data, "teses")),
    foundations: await readCollection(join(data, "fundamentos")),
  };
}

import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/scripts\/$/, "");
const CONTENT = join(ROOT, "content", "edicoes");
const DIST = join(ROOT, "dist");
const BASE = process.env.BASE_PATH || "/predator-news";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&
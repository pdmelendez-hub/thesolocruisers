#!/usr/bin/env node
// Walks public/videos/ and flags any file exceeding the safe-ship threshold.
// Cloudflare Pages hard limit: 25 MiB per asset. We use a 24 MiB threshold to
// leave a 1 MiB safety margin and dodge GitHub's 50 MB warning.

import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = new URL("../public/videos", import.meta.url).pathname.replace(/^\//, "");
const LIMIT_MIB = 24;
const LIMIT_BYTES = LIMIT_MIB * 1024 * 1024;
const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".m4v", ".ogv", ".avi"];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (VIDEO_EXTS.some((e) => entry.toLowerCase().endsWith(e))) {
      out.push({ path: full, size: st.size });
    }
  }
  return out;
}

const files = walk(ROOT);
if (files.length === 0) {
  console.log("📁 No video files found under public/videos/ — nothing to check.");
  process.exit(0);
}

const oversize = files.filter((f) => f.size > LIMIT_BYTES);
const lines = files
  .sort((a, b) => b.size - a.size)
  .map((f) => {
    const mib = (f.size / 1024 / 1024).toFixed(2);
    const flag = f.size > LIMIT_BYTES ? "❌" : "✅";
    const rel = relative(process.cwd(), f.path).replace(/\\/g, "/");
    return `  ${flag}  ${mib.padStart(7)} MiB  ${rel}`;
  });

console.log(`\nVideo size check — ${files.length} files, limit ${LIMIT_MIB} MiB:\n`);
console.log(lines.join("\n"));

if (oversize.length) {
  console.error(
    `\n❌  ${oversize.length} file(s) exceed ${LIMIT_MIB} MiB. Compress with ffmpeg ` +
    `(see public/videos/README.md) before committing.`
  );
  process.exit(1);
}
console.log(`\n✅  All ${files.length} video file(s) within the ${LIMIT_MIB} MiB safe limit.`);

const fs = require("fs");
const path = require("path");

const songsDir = path.join(__dirname, "../src/lib/songs");
const indexFile = path.join(songsDir, "index.ts");
const libraryFile = path.join(songsDir, "library.ts");
const ingestScript = path.join(__dirname, "ingest-midi.ts");

function fixIdentifier(id) {
  return /^[0-9]/.test(id) ? "song" + id.charAt(0).toUpperCase() + id.slice(1) : id;
}

const numFiles = fs.readdirSync(songsDir).filter(f => /^[0-9].*\.ts$/.test(f));

for (const f of numFiles) {
  const p = path.join(songsDir, f);
  let content = fs.readFileSync(p, "utf8");
  
  // export const 08ecbtdbbih: SongEntry = {
  const match = content.match(/export const ([0-9][a-zA-Z0-9]*)/);
  if (match) {
    const oldId = match[1];
    const newId = fixIdentifier(oldId);
    content = content.replace(`export const ${oldId}`, `export const ${newId}`);
    fs.writeFileSync(p, content);
    console.log(`Fixed ${f}`);
  }
}

let idx = fs.readFileSync(indexFile, "utf8");
idx = idx.replace(/export \{ ([0-9][a-zA-Z0-9]*) \} from "\.\/([^"]+)";/g, (match, id, file) => {
  return `export { ${fixIdentifier(id)} } from "./${file}";`;
});
fs.writeFileSync(indexFile, idx);
console.log("Fixed index.ts");

let lib = fs.readFileSync(libraryFile, "utf8");
lib = lib.replace(/import \{ ([0-9][a-zA-Z0-9]*) \} from "\.\/([^"]+)";/g, (match, id, file) => {
  return `import { ${fixIdentifier(id)} } from "./${file}";`;
});
lib = lib.replace(/,\s+([0-9][a-zA-Z0-9]*)(,|$)/g, (match, id, end) => {
  return `, ${fixIdentifier(id)}${end}`;
});
lib = lib.replace(/\[\s+([0-9][a-zA-Z0-9]*),/g, (match, id) => {
  return `[${fixIdentifier(id)},`;
});
fs.writeFileSync(libraryFile, lib);
console.log("Fixed library.ts");

// Fix the camel function in the ingest scripts
for (const script of ["ingest-midi.ts", "ingest-klezmer-page.ts"]) {
  const sPath = path.join(__dirname, script);
  if (fs.existsSync(sPath)) {
    let scriptContent = fs.readFileSync(sPath, "utf8");
    scriptContent = scriptContent.replace(
      /function camel\(id: string\): string \{\n  return id\.replace\(\/-\(\[a-z0-9\]\)\/g, \(_, c: string\) => c\.toUpperCase\(\)\);\n\}/,
      `function camel(id: string): string {\n  let name = id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());\n  if (/^[0-9]/.test(name)) name = "song" + name.charAt(0).toUpperCase() + name.slice(1);\n  return name;\n}`
    );
    fs.writeFileSync(sPath, scriptContent);
    console.log(`Fixed ${script}`);
  }
}

import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const modelDir = "public/models";
const modelPath = `${modelDir}/isnet-w8.onnx`;
const expectedHash = "2552901f9226d36562d57520c5a8fc3b454a406a790b8c155d6d67fd7a9c0bd9";
const revision = "2d550542847cde6a8ba7c5128584de0fab32757b";
const partHashes = [
  "4a9400b963ab3c6b6458026afe0e5e0d0d62b5a80d9373ea9b292835df3b3081",
  "0486a7019b37b985504a70ecbe378b103feb1555bc43c0bc543c703503a98296",
  "84fa00f9b72f85fb6af7833c54560d635cc05d0dfad7bce6ce623145fe6acc27",
];

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

mkdirSync(modelDir, { recursive: true });
if (!existsSync(modelPath) || digest(readFileSync(modelPath)) !== expectedHash) {
  const parts = await Promise.all(partHashes.map(async (expected, index) => {
    const part = `isnet-w8.part0${index}`;
    const url = `https://raw.githubusercontent.com/chenjindu/browser-remove-background/${revision}/model/${part}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cannot fetch ${part}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (digest(bytes) !== expected) throw new Error(`Checksum mismatch: ${part}`);
    return bytes;
  }));
  const model = Buffer.concat(parts);
  if (digest(model) !== expectedHash) throw new Error("Background model checksum mismatch");
  writeFileSync(modelPath, model);
}

const ortDir = "public/ort";
mkdirSync(ortDir, { recursive: true });
for (const asset of ["ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"]) {
  cpSync(`node_modules/onnxruntime-web/dist/${asset}`, `${ortDir}/${asset}`);
}

import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadWasmNodejs(memory) {
  try {
    return await WebAssembly.instantiate(
      fs.readFileSync(path.join(__dirname, "nanojpeg.wasm")),
      { js: { mem: memory } }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to load wasm module");
  }
}

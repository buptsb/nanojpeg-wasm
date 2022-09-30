const fs = require("fs");
const path = require("path");
// const { fileURLToPath } = require("url")
const wasmFilePath = require("./nanojpeg.wasm");

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadWasmNodejs(memory) {
  try {
    return await WebAssembly.instantiate(
      // fs.readFileSync(path.join(__dirname, "nanojpeg.wasm")),
      fs.readFileSync(wasmFilePath),
      { js: { mem: memory } }
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to load wasm module");
  }
}

module.exports = {
  loadWasmNodejs,
}
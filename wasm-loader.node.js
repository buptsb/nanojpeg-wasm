const fs = require("fs");
const wasmFilePath = require("./nanojpeg.wasm");

async function loadWasmNodejs(memory) {
  try {
    return await WebAssembly.instantiate(
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
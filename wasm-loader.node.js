const fs = require("fs");
const path = require("path");
const wasmMod = require("./nanojpeg.wasm");
const log = require("debug")("nanojpeg")

async function loadWasmNodejs(memory) {
  try {
    const wasmFilePath = path.join(__dirname, wasmMod.default);
    log("load wasm from", wasmFilePath);
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
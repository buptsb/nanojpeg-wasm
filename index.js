import { isNode } from "browser-or-node";
import { loadWasmNodejs } from "./wasm-loader.node.js";

let wasm;
let heapu8;

async function initOnce() {
  if (!wasm) {
    const memory = new WebAssembly.Memory({
      initial: 10, // 640KB
      maximum: 1000,
    });

    if (!isNode) {
      wasm = await WebAssembly.instantiateStreaming(
        fetch("nanojpeg.wasm"),
        { js: { mem: memory } }
      );
    } else {
      wasm = await loadWasmNodejs(memory);
    }

    const exports = wasm.instance.exports;
    // TODO: fix this
    exports.memory.grow(1000); // each page size is 64 KiB
    heapu8 = new Uint8Array(exports.memory.buffer);
  }
}

/**
 * Decode jpeg image
 * @param {ArrayBuffer} image 
 */
export async function Decode(image) {
  await initOnce();

  const bufferSize = image.byteLength;
  const exports = wasm.instance.exports;
  const buffer = exports.malloc(bufferSize);
  // console.log(buffer + bufferSize, heapu8.byteLength);
  heapu8.set(new Uint8Array(image), buffer);

  exports.njInit();
  if (exports.njDecode(buffer, bufferSize)) {
    throw new Error("Nanojpeg: decode failed");
  };
  exports.free(buffer);

  const result = {
    isGrey: exports.njIsColor() ? false : true,
    width: exports.njGetWidth(),
    height: exports.njGetHeight(),
    data: heapu8.slice(exports.njGetImage(), exports.njGetImage() + exports.njGetImageSize())
  }

  exports.njDone();
  exports.free(exports.njGetImage());
  return result;
}

let wasm;

export async function loadWasm(fetchFn = fetch) {
  try {
    wasm = await WebAssembly.instantiateStreaming(fetchFn("nanojpeg.wasm"));
  } catch(err) {
    console.error(err);
    throw new Error("Failed to load wasm module");
  }
}

/**
 * Decode jpeg image
 * @param {ArrayBuffer} image 
 */
export async function Decode(image) {
  if (!wasm) {
    await loadWasm();
  }

  const exports = wasm.instance.exports;
  exports.memory.grow(1000); // each page size is 64 KiB
  const heapu8 = new Uint8Array(exports.memory.buffer);

  const bufferSize = image.byteLength;
  const buffer = exports.malloc(bufferSize);
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
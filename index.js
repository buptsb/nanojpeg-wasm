/**
 * Decode jpeg image
 * @param {ArrayBuffer} image 
 */
export async function Decode(image) {
  const wasm = await WebAssembly.instantiateStreaming(fetch("nanojpeg.wasm"));
  const exports = wasm.instance.exports;
  exports.memory.grow(2000); // each page is 64kb in size
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
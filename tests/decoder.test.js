const { Decode } = require("../index.js");
const loadJpegForTesting = require("./load-jpeg.js")
const BrowserDecoder = require("./browser-decoder.js");

// https://stackoverflow.com/a/14697130/671376
function RGB2Y(r, g, b) {
  return ((19595 * r + 38470 * g + 7471 * b) >> 16);
}

function getJpegChromaComponent(result) {
  const { isGrey, width, height, data } = result;
  const chromaComponent = new Uint8ClampedArray(width * height);
  const components = isGrey ? 1 : 3;
  const length = width * height * components;
  for (let i = 0; i < length; i++) {
    const r = data[components * i];
    const g = data[components * i + 1];
    const b = data[components * i + 2];
    chromaComponent[i] = RGB2Y(r, g, b);
  }
  return chromaComponent;
}

describe("WasmDecoder and BrowserDecoder", () => {
  it("should produce same chroma component", async () => {
    const imageAb = await fetch(loadJpegForTesting()).then(r => r.arrayBuffer());
    const wasmDecoded = getJpegChromaComponent(await Decode(imageAb));
    const browserDecoded = await BrowserDecoder.getJpegChromaComponent(imageAb);

    expect(wasmDecoded.length).toEqual(browserDecoded.length);
    // can't be exact same for different decoders
    for (let i = 0; i < wasmDecoded.length; i++) {
      const delta = Math.abs(wasmDecoded[i] - browserDecoded[i]);
      expect(delta).toBeLessThanOrEqual(3);
    }
  })
});

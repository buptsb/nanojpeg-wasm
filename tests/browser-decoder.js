// TODO: add comments
function forceNewFrameInChrome() {
  let el = document.createElement("p");
  el.innerText = "1";
  el.style.position = "absolute";
  el.style.fontSize = "1px";
  document.body.append(el);
}

async function decodeJpegInBrowser(ab) {
  // create image blob url
  const blob = new Blob([ ab ], { type: "image/jpeg" } );
  const urlCreator = window.URL || window.webkitURL;
  const imageBlobUrl = urlCreator.createObjectURL(blob);

  const img = new Image();
  img.src = imageBlobUrl;
  img.decoding = "sync"; // Does not make any difference...
  img.onload = () => {
    forceNewFrameInChrome();
  };
  await img.decode();

  const {width, height} = img;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);

  return imageData.data;
}

// https://stackoverflow.com/a/14697130/671376
function RGB2Y(r, g, b) {
  return ((19595 * r + 38470 * g + 7471 * b ) >> 16);
}

/**
 * @param {ArrayBuffer} ab
 * @param {number} width
 * @param {number} height
 * @returns {Promise<Uint8ClampedArray>}
 */
async function getJpegChromaComponent(ab) {
  const data = await decodeJpegInBrowser(ab);
  const length = data.length / 4;

  let chromaComponent = new Uint8ClampedArray(length);
  for (let i = 0; i < length; i++) {
    const r = data[4 * i];
    const g = data[4 * i + 1];
    const b = data[4 * i + 2];
    const a = data[4 * i + 3];
    chromaComponent[i] = RGB2Y(r, g, b);
  }
  return chromaComponent;
}

module.exports = {
  getJpegChromaComponent,
}
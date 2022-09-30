const fs = require("fs");
const path = require("path");
const { Decode } = require("../dist/index.js");

const jpegFile = fs.readFileSync(path.join(__dirname, "./640.jpg"));

test('Decode should run without errors', async () => {
  const imageAb = jpegFile.buffer.slice(jpegFile.byteOffset, jpegFile.byteOffset + jpegFile.byteLength);
  const ab = await Decode(imageAb);
  expect(ab.width).toBe(640);
  expect(ab.height).toBe(640);
  expect(ab.data.byteLength).toBeGreaterThan(0);
});

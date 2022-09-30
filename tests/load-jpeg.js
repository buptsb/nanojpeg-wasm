// load jpeg using webpack file-loader
const imageFileUrl = require("./640.jpg");

function loadJpegForTesting() {
  return imageFileUrl.default;
}

module.exports = loadJpegForTesting;
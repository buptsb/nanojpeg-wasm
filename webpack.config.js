const path = require("path");

const config = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname, "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: 'commonjs2',
    clean: true,
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: "file-loader",
      },
      {
        test: /\.jpg$/,
        loader: "file-loader",
      },
    ],
  },
};

module.exports = config;

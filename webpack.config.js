
const config = require("openmrs/default-webpack-config");
const webpack = require("webpack");

config.additionalConfig.resolve = {
  fallback: {
    process: require.resolve("process/browser"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util"),
    buffer: require.resolve("buffer"),
    asset: require.resolve("assert"),
  }
}
config.additionalConfig.plugins = [
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
    process: "process/browser",
  }),
]
module.exports = config;


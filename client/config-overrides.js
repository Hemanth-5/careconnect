const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    crypto: require.resolve("crypto-browserify"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ]);

  return config;
};

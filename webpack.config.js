const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    mode: 'production',
    devtool: false,
    plugins: [new BundleAnalyzerPlugin()],
  };
  
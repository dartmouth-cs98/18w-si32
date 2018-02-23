const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  resolve: {
      alias: {
          config: path.join(__dirname, "config.prod")
      }
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "200.html",
    }),
    new webpack.DefinePlugin({
      PRODUCTION: true,
    })
  ],
});

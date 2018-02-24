const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    // new HardSourceWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundle to index.html
      debug: true,
      filename: '[name].js',
      path: './dll',
      plugins: [
        // new UglifyJsPlugin()
      ],
      entry: {
        vendor: [
          'react',
          'react-redux',
          'universal-router',
          'superagent',
          'color',
          'react-dom',
          'lodash',
          'redux',
          'radium',
        ]
      }
    }),
  ],
};

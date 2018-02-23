var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: [path.join(__dirname, "dll", "index.js")],
    output: {
        path: path.join(__dirname, "dist", "dll"),
        filename: "dll.vendor.js",
        library: "vendor"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "dll", "vendor-manifest.json"),
            name: "vendor",
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
};

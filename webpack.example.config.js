var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

var DEV = process.env.WEBPACK_ENV !== "production";

var outputFolder = path.resolve('dist');
var outputFileName = "example.js";
var entry = path.resolve("src/example/example.jsx");
var plugins = [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
        template: path.resolve("src/example/example.html"),
        hash: false,
        filename: 'example.html',
        inject: false,
        minify: false
    })
];

if (!DEV) {
    plugins.push(new ExtractTextPlugin("example.css"));
}

function extractCSS(loaders) {
    /*
     If not running in webpack HMR, we need to extract compiled CSS into standalone files
     http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
     */
    if (DEV) {
        return "style!" + loaders;
    }

    return ExtractTextPlugin.extract("style-loader", loaders);
}

var config = {
    entry: [entry],
    output: {
        path: outputFolder,
        filename: outputFileName,
        publicPath: ""
    },
    bail: true,
    externals: {
        "jquery": "var $"
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                include: /src/,
                loader: extractCSS("css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap")
            }
        ]
    },
    resolve: {
        root: path.resolve('src'),
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins
};

if (!DEV) {
    config.module.loaders.push({
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
    });
}


module.exports = config;

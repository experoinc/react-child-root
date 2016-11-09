var webpack = require('webpack');
var path = require("path");

var outputFolder = path.resolve('dist');
var libraryName = 'react-child-root';
var outputFileName = libraryName + '.js';
var plugins = [new webpack.NoErrorsPlugin()];

if (process.env.WEBPACK_ENV === 'production') {
    // minify the output
    outputFileName = libraryName + '.min.js';
    plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false
            }
        }))
    ;
}

var config = {
    entry: path.resolve("src/react-child-root"),
    devtool: "source-map",
    output: {
        path: outputFolder,
        filename: outputFileName,
        libraryTarget: 'umd',
        library: libraryName,
        umdNamedDefine: true
    },
    externals: {
        "react": true,
        "react-dom": true,
        "invariant": true,
        "lodash/omitBy": true,
        "lodash/mapValues": true
    },
    bail: true,
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        root: path.resolve('src'),
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins
};

module.exports = config;

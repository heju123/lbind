var path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolvePath(subdir) {
    return path.join(__dirname, ".", subdir);
}

module.exports = function (arg1, mode) {
    var config = {
        entry: {
            'lbind': './src/js/index.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            chunkFilename: '[name].[chunkhash:5].chunk.js'
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|js)$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader'
                }
            ]
        },
        optimization : {},
        resolve : {
            extensions: ['.ts', '.js'],
            alias : {
                '@': resolvePath('src')
            }
        },
        plugins: [
            new CleanWebpackPlugin(['dist/**'],
                {
                    root:'',
                    verbose: true,
                    dry: false
                }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'test/index.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    minifyCSS: true
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            contentBase: __dirname + "/test",
            port: 8888,
            open:true,
            hot:true
        }
    };

    if (!mode || mode.mode == 'development') {
        config.output.filename = '[name].js';
    } else {
        config.devtool = "cheap-module-source-map";
        config.output.filename = '[name].min.js';
        config.optimization.minimize = true;
    }

    return config;
}
const Path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const pages = require(Path.resolve(__dirname, 'src/pages/pages.json'));

let isProduct = false;
let entries = {};
let htmlPlugins = [];

pages.forEach(page => {
    let chunkName = Path.basename(page.outputFile, '.html');
    entries[chunkName] = Path.resolve(__dirname, 'src/script', page.jsFile);
    htmlPlugins.push(new HtmlWebpackPlugin({
        chunks: [chunkName],
        filename: page.outputFile,
        favicon: Path.resolve(__dirname, 'src/img/favicon.ico'),
        template: Path.resolve(__dirname, 'src/pages', page.templateFile),
        contents: page.contents
    }));
});

module.exports = {
    mode: isProduct ? 'production' : 'development',
    entry: entries,
    output: {
        path: Path.resolve(__dirname, 'dist'),
        filename: isProduct ? '[name].bundle.min.js' : '[name].bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: Path.resolve(__dirname, 'dist'),
        port: 9200
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: isProduct ? '[name].min.css' : '[name].css',
            chunkFilename: isProduct ? '[id].min.css' : '[id].css',
        }),
        new VueLoaderPlugin(),
        ...htmlPlugins
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader'
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2|otf)/,
                use: {
                    loader: 'file-loader'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    optimization: isProduct ? {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    } : {},
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
}
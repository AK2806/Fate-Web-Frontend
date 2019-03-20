const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pages = require(Path.resolve(__dirname, 'src/pages/pages.json'));

let isProduct = false;
let entries = {};
let htmlPlugins = [];

pages.forEach(page => {
    entries[page.name] = Path.resolve(__dirname, 'src/js', page.jsFile);
    switch (page.type) {
        case "singleton":
            htmlPlugins.push(new HtmlWebpackPlugin({
                chunks: [page.name],
                filename: `${page.name}.html`,
                favicon: Path.resolve(__dirname, 'src/img/favicon.ico'),
                template: 'html-loader!' + Path.resolve(__dirname, 'src/pages', page.pageFile)
            }));
            break;
        case "assembly":
            htmlPlugins.push(new HtmlWebpackPlugin({
                chunks: [page.name],
                filename: `${page.name}.html`,
                title: page.title,
                favicon: Path.resolve(__dirname, 'src/img/favicon.ico'),
                template: Path.resolve(__dirname, 'src/pages', page.templateFile),
                contents: page.contents
            }));
            break;
    }
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
        ...htmlPlugins,
        new MiniCssExtractPlugin({
            filename: isProduct ? '[name].min.css' : '[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
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
                    loader: 'file-loader',
                    options: {
                        outputPath: 'img'
                    }
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2|otf)/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'fonts'
                    }
                }
            }
        ]
    }
}
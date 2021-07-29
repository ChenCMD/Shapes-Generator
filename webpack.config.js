/* eslint-disable */
const path = require('path');
// ビルドする際にHTMLも同時に出力するため
const HtmlWebpackPlugin = require('html-webpack-plugin');
// CSSをJSにバンドルせずに出力するため
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 3000,
        historyApiFallback: true
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // scssのローダ設定
            {
                test: [/\.scss$/],
                loader: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?modules',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                ],
            },
            {
                test: [/\.css$/],
                loader: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            // js,ts,tsxのローダ設定
            {
                test: [/\.ts$/, /\.tsx$/],
                loader: ['ts-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            publicPath: 'dist',
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin({
            publicPath: 'dist',
            filename: `app-${Date.now()}.css`
        })
    ]
}

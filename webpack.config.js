const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist')
};

let pages = glob.sync(path.join(PATHS.src, 'pages', '*.pug'));
const pugPages = pages.map(function (file) {
    let base = path.basename(file, '.pug');
    return new HtmlWebpackPlugin({
        filename: base + '.html',
        template: path.join(PATHS.src, 'pages', `${base}.pug`),
        inject: true
    });

});

const commonConf = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js',
        path: PATHS.dist
    },

    plugins: [new webpack.ProgressPlugin(), ...pugPages],

    module: {
        rules: [
            {
                test: /.(js)$/,
                include: [PATHS.src],
                loader: 'babel-loader',

                options: {
                    plugins: ['syntax-dynamic-import'],

                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: true
        }
    },
};


module.exports = (env, argv) => {

    commonConf.module.rules.push({
        test: /\.scss$/,
        use: [
            argv.mode === 'development' ? "style-loader" : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "postcss-loader", // for autoprefixier
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
    });
    if (argv.mode === 'development') {
        commonConf.module.rules.push({
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        bypassOnDebug: true, // webpack@1.x
                        disable: true, // webpack@2.x and newer
                    },
                },
            ],
        });
        return {
            ...commonConf,
            devServer: {
                open: true
            }
        }
    }

    if (argv.mode === 'production') {
        commonConf.plugins.push(new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }));
        commonConf.optimization.minimizer = [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})];
        commonConf.module.rules.push({
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },

                    }
                },
            ],
        });

        return commonConf;
    }


};

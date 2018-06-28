var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');     // 为了单独打包css
var HtmlWebpackPlugin = require('html-webpack-plugin');             // 生成html

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src', 'index')
    },
    output: {
        path: path.resolve(__dirname, 'build/dist'),    // 将文件打包到此目录下
        publicPath: '/gzh/dist/',                                // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
        filename: '[name].[chunkhash:6].js',
        chunkFilename: '[name].[chunkhash:6].chunk.js',
    },
    module: {
        rules: [
            {   // .js .jsx用babel解析
                test: /\.js?$/,
                include: path.resolve(__dirname, "src"),
                loader: 'babel-loader'
            },
            {   // .css 解析
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {   // .less 解析
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                }),
                include: path.resolve(__dirname, "src")
            },
            {   // .scss 解析
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
            {   // 文件解析
                test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                loader: 'file-loader?name=assets/[name].[ext]'
            },
            {   // 图片解析
                test: /\.(png|jpg|gif)$/,
                include: path.resolve(__dirname, "src"),
                loader: 'url-loader?limit=8192&name=assets/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',            // 公共chunk名
            filename: 'vendors.[chunkhash:6].js',     // 生成的文件名
            minChunks: function(module, count) {
               return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) < 0;
            }
        }),

        // 配置了这个插件，再配合上面loader中的配置，将所有样式文件打包为一个单独的css文件
        new ExtractTextPlugin({
            filename:'[name].[chunkhash:6].css',  // 生成的文件名
            allChunks: true,        // 从所有chunk中提取
        }),

        // Uglify 加密压缩源代码
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false, // 删除代码中所有注释
            },
            compress: {
                warnings: false, // 删除没有用的代码时是否发出警告
                drop_console: false, // 是否删除所有的console
            },
        }),

        // 作用域提升，优化打包
        new webpack.optimize.ModuleConcatenationPlugin(),

        new HtmlWebpackPlugin({                     //根据模板插入css/js等生成最终HTML
            filename: '../index.html',              //生成的html存放路径，相对于 output.path
            template: './src/index.html',           //html模板路径
            hash: true,
            inject: true,                           // 是否将js放在body的末尾
            minify: true
        }),
    ],
    // 解析器， webpack提供的各种方便的工具函数
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css', '.scss'], //后缀名自动补全
        alias: {
            'react': 'anujs',
            'react-dom': 'anujs',
            'prop-types': 'anujs/lib/ReactPropTypes',
        },
    }
};
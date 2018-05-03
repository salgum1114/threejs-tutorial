const webpack = require('webpack');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                options: {
                    presets: [
                        ['es2015', { loose: true, modules: false }],
                        'stage-0',
                        'react',
                    ],
                    plugins: [
                        'syntax-async-functions',
                        'react-hot-loader/babel',
                        'syntax-dynamic-import',
                        'dynamic-import-webpack',
                        ['import', { libraryName: 'antd', style: true }],
                        'transform-decorators-legacy',
                    ],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                use: 'json-loader',
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'less-loader'],
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    name: '[hash].[ext]',
                    limit: 10000,
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            EXTERNAL_MODULES: JSON.stringify(require('./package.json').modules),
        }),
    ],
    node: {
        net: 'empty',
        fs: 'empty',
        tls: 'empty',
    },
    // resolve: {
    //     extensions: ['.jsx', '.js', '.json'],
    //     modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    // },
};

// module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             loader: 'babel-loader',
    //             include: path.resolve(__dirname, 'src'),
    //             options: {
    //                 presets: [['es2015', { modules: false }], 'stage-0', 'react'],
    //             },
    //             exclude: /node_modules/,
    //         },
    //         // CSS를 모듈 단위로 사용할 때, (import 구문을 이용한) 사용방법
    //         // {
    //         //     test: /\.(css|less)$/,
    //         //     use: ExtractTextPlugin.extract({
    //         //         fallback: 'style-loader',
    //         //         use: [{loader: 'css-loader', query: {modules: false, sourceMap: true, minimize: true}}, {loader: 'less-loader'}]
    //         //     })
    //         // },
    //         {
    //             test: /\.(css|less)$/,
    //             use: ['style-loader', 'css-loader', 'less-loader']
    //         }
    //     ]
    // }

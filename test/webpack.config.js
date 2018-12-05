const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin.js');

module.exports = {
    mode: 'development',
    entry: './test.js',
    output: {
        path: path.join(__dirname),
        filename: 'test.bundle.js'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {test: /.js/, use: ['babel-loader']},
            // {test: /.vue/, use: ['vue-loader']}
        ]
    },
    plugins: [
        // new VueLoaderPlugin()
    ]
}
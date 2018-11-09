const path = require('path');

module.exports = {
    entry: path.join(__dirname, './index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'EventX.js'
    },
    module: {
        rules: [
            {test: /.js/, use: ['babel-loader']}
        ]
    }
}
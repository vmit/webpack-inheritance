var InheritancePlugin = require('../plugin');

module.exports = {
    entry: './main.js',
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    plugins: [
        new InheritancePlugin([
            'src1/', 'src2/'
        ])
    ]
};
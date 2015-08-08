var path = require('path'),
    fs = require('fs'),
    _ = require('lodash');


function InheritancePlugin(chain) {
    this.chain = chain.map(function(src) {
        return path.resolve(src);
    }).reverse();
}


InheritancePlugin.prototype.apply = function(compiler) {
    var chain = this.chain;

    compiler.plugin('normal-module-factory', function(nmf) {
        nmf.plugin('before-resolve', function(result, callback) {
            var currentPath = _.find(chain, function (p) {
                return result.context.indexOf(p) != -1;
            }) || result.context;

            if (!/!$/.test(result.request)) {
                _.find(chain, function(p) {
                    var newContext = result.context.replace(currentPath, p),
                        filePath = path.join(newContext, result.request);

                    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile() ||
                        fs.existsSync(filePath + '.js') ||
                        fs.existsSync(path.join(filePath, 'index.js'))) {

                        result.context = newContext;
                        return true;
                    }

                    return false;
                });
            } else {
                result.context = result.context.replace(currentPath, chain[chain.indexOf(currentPath) + 1]);
                result.request = result.request.replace(/!$/, '');
            }

            return callback(null, result);
        });

    });
};

module.exports = InheritancePlugin;

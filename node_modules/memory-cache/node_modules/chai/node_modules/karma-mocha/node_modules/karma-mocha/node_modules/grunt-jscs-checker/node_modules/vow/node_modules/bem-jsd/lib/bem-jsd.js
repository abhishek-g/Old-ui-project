var JSD = require('jsd'),
    plugins = [
        'module',
        'class',
        'event',
        'type',
        'exports',
        'constructor',
        'access-level',
        'method-restrictions',
        'augments',
        'author',
        'version',
        'const',
        'readonly',
        'deprecated',
        'param',
        'bem',
        'returns',
        'example',
        'license',
        'copyright',
        'see'
    ].map(function(plugin) {
        return require('jsd-plugins-bem/plugins/' + plugin);
    });

plugins.push(require('jsd/plugins/description'));

var jsd = JSD(plugins);

module.exports = function(str) {
    return jsd(str);
};

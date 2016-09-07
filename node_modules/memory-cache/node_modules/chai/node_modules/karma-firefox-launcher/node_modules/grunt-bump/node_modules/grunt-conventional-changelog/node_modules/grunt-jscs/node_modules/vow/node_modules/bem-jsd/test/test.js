require('chai').should();

var bemJsd = require('../lib/bem-jsd'),
    FS = require('fs');

describe('bem-jsd', function() {
    it(
        'checkbox',
        function() {
            var res = JSON.stringify(bemJsd(FS.readFileSync('test/checkbox/checkbox.js', 'utf-8')), null, 4);
            JSON.parse(res).should.be.eql(JSON.parse(FS.readFileSync('test/checkbox/checkbox.json')));
        });
});
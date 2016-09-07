/*!
 * verb-tag-jscomments
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

var file = require('fs-utils');
var verb = require('verb');
var expect = require('chai').expect;
var jscomments = require('../');

describe('verb tag jscomments:', function () {
  it('should use the jscomments.js tag in the jscomments.md markdown file.', function (done) {
    var fixture = require('./jscomments.js')(verb);
    var actual = file.exists('test/actual/jscomments.md');
    expect(actual).to.eql(true);
    done();
  });
});
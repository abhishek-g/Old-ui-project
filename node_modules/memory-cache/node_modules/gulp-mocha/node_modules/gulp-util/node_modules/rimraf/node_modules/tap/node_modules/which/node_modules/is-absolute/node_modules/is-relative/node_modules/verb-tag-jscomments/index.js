/**
 * Tag plugin for Verb
 */

'use strict';

var file = require('fs-utils');
var comments = require('js-comments');
var _ = require('lodash');


/**
 * Extract code comments and format for API
 * documentation.
 */

module.exports = function (verb) {
  verb.options = verb.options || {};
  var utils = verb.utils;
  var tags = {};

  tags.jscomments = function (patterns, options) {
    // Clone the options
    options = _.extend({}, options);

    // Extend the context with options defined in the tag
    _.extend(verb.context, options);
    _.extend(verb.options, options);

    var matches = [];
    var msg;

    matches = file.find(patterns, {
      filter: 'isFile'
    });

    // If a filename was given, but no results are returned, notify the user.
    if (!matches.length) {
      msg = ' [nomatch] · verb could not find a match for {%%= jscomments("' + patterns + '") %}';
      verb.log.warn('  ' + verb.runner.name + msg);
      return;
    }

    var output = _.map(matches, function(filepath) {
      return comments(filepath, 'README.md', verb.options);
    }).join('\n\n');
    return utils.adjust.headings(output);
  };

  return tags;
};

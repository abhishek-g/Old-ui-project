module.exports = function(verb) {
  var dest = './test/actual/jscomments.md';
  verb.copy('test/jscomments.md', dest, {dest: dest});
};
var cov = require('mocha-text-cov'),
  path = require('path'),
  out = require(
    path.resolve(
      path.dirname(require.resolve('mocha')),
      './lib/reporters',
      './' + process.env.npm_package_config_blanket_output_reporter
    )
  );

function MoCoverage(runner, opts) {
  this._out = new out(runner, opts);
  this._cov = new cov(runner, opts);
}

module.exports = MoCoverage;

module.exports = process.env.FSAGENT_COV
  ? require('./lib-cov/fsagent')
  : require('./lib/fsagent');

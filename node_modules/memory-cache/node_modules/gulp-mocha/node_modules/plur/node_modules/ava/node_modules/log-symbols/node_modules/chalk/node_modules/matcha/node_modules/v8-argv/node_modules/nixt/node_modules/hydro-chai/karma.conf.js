module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['hydro'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],
    captureTimeout: 60000,
    singleRun: true,
    client: {
      hydro: {
        suite: 'hydro-chai',
        plugins: ['hydro-chai'],
        chai: {
          styles: ['expect', 'assert', 'should'],
          plugins: ['chai-spies'],
          global: true,
          diff: true,
          stack: true
        },
        proxies: {
          test: 'addTest'
        },
      }
    },
    files: [
      'build/build.js',
      'hydro.karma.js',
      'test/*.js'
    ]
  });
};

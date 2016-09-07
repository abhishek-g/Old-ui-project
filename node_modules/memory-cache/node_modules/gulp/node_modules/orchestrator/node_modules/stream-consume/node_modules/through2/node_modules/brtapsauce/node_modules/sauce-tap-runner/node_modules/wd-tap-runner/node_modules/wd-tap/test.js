var async = require('async'),
    path = require('path'),
    st = require('st'),
    wd = require('wd'),
    sauceConnect = require('sauce-connect-launcher'),
    http = require('http'),
    wdTap = require('./');

var user = process.env.SAUCE_USER,
    key = process.env.SAUCE_KEY;
if (!user || !key) {
    console.log('Set SAUCE_USER and SAUCE_KEY to your SauceLabs credentials');
    process.exit(1);
}

var browsers = [
    { name: 'Chrome', browserName: 'chrome' },
    { name: 'IE 9', browserName: 'internet explorer', platform: 'Windows 7', version: '9' }
];

var server = null,
    serverPort = 8000,
    tunnelId = 'test-wd-tap-' + Date.now(),
    tunnel;

startServer();

function startServer() {
    var dir = path.join(__dirname, 'assets');
    server = http.createServer(st({ path: dir, cache: false }));
    server.listen(serverPort, listening);
    
    function listening(err) {
        if (err) {
            return error(err);
        }

        serverPort = server.address().port;
        startTunnel();
    }
}

function startTunnel() {
    console.log('Opening tunnel to SauceLabs');
    var options = {
        tunnelIdentifier: tunnelId,
        username: user,
        accessKey: key
    };

    sauceConnect(options, function(err, t) {
        if (err) {
            return error(err);
        }

        tunnel = t;
        console.log('Tunnel opened');
        test();
    });
}

function stopTunnel(callback) {
    console.log('Closing tunnel');
    tunnel.close(function() {
        console.log('Tunnel closed');
        callback();
    });
}

function test() {
    async.eachSeries(browsers, runTest, complete);

    function runTest(browser, callback) {
        var driver;
        start();

        function start() {
            console.log('Starting', browser.name);
            browser['tunnel-identifier'] = tunnelId;

            driver = wd.remote('ondemand.saucelabs.com', 80, user, key);
            driver.init(browser, run);
        }

        function run(err) {
            if (err) {
                return callback(err);
            }

            console.log('Testing', browser.name);
            wdTap(
                'http://localhost:' + serverPort + '/test.html',
                driver,
                done);
        }

        function done(err, results) {
            console.log(browser.name, results.ok ? 'Passed' : 'Failed');
            driver.quit(function() {
                if (!err && !results.ok) {
                    err = new Error('Tests failed');
                }

                callback(err);
            });
        }
    }

    function complete(err) {
        if (err) {
            return error(err);
        }

        success();
    }
}

function success() {
    console.log('All tests passed');
    cleanup();
}

function error(err) {
    console.error('Error occurred');
    console.error(err);

    cleanup(function() {
        process.exit(1);
    });
}

function cleanup(callback) {
    async.series([
        cleanupServer,
        cleanupTunnel
    ], callback);
}

function cleanupServer(callback) {
    if (!server) {
        return callback();
    }

    server.close(callback);
}

function cleanupTunnel(callback) {
    if (!tunnel) {
        return callback();
    }

    tunnel.close(callback);
}

"use strict";

var buster = require("buster"),
    formatio = require("formatio"),

    th = require("./test-helper"),
    AgentStub = th.AgentStub,
    BusterCi = th.BusterCi,
    busterServer = th.busterServer,
    faye = th.faye,
    stubAgentFayeClient = th.stubAgentFayeClient,
    stubServerFayeClient = th.stubServerFayeClient,
    setFayeClientNotAccessible = th.setFayeClientNotAccessible,
    asyncTest = th.asyncTest,

    assert = buster.assert,
    refute = buster.refute,
    match = buster.sinon.match;


buster.testCase("buster-ci", {

    setUp: function () {

        this.config = {

            server: {
                host: "ci-host",
                port: 1111
            },

            browsers: {
                "Chrome": {},
                "IE": {}
            },

            agents: {
                localhost: {
                    port: 8888,
                    browsers: ["Chrome", "IE"]
                },
                remotehost1: {
                    port: 8888,
                    browsers: ["FF"]
                },
                remotehost2: {
                    port: 9999,
                    browsers: ["Opera"]
                }
            },

            logLevel: "none"
        };

        this.browsersAgentLocalhost = {
            browsers: this.config.browsers
        }
        this.browsersAgentRemotehost1 = {
            browsers: {
                "FF": {},
            }
        };
        this.browsersAgentRemotehost2 = {
            browsers: {
                "Opera": {}
            }
        };

        th.setUp();
        this.fayeClientLocalhost = stubAgentFayeClient(
            "http://localhost:8888", this.browsersAgentLocalhost);
        this.fayeClientRemotehost1 = stubAgentFayeClient(
            "http://remotehost1:8888", this.browsersAgentRemotehost1);
        this.fayeClientRemotehost2 = stubAgentFayeClient(
            "http://remotehost2:9999", this.browsersAgentRemotehost2);
        this.fayeClientServer = stubServerFayeClient(
            "http://localhost:2222/messaging",  [1, 2, 3, 4]);
        this.fayeClientDefault = stubServerFayeClient(
            "http://localhost:1111/messaging", [1, 2, 3, 4]);
    },

    tearDown: function () {
        th.tearDown();
    },

    "throws if no agents are specified and no phantom is configured":
        function () {
            assert.exception(function () {
                var busterCi = new BusterCi({});
            }, { message: "specify" });
        },

    "doesn't throw if no agents are specified but phantom is configured":
        function () {
            refute.exception(function () {
                var busterCi = new BusterCi({
                    server: {
                        runPhantom: true
                    }
                });
            });
        },

    "creates server": function () {

        var busterCi = new BusterCi(this.config);

        assert.calledOnce(busterServer.create);
        assert.calledWith(
            busterServer.create,
            match.any,
            match.any,
            match({
                binary: match.string
            })
        );
    },

    "starts local agent if agent 'localhost' is specified": function (done) {

        new BusterCi(this.config).run([], done(function () {

            assert.calledOnce(AgentStub);
            assert.calledWith(AgentStub, {
                port: this.config.agents.localhost.port,
                browsers: this.config.browsers,
                logLevel: "none"
            });
            assert.calledOnce(th.agent.listen);
        }.bind(this)));
    },

    "doesn't start agent if no agent 'localhost' is speficied":
        function (done) {

            delete this.config.agents.localhost;
            this.fayeClientDefault = stubServerFayeClient(
                "http://localhost:1111/messaging",  [1, 2]);

            new BusterCi(this.config).run([], done(function () {

                refute.called(AgentStub);
            }));
        },

    "creates faye clients for all agents": function (done) {

        new BusterCi(this.config).run([], done(function () {

            assert.calledWith(faye.Client, "http://localhost:8888");
            assert.calledWith(faye.Client, "http://remotehost1:8888");
            assert.calledWith(faye.Client, "http://remotehost2:9999");
        }));
    },

    "errors if not all agents are accessible":
        function (done) {

            this.fayeClientRemotehost1.accessible = false;
            var testCliExit = th.testCli.exit;

            var busterCi = new BusterCi(this.config);
            this.stub(busterCi._logger, "error");
            busterCi.run([], done(function () {

                assert.calledWith(busterCi._logger.error,
                    "Agent http://remotehost1:8888 not accessible!");
                assert.calledWith(testCliExit, 1);
            }));
        },

    "warns if not all agents are accessible and errorOnDownAgent=false":
        function (done) {

            this.fayeClientRemotehost1.accessible = false;
            var testCliExit = th.testCli.exit;
            this.config.errorOnDownAgent = false;

            var busterCi = new BusterCi(this.config);
            this.stub(busterCi._logger, "warn");
            busterCi.run([], done(function () {

                assert.calledWith(busterCi._logger.warn,
                "Agent http://remotehost1:8888 not accessible!");
                assert.calledWith(testCliExit, 1);
            }));
        },

    "doesn't try to welcome not accessible agents if errorOnDownAgent=false":
        function (done) {

            this.fayeClientRemotehost1.accessible = false;
            var testCliExit = th.testCli.exit;
            this.config.errorOnDownAgent = false;

            var busterCi = new BusterCi(this.config);
            this.stub(busterCi._logger, "warn");
            busterCi.run([], done(function () {

                refute.calledWith(
                    this.fayeClientRemotehost1.publish,
                    "/messages",
                    { command: "Welcome" }
                );
            }).bind(this));
        },

    "stops localAgent before calling exit": function (done) {

        this.fayeClientRemotehost1.accessible = false;
        var testCliExit = th.testCli.exit;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run([], done(function () {
            assert.calledOnce(th.agent.close);
            assert(th.agent.close.calledBefore(testCliExit));
        }));
    },

    "doesn't try do stop localAgent if not created": function (done) {

        delete this.config.agents.localhost;
        this.fayeClientDefault = stubServerFayeClient(
            "http://localhost:1111/messaging",  [1, 2]);
        this.fayeClientRemotehost1.accessible = false;

        new BusterCi(this.config).run([], done(function () {

            refute.called(th.agent.close);
        }));
    },

    "creates faye clients not before local agent is listening":
        function (done) {

            th.agent.listen.restore();
            this.stub(th.agent, "listen");

            new BusterCi(this.config).run([], done);

            var listenCallback = th.agent.listen.getCall(0).args[0];
            refute.called(faye.Client);
            listenCallback();
            assert.called(faye.Client);
        },

    "creates faye clients immediately if no local agent has to be started":
        function (done) {

            delete this.config.agents.localhost;
            this.fayeClientDefault = stubServerFayeClient(
                "http://localhost:1111/messaging",  [1, 2]);

            new BusterCi(this.config).run([], done(function () {

                assert.calledWith(faye.Client,
                    "http://localhost:1111/messaging");
            }));
        },

    "subscribes for messages from the agents": function (done) {

        new BusterCi(this.config).run([], done(function () {

            assert.calledOnce(this.fayeClientLocalhost.subscribe);
            assert.calledWith(
                this.fayeClientLocalhost.subscribe,
                "/messages",
                match.func
            );
            assert.calledOnce(this.fayeClientRemotehost1.subscribe);
            assert.calledWith(
                this.fayeClientRemotehost1.subscribe,
                "/messages",
                match.func
            );
            assert.calledOnce(this.fayeClientRemotehost2.subscribe);
            assert.calledWith(
                this.fayeClientRemotehost2.subscribe,
                "/messages",
                match.func
            );
        }.bind(this)));
    },

    "runs server": function (done) {

        new BusterCi(this.config).run([], done(function () {

            assert.calledOnce(th.server.createServer);
        }));
    },

    "runs server with specified port": function (done) {

        this.config.server.port = 2222;

        new BusterCi(this.config).run([], done(function () {
            assert.calledOnceWith(th.server.createServer, 2222);
        }));
    },

    "captures headless browser if configured": function (done) {

        this.config.server.runPhantom = true;
        this.fayeClientDefault.slaveReadyMessages.unshift({ slaveId: 0 });

        new BusterCi(this.config).run([], done(function () {
            assert.calledOnceWith(th.server.captureHeadlessBrowser,
                "http://localhost:1111", "0");
        }));
    },

    "welcomes all agents": function (done) {

        new BusterCi(this.config).run([], done(function () {

            assert.calledWith(
                this.fayeClientLocalhost.publish,
                "/messages",
                { command: "Welcome" }
            );
            assert.calledWith(
                this.fayeClientRemotehost1.publish,
                "/messages",
                { command: "Welcome" }
            );
            assert.calledWith(
                this.fayeClientRemotehost2.publish,
                "/messages",
                { command: "Welcome" }
            );
        }.bind(this)));
    },

    "lists configured browsers of all agents": function (done) {

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "info");
        busterCi.run([], done(function () {

            assert.calledWith(busterCi._logger.info,
                "localhost: " +
                formatio.ascii(this.browsersAgentLocalhost));
            assert.calledWith(busterCi._logger.info,
                "remotehost1: " +
                formatio.ascii(this.browsersAgentRemotehost1));
            assert.calledWith(busterCi._logger.info,
                "remotehost2: " +
                formatio.ascii(this.browsersAgentRemotehost2));
        }.bind(this)));
    },

    "errors if browsers are not configured for agent": function (done) {

        this.config.agents.remotehost2.browsers.push("FF");
        var testCliExit = th.testCli.exit;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run([], done(function () {

            assert.calledWith(busterCi._logger.error,
                "Browser FF not configured for agent remotehost2!");
            assert.calledOnce(testCliExit);
            assert.calledWith(testCliExit, 1);
        }));
    },

    "errors if not all agents welcome back": function () {
        this.clock = this.useFakeTimers();
        th.fixSinon();
        delete this.browsersAgentRemotehost1.browsers;
        var testCliExit = th.testCli.exit;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run();

        this.clock.tick(9999);
        refute.called(testCliExit);
        this.clock.tick(1);
        assert.calledOnce(testCliExit);
        assert.calledWith(testCliExit, 1);
        assert.calledWith(busterCi._logger.error,
            "Agent remotehost1 is not answering!");
    },

    "sends start command to agents after welcome and server start":
        function (done) {

            new BusterCi(this.config).run([], done(function () {

                assert.calledWith(
                    this.fayeClientLocalhost.publish,
                    "/messages",
                    {
                        command: "start",
                        browsers: {
                            Chrome: { id: 1 },
                            IE: { id: 2 }
                        },
                        url: "http://ci-host:1111/capture"
                    }
                );
                assert.calledWith(
                    this.fayeClientRemotehost1.publish,
                    "/messages",
                    {
                        command: "start",
                        browsers: {
                            FF: { id: 3 }
                        },
                        url: "http://ci-host:1111/capture"
                    }
                );
                assert.calledWith(
                    this.fayeClientRemotehost2.publish,
                    "/messages",
                    {
                        command: "start",
                        browsers: {
                            Opera: { id: 4 }
                        },
                        url: "http://ci-host:1111/capture"
                    }
                );
            }.bind(this)));
        },

    "sends start command to agents with default url":
        function (done) {

            delete this.config.server.host;
            delete this.config.server.port;

            new BusterCi(this.config).run([], done(function () {

                assert.calledWith(
                    this.fayeClientLocalhost.publish,
                    "/messages",
                    {
                        command: "start",
                        browsers: {
                            Chrome: { id: 1 },
                            IE: { id: 2 }
                        },
                        url: "http://localhost:1111/capture"
                    }
                );
                assert.calledWith(
                    this.fayeClientRemotehost1.publish,
                    "/messages",
                    {
                        command: "start",
                        browsers: {
                            FF: { id: 3 }
                        },
                        url: "http://localhost:1111/capture"
                    }
                );
                assert.calledWith(
                    this.fayeClientRemotehost2.publish,
                    "/messages",
                    {
                        command: "start",
                        browsers: {
                            Opera: { id: 4 }
                        },
                        url: "http://localhost:1111/capture"
                    }
                );
            }.bind(this)));
        },

    "runs tests when all slaves are ready": function (done) {

        delete this.fayeClientServer.slaveReadyMessages;

        this.fayeClientDefault.slaveReadyMessageHandlerRegistrationListener =
            function (channel, cb) {
                refute.called(th.testCli.run);
                cb(this.fayeClientServer.slaveIds[0]);
                refute.called(th.testCli.run);
                cb(this.fayeClientServer.slaveIds[1]);
                refute.called(th.testCli.run);
                cb(this.fayeClientServer.slaveIds[2]);
                refute.called(th.testCli.run);
                cb(this.fayeClientServer.slaveIds[3]);
                assert.called(th.testCli.run);
            }.bind(this);

        new BusterCi(this.config).run([], done);
    },

    "errors if not all slaves get ready after 30s": function () {
        this.clock = this.useFakeTimers();
        th.fixSinon();
        this.fayeClientDefault.slaveReadyMessages.splice(2, 2);
        var testCliExit = th.testCli.exit;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run();

        this.clock.tick(29999);
        refute.called(testCliExit);
        this.clock.tick(1);
        assert.calledOnce(testCliExit);
        assert.calledWith(testCliExit, 1);
        assert.calledWith(busterCi._logger.error,
            "Not all browsers got ready!: 3,4");
    },

    "errors if not all slaves get ready after configured timeout": function () {
        this.clock = this.useFakeTimers();
        th.fixSinon();
        this.fayeClientDefault.slaveReadyMessages.splice(2, 2);
        var testCliExit = th.testCli.exit;
        this.config.captureTimeout = 40;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run();

        this.clock.tick(this.config.captureTimeout * 1000 - 1);
        refute.called(testCliExit);
        this.clock.tick(1);
        assert.calledOnce(testCliExit);
        assert.calledWith(testCliExit, 1);
        assert.calledWith(busterCi._logger.error,
            "Not all browsers got ready!: 3,4");
    },

    "uses port of server configuration for test run": function (done) {

        this.config.server.port = 2222;
        var serverCfg = ["--server", "http://localhost:2222"];

        new BusterCi(this.config).run([], done(function () {
            assert.calledWith(th.testCli.run, match(function (arr) {
                return arr.join().indexOf(serverCfg.join()) !== -1;
            }, serverCfg));
        }));
    },

    "configures xml reporter for test run": function (done) {

        var reporterCfg = ["--reporter", "xml"];

        new BusterCi(this.config).run([], done(function () {
            assert.calledWith(th.testCli.run, match(function (arr) {
                return arr.join().indexOf(reporterCfg.join()) !== -1;
            }, reporterCfg));
        }));
    },

    "passes args to test runner": function (done) {

        var args = ["--config", "buster-config.js"];

        new BusterCi(this.config).run(args, done(function () {
            assert.calledWith(th.testCli.run, match(function (arr) {
                return arr.join().indexOf(args.join()) !== -1;
            }, args));
        }));
    },

    "sends stop command to agents after test run": function (done) {

        new BusterCi(this.config).run([], done(function (channel, cb) {
            assert.calledWith(
                this.fayeClientLocalhost.publish, "/messages", {
                command: "stop",
                browsers: {
                    Chrome: { id: 1 },
                    IE: { id: 2 }
                }
            });
            assert.calledWith(
                this.fayeClientRemotehost1.publish, "/messages", {
                command: "stop",
                browsers: {
                    FF: { id: 3 }
                }
            });
            assert.calledWith(
                this.fayeClientRemotehost2.publish, "/messages", {
                command: "stop",
                browsers: {
                    Opera: { id: 4 }
                }
            });
        }.bind(this)));
    },

    "exits after browsers are closed": function (done) {

        delete this.fayeClientServer.slaveDeathMessages;
        var testCliExit = th.testCli.exit;

        this.fayeClientDefault.slaveDeathMessageHandlerRegistrationListener =
            done(function (channel, cb) {
                refute.called(testCliExit);
                cb(this.fayeClientServer.slaveIds[0]);
                refute.called(testCliExit);
                cb(this.fayeClientServer.slaveIds[1]);
                refute.called(testCliExit);
                cb(this.fayeClientServer.slaveIds[2]);
                refute.called(testCliExit);
                cb(this.fayeClientServer.slaveIds[3]);
                assert.called(testCliExit);
            }.bind(this));

        new BusterCi(this.config).run();
    },

    "errors if not all browsers are closed after 30s": function () {
        this.clock = this.useFakeTimers();
        th.fixSinon();
        this.fayeClientDefault.slaveDeathMessages.splice(2, 2);
        var testCliExit = th.testCli.exit;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run();

        this.clock.tick(29999);
        refute.called(testCliExit);
        this.clock.tick(1);
        assert.calledOnce(testCliExit);
        assert.calledWith(testCliExit, 1);
        assert.calledWith(busterCi._logger.error,
            "Not all browsers could be closed!: 3,4");
    },

    "errors if not all browsers are closed after configured timeout":
        function () {
            this.clock = this.useFakeTimers();
            th.fixSinon();
            this.fayeClientDefault.slaveDeathMessages.splice(2, 2);
            var testCliExit = th.testCli.exit;
            this.config.closeTimeout = 40;

            var busterCi = new BusterCi(this.config);
            this.stub(busterCi._logger, "error");
            busterCi.run();

            this.clock.tick(this.config.closeTimeout * 1000 - 1);
            refute.called(testCliExit);
            this.clock.tick(1);
            assert.calledOnce(testCliExit);
            assert.calledWith(testCliExit, 1);
            assert.calledWith(busterCi._logger.error,
                "Not all browsers could be closed!: 3,4");
        },

    "exits immediately if no browsers have to be closed": function (done) {

        delete this.config.agents;
        this.config.server.runPhantom = true;
        this.fayeClientDefault.slaveReadyMessages = [ { slaveId: 0 } ];
        delete this.fayeClientServer.slaveDeathMessages;
        var testCliExit = th.testCli.exit;

        new BusterCi(this.config).run([], done(function () {
            assert.calledOnce(testCliExit);
        }));
    },

    "can handle gracefully disconnect": function (done) {
        this.fayeClientServer.slaveDeathMessages.splice(3, 1);
        this.fayeClientServer.slaveDisconnectMessages = [ { slaveId: 4 } ];
        var testCliExit = th.testCli.exit;

        var busterCi = new BusterCi(this.config);
        this.stub(busterCi._logger, "error");
        busterCi.run([], done(function () {
            assert.calledWith(testCliExit, 1);
            refute.called(busterCi._logger.error);
        }));
    },

    "writes reporter output to file if configured": function (done) {

        this.config["outputFile"] = "path/to/xml/output/file";
        var fileOutputStream = {};
        th.fs.createWriteStream.returns(fileOutputStream);

        new BusterCi(this.config).run([], done(function () {
            assert.called(th.fs.createWriteStream);
            assert.calledWith(th.fs.createWriteStream,
                this.config["outputFile"]);
            assert.calledWith(th.testCli.create, fileOutputStream);
        }.bind(this)));
    },

    "writes reporter output to stdout if no output file is configured":
        function (done) {

            new BusterCi(this.config).run([], done(function () {
                refute.called(th.fs.createWriteStream);
                assert.calledWith(th.testCli.create, process.stdout);
            }.bind(this)));
        }
});

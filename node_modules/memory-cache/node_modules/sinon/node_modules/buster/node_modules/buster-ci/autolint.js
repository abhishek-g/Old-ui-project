module.exports = {
    linter: "jshint",
    paths: [
        "lib/**/*.js",
        "test/**/*.js"
    ],
    linterOptions: {
        maxlen: 80,
        node: true,
        plusplus: false,
        onevar: false,
        nomen: false,
        loopfunc: false,
        validthis: false
    }
};

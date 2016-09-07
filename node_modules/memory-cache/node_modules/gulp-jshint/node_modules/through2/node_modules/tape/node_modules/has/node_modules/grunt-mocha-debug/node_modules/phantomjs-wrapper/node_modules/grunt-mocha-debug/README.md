# grunt-mocha-debug

> Runs mocha tests in another process, automatically appending --debug-brk if 'debugger' statements are found

## Getting Started
```shell
npm install grunt-mocha-debug --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mocha-debug');
```

### Overview

This task is similar to other mocha grunt tasks, except it will start another
process. Itt will check each file for ocurrences of the 'debugger' statements
(nothing fancy just regex test so the debugger statement can only have trailing
spaces) and if any are found it will start the mocha process using the
'--debug-brk' argument.


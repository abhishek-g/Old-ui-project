Node.js - testutil
=================

[![build status](https://secure.travis-ci.org/jprichardson/node-testutil.png)](http://travis-ci.org/jprichardson/node-testutil)

This module provides methods to aid in testing your Node.js apps.



Installation
------------

    npm install --save-dev testutil

Make sure that you run the test script to verify that it works on your system.


Libraries included:
-------------------

### [colors](https://github.com/marak/colors.js/)

It's already global. You don't need to do anything. It's nice to help debug some output as it modifies the string prototype.

### [shelljs](https://github.com/arturadib/shelljs)

```js
var shell = require('testutil').shelljs
```



Usage
-----

```javascript
var testutil = require('testutil')
```


### Module Methods



##### createTestDir(app)

Synchronously creates a test directory and returns the path. Deletes the directory if it exists and recreates it.

```javascript
var dirPath = testutil.createTestDir('myapp');
```

e.g. `/tmp/test-myapp`



##### fetchTestFiles(dirPath, callback)

Asynchronously fetches all of the files in a specified directory that end in `.test.coffee` or `.test.js`.

```javscript
testutil.fetchTestFiles('test/', function(files) {
// do something with test files
});
```

You might use this in conjunction with [Mocha](mocha).


#### md5(data)

Synchronously calculates the md5 of the data.








License
-------

(The MIT License) See [LICENSE](https://github.com/jprichardson/node-testutil/blob/master/LICENSE) for details.

Copyright (c) 2011-2013 JP Richardson

[mocha]: http://visionmedia.github.com/mocha/



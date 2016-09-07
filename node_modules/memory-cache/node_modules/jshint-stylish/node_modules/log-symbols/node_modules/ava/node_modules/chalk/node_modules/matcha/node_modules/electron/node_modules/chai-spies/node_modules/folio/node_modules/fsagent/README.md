# FSAgent

> Keep calm and carry on.

The FSAgent is collection of tools that work cross-platform that assist
with node.js `fs` operations. 

### Compatibility

This module has been tested and confirmed working on:

- OSX Lion
- Ubuntu Precise

## Installation

This package as available on [npm](http://npmjs.org).

    npm install fsagent

## API

#### mkdir

Recursive directory construction similiar to `mkdir -p` on unix. 

```js
var dir = path.join(__dirname, 'hello', 'universe');
fsagent.mkdir(dir, 0755, function (err) {
  // ...
});
```

#### rmdir

Recursive directory destruction similiar to `rm -rf` on unix.

```js
var dir = path.join(__dirname, 'hello');
fsagent.rmdir(dir, function (err) {
  // ...
});
```

#### watch

Recursive directory observeration using node's `fs.watch`.

```js
var watch = fsagent.watch(path.join(__dirname, 'hello'));
```

`fsagent.watch` returns an event emitter which will emit the following events:

* `watch` on every new file/directory watched or created
  * **@param** _{String}_ file/directory full path
* `create` on every file/directory created
  * **@param** _{String}_ file/directory full path
  * **@parma** _{fs.Stat}_ node stat object for file/dir
* `change` on every file change
  * **@param** _{String}_ file/directory full path
  * **@parma** _{fs.Stat}_ node stat object for file/dir
* `delete` on every file/directory delete
  * **@param** _{String}_ file/directory full path
* `unwatch` on every file/directory unwatched or deleted
  * **@param** _{String}_ file/directory full path

## Tests

Tests are writting in [Mocha](http://github.com/visionmedia/mocha) using 
the [Chai](http://chaijs.com) `should` BDD assertion library. Make sure you 
have that installed, clone this repo, install dependacies using `npm install`.

    $ npm test

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) 
if you are interested in being regular contributor.

* Jake Luer ([@logicalparadox](http://github.com/logicalparadox))

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

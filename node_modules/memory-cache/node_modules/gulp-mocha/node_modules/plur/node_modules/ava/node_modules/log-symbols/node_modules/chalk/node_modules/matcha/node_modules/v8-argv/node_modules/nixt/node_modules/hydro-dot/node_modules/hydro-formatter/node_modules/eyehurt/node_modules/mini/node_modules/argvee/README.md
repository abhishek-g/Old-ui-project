# argvee [![Build Status](https://travis-ci.org/logicalparadox/argvee.png?branch=master)](https://travis-ci.org/logicalparadox/argvee)

> argv parsing (that is actually useful)

#### Installation

`argvee` is available on [npm](http://npmjs.org).

    npm install argvee

#### Usage

The `argvee` argument parser takes the node.js standard
`process.argv` array and constructs an object with helpers
that can easily be queried. 

```js
var argv = require('argvee')();
```

When constructed, the argv collection recognizes three
types command line arguments: _commands_, _modes_, and _parameters_.

Each of these types also has a helper that will provide quick access
to whether a _command_ or _mode_ is present, or the value of a _parameter_.

##### Commands

Commands are the simplest of arguments. They are any arguments
that are listed to that do not start with the `-` or `--` prefix.
Essentially, they are a list of keys.

```js
// $ node cli.js hello universe
argv.commands === [ 'hello', 'universe' ];
argv.command('hello'); // => true
```

##### Modes

Modes are also a non-value list of keys, but they can be expressed
differently by using the `-` or `--` prefix. When using modes, if
it begins with a single `-`, each letter will be parsed as its own mode.

```js
// $ node cli.js --universe -abc
argv.modes === [ 'universe', 'a', 'b', 'c' ];
argv.mode('a', 'd'); // => true (as a exists)
```

##### Parameters

Parameters are key:value pairs that are declared in a similiar manner
as modes. They can be declared in any of the following ways.

```js
// $ node cli.js --noun universe --noun=world -v say --topic=hello -w=now
argv.params === {
    noun: [ 'universe', 'world' ]
  , v: [ 'say' ] 
  , topic: [ 'hello' ]
  , w: [ 'now' ]
};

argv.param('noun'); // => [ 'universe', 'world' ]
// note: merges all params that exist if multiple arguments given
```

You can also specify parameters with multiple words by surrounding the
phrase with double-quotes.

```js
// $ node cli.js --say "hello universe" --say "hello world"
argv.params === {
  say: [ 'hello universe', 'hello world' ]
};
```

#### License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com> (http://alogicalparadox.com)

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

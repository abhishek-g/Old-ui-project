## API

### Environment

Create a new Environment object that will handle
storing everthing.

* `return`  


### foo ( something, options )

Specify a something that'll be used for any
of the commands that are called after it.

```js
foo('site', {})
```

* `something` {String}: name of the something to start using 
* `return` {Object} return `this` to enable chaining 


### foo.config ( config )

Set the global configuration one first call.
If a `something` has already been specified, then
use the `something` config and merge the given `config`
in.

Example:

```js
foo.config({
 options: { foo: 'bar' },
 src: 'path/to/src/files/*.hbs',
 dest: 'path/to/dest/'
});
```

* `config` {Object}: configuration object 
* `return` {Object} foo to enable chaining
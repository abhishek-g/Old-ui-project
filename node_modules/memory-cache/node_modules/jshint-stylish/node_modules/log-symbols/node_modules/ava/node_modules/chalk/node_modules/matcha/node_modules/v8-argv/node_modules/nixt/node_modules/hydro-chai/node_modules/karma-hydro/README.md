# karma-hydro

## Synopsis

Karma plugin for [hydro](https://github.com/hydrojs/hydro).

## Installation

```
npm install karma-hydro
```

## Configuration

```js
// karma.conf.js

module.exports = function(config) {
  config.set({
    frameworks: ['hydro'],

    files: [
      'test/*.js'
    ],

    hydro: {
      before: [
        'build/build.js' // files to be included before hydro
      ]
    },

    client: {
      hydro: {
        // hydro & hydro plugins options

        plugins: ['hydro-bdd' /* ... */],
        // ...

        // karma specific options

        setup: true // instantaneous setup, optional, default: false
      }
    }
  });
};
```

In most of the cases you might want to defer the hydro setup, because you want karma
to include your plugins, prepare the environment manually or what have you.

Hydro will set itself up with karma, but it won't call the `setup` method so you
can do it yourself later on.

Here is an example of how you can accomplish this:

```js
// karma.conf.js

module.exports = function(config) {
  config.set({
    frameworks: [ 'hydro' ],

    files: [
      'hydro-bdd',
      'hydro-whatever',
      'hydro.karma.js', // this is where you could call `setup`
      'test/*.js'
    ],
  });
};
```

```js
// hydro.karma.js

/* setup stuff, do whatever */

hydro.setup(); // here we setup hydro explicitly
```
## License

The MIT License (see LICENSE)

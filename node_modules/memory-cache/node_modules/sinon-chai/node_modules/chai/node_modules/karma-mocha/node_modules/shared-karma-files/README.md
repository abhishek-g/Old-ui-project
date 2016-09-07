# karma-shared-files

> karma-shared-files centralizes all the shared files between the Karma
> projects.

## Installation

```bash
npm install karma-shared-files --save-dev
```

## Usage

### Shared folder

The files in the `shared` folder are meant to be directly linked inside your
project without any modification. For more information, see the karmaSharedFiles
[option](#options).

### Models folder

The files in the `models` folder are meant to be copied and modified to fit your
needs.

## Options

### karmaSharedFiles
**Type:** Object

You have to provide an object which will be used to determined which files have
to be linked and where they should be linked.

The keys represent which files you want to link (relatively to the `./shared`
folder in this very repository), the values represent where you want to link
them (relatively to your `package.json`).

## Examples

This example shows how to link the `editorconfig` from the shared folder to the
`.editorconfig` endpoint at your project root.

```javascript
karmaSharedFiles: {
  "editorconfig": ".editorconfig"
}
```

This example shows how to link the `integration-tests.sh` file to a specific
folder.

```javascript
karmaSharedFiles: {
  "test/integration-tests.sh": "test/integration-tests.sh"
}
```

## Notes

- This repository is intended to be used by Karma developers.
- Tools documentation:
  - [CoffeeLint][coffeelint-doc]
  - [EditorConfig][editorconfig-doc]
  - [JSCS][jscs-doc]
  - [JSHint][jshint-doc]

## Contributors

See `package.json`.

## License

See `LICENSE`.


[jscs-doc]: https://github.com/mdevils/node-jscs#options "JSCS Documentation"
[jshint-doc]: http://www.jshint.com/docs/options/ "JSHint Documentation"
[coffeelint-doc]: http://www.coffeelint.org/#options "CoffeeLint Documentation"
[editorconfig-doc]: http://editorconfig.org/#file-format-details "EditorConfig Documentation"

# mocoverage

All-in-one reporter with test-coverage for mocha, using [blanket](https://www.npmjs.com/package/blanket), and
[mocha-text-cov](https://www.npmjs.com/package/mocha-text-cov).

# Configuring

1. install the dependencies:

```bash
npm install mocha --save-dev
npm install blanket --save-dev
npm install mocoverage --save-dev
```

2. add the following test line to the `scripts` stanza in your package.json:

```json
  {
    "scripts": {
      "test": "mocha --check-leaks --ui exports --require blanket -R mocoverage"
    }
  }
```

3. add configuration for blanket and mocoverage:

```javascript
{
  "config": {
    "blanket": {
      "pattern": "lib",
      "data-cover-never": [
        "node_modules",
        "test"
      ],
      "output-reporter": "spec"
    }
  }
}
```

_The important parts:_

* `output-reporter`: is the reporter that mocha will use for test output, in this
  case the output is in spec format.
* `pattern`: is the pattern used to match files that coverage should be applied to.

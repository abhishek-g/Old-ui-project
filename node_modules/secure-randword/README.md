## secure-randword

Generate random words using a CSPRNG -
[crypto.getRandom()](http://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback) on nodejs
or [window.crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues) on browsers,
via [secure-random](https://github.com/jprichardson/secure-random/).

Uses a [word list](https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt)
of 2048 words from Bitcoin's
[BIP 39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

### Install

    $ npm install secure-randword

### Use

    var randword = require('secure-randword');
    console.log(randword()); // one random word
    console.log(randword(5)); // 5 random words

### License
MIT

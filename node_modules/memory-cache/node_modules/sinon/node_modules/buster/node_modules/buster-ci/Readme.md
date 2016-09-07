# buster-ci

[![Build status](https://secure.travis-ci.org/busterjs/buster-ci.png?branch=master)](http://travis-ci.org/busterjs/buster-ci)

This module provides a way to easily use **Buster.JS** in the continues integration process.
With command `buster-ci` the buster server will be started, browsers started and captured, the tests executed
and finally the browsers closed and the server stopped. Using [buster agents](https://github.com/busterjs/buster-ci-agent)
even allows starting browsers on remote machines.


## Installation

To use this module you have to install **Buster.JS**

`npm install buster`


## Usage

Have a look at the **Buster.JS** [ documentation](http://docs.busterjs.org/en/latest/modules/buster-ci/),
to see how **buster-ci** is used.


## Changelog

**0.2.3** (15.07.2015)

* [Config option `errorOnDownAgent` added](http://docs.busterjs.org/en/latest/modules/buster-ci/#errorondownagent)

**0.2.2** (16.03.2015)

* [Capture headless browser](http://docs.busterjs.org/en/latest/modules/buster-ci/#capturing-headless-browser)

**0.2.1** (30.01.2015)

* Fix for issue [#448 - buster-ci should pass the server url to buster test cli](https://github.com/busterjs/buster/issues/448)

**0.2.0** (17.12.2014)

* arguments for test run can now be passed (breaking change, new version of buster.js is needed)
* timeouts for capturing and closing browsers can now be overwritten via config options

**0.1.1** (21.10.2014)

* can now handle gracefully disconnect of slave

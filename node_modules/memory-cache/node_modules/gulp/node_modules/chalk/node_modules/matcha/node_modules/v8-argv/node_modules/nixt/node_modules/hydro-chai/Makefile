#
# Variables
#

NAME = hydro-chai
KARMA = node_modules/.bin/karma
BROWSER = dist/hydro-chai.js
COV_EXEC = node_modules/.bin/_hydro
TEST_EXEC = node_modules/.bin/hydro
ISTANBUL = node_modules/.bin/istanbul
COVERALLS = node_modules/coveralls/bin/coveralls.js
COMPONENT_BUILD = node_modules/.bin/component-build
COMPONENT_INSTALL = node_modules/.bin/component-install

#
# All
#

all: clean install test

#
# Install
#

install: node_modules components build browser

#
# Browser build
#

browser: node_modules components
	@$(COMPONENT_BUILD) -s $(NAME) -o .
	@mv build.js $(BROWSER)

#
# Make a new development build
#

build: node_modules components
	@$(COMPONENT_BUILD) --dev

#
# Run all tests
#

test: test-node test-browser

#
# Run the Node.js tests
#

test-node: node_modules
	@$(TEST_EXEC)

#
# Run the browser tests
#

test-browser: test-component

#
# Test with component
#

test-component: node_modules components build
	@KARMA_TARGET=component $(KARMA) start

#
# Test coverage
#

test-cov: node_modules
	@$(ISTANBUL) cover $(COV_EXEC)

#
# Clean all
#

clean: clean-node clean-browser clean-components clean-cov

#
# Clean node_modules
#

clean-node:
	@rm -rf node_modules

#
# Clean the browser build
#

clean-browser:
	@rm -f $(BROWSER)

#
# Clean components & build
#

clean-components:
	@rm -rf build
	@rm -rf components

#
# Clean the test coverage
#

clean-cov:
	@rm -rf coverage

#
# CI
#

ci: test-node

#
# Install all components (+ dev)
#

components: node_modules component.json
	@$(COMPONENT_INSTALL) --dev

#
# Install Node.js modules
#

node_modules: package.json
	@npm install
	@touch $@

#
# Instructions
#

.PHONY: all test coverage browser build

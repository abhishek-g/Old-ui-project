all: test

# Make standalone browser build

standalone: node_modules components
	@./node_modules/.bin/component-build -s hydro-bdd -o .
	@mv build.js hydro-bdd.js

# Make a new build

build: components
	@./node_modules/.bin/component-build --dev

# Release

release: clean node_modules build standalone test
	@git changelog

# Clean

clean: clean-browser clean-components clean-cov

clean-node:
	@rm -rf node_modules

clean-browser:
	@rm -f hydro.js

clean-components:
	@rm -rf build
	@rm -rf components

clean-cov:
	@rm -rf coverage

# CI

test:
	@npm test

coveralls:
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_hydro --report lcovonly -- \
		&& cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

# Support

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

node_modules: clean-node
	@npm install

.PHONY: all test coverage standalone

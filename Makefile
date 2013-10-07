TESTS = "test/**/*.js"
REPORTER = list
MOCHA = ./node_modules/.bin/mocha
TIMEOUT = 10000

build: npm jshint

npm:
	@npm install

jshint:
	@./node_modules/.bin/jshint .

test: npm
	@NODE_ENV=test $(MOCHA) \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

watch: npm
	@NODE_ENV=test $(MOCHA) \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--growl \
		--watch \
		$(TESTS)

.PHONY: test watch build npm jshint

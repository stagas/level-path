
install: package.json
	@npm install --production

dev: package.json
	@npm install

test:
	@mocha -R spec test

test-watch:
	@mocha -w -R spec test

clean:
	rm -rf node_modules

.PHONY: test test-watch clean

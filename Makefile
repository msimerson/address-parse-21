%.js : %.ne
	nearleyc $< -o $@

check:: grammar.js node_modules/.bin/mocha
	./node_modules/.bin/mocha test/address.js

node_modules/.bin/mocha:
	npm i

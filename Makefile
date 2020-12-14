%.js : %.ne
	./node_modules/.bin/nearleyc $< -o $@

check:: grammar.js node_modules/.bin/mocha node_modules/.bin/nearleyc
	./node_modules/.bin/mocha test/address.js

node_modules/.bin/mocha:
	npm i

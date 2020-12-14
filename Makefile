PATH := $(PATH):./node_modules/.bin

%.js : %.ne | node_modules
	nearleyc $< -o $@

check:: grammar.js | node_modules
	mocha test/address.js

clean::
	rm -rf node_modules
	rm grammar.js

node_modules:
	npm i

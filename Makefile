%.js : %.ne
	nearleyc $< -o $@

grammar.js:

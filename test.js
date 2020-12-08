"use strict";

const nearley = require("nearley");

const grammar = nearley.Grammar.fromCompiled(require("./grammar.js"));

grammar.start = "main";

const path_parser = new nearley.Parser(grammar);

path_parser.feed('<"foo bar"@bar.com>');

console.log(JSON.stringify(path_parser.results));

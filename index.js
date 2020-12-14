"use strict";

const punycode = require("punycode");

const nearley = require("nearley");

const grammar = nearley.Grammar.fromCompiled(require("./grammar.js"));

grammar.start = "main";

// a class encapsulating an email address per RFC-5321

function Address(user, host) {
    if (typeof user === "object" && user.original) {
        // Assume constructing from JSON parse
        for (const k in user) {
            this[k] = user[k];
        }
        return this;
    }
    if (!host) {
        this.original = user;
        this.parse(user);
    } else {
        this.original = user + "@" + host;
        this.user = user;
        this.original_host = host;

        if (/[\u00C0-\uFFFF]/.test(host)) {
            this.is_utf8 = true;
            host = punycode.toASCII(host);
        }

        this.host = host.toLowerCase();
    }
}

Address.prototype.parse = function (addr) {
    // empty addr is ok
    if (addr === "" || addr === "<>") {
        this.user = "";
        this.host = "";
        return;
    }

    // bare postmaster is permissible: RFC-5321 (4.1.1.3)
    const addrlc = addr.toLowerCase();
    if (addrlc === "postmaster" || addrlc == "<postmaster>") {
        this.user = "postmaster";
        this.host = "";
        return;
    }

    const parser = new nearley.Parser(grammar);
    //console.log(`addr === "${addr}"`);
    parser.feed(addr);
    const result = parser.results[0][0];
    //console.log(`local_part == ${result.local_part}`);
    //console.log(`domain     == ${result.domain}`);

    var domainpart = result.domain;
    this.original_host = domainpart;

    if (/[\u0100-\uFFFF]/.test(domainpart)) {
        this.is_utf8 = true;
        domainpart = punycode.toASCII(domainpart);
    }

    this.host = domainpart.toLowerCase();
    this.user = result.local_part;
};

Address.prototype.isNull = function () {
    return this.user ? 0 : 1;
};

Address.prototype.format = function (use_punycode) {
    if (this.isNull()) {
        return "<>";
    }

    return "<" + this.address(null, use_punycode) + ">";
};

Address.prototype.address = function (set, use_punycode) {
    if (set) {
        this.original = set;
        this.parse(set);
    }
    return (this.user || "") + (this.original_host ? "@" + (use_punycode ? this.host : this.original_host) : "");
};

Address.prototype.toString = function () {
    return this.format();
};

exports.Address = Address;

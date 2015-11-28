"use strict"

let opt = require("./opt.js")
let Opt = opt.Opt, Some = opt.Some, None = opt.None

function Itr() {}
Itr.prototype[Symbol.iterator] = function() {return this}
Itr.prototype.toString = function toString() {
	return "<<iterator " + this.constructor.name + ">>"
}

module.exports = Itr
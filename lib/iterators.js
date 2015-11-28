"use strict"

let opt = require("./opt.js")
let Itr = require("./Itr.js")

function FnItr(stepFn) {
	Itr.call(this)
	this.next = stepFn
}
FnItr.prototype = Object.create(Itr.prototype)

function ArrayItr(array) {
	if (new.target === undefined) {
		return new ArrayItr(array)
	}
	let i = 0
	FnItr.call(this, () => i >= array.length ? opt.None : opt.Some(array[i++]))
}
ArrayItr.prototype = Object.create(FnItr.prototype)

function SingletonItr(value) {
	if (new.target === undefined) {
		return new SingletonItr(value)
	}
	Itr.call(this)
	Object.defineProperty(this, "value", {value: value, enumerable: false, writable: false, configurable: false})
	this.done = undefined
}
SingletonItr.prototype = Object.create(Itr.prototype)
SingletonItr.prototype.next = function() {
	this.done = (this.done === undefined)
	return this
}

exports.ArrayItr = ArrayItr
exports.FnItr = FnItr
exports.SingletonItr = SingletonItr
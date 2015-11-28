"use strict"

let iterators = require('./iterators.js')
let ArrayItr = iterators.ArrayItr
let Itr = require('./Itr.js')

function Opt(value) {
	if (new.target === Opt) {
		throw new Error("Opt must be used as a function, not a constructor.")
	}
	if (value === undefined) {
		return None
	}
	return Some(value)
}

Opt.prototype.map = function map(fn) {
	if (!this.done) {
		return Some(fn(this.value))
	} else {
		return None
	}
}

Opt.map = function map(iteratorStep, fn) {
	if (!iteratorStep.done) {
		return Some(fn(iteratorStep.value))
	} else {
		return None
	}
}

Opt.prototype.flatMap = function flatMap(fn) {
	if (!this.done) {
		let result = fn(this.value)
		if (result instanceof Opt) {
			return result
		} else {
			Some(fn(this.value))
		}
	} else {
		return None
	}
}

const Some = function Some(value) {
	if (new.target === undefined) {
		return new Some(value)
	}
	Object.defineProperties(this, {
		value: {value: value, configurable: false, writable: false},
		done: {value: false, configurable: false, writable: false}
	})
}
Some.prototype = Object.create(Opt.prototype)
Some.prototype.toString = function() {
	return "Some(" + this.value + ")"
}
Some.prototype[Symbol.iterator] = function() {
	return new iterators.SingletonItr(this.value)
}

const None = Object.create(Opt.prototype, {
	done: {value: true, configurable: false, writable: false},
	toString: {value: () => "None", configurable: false, writable: false},
	[Symbol.iterator]: {value: function() {
		let result = new Itr()
		result.next = () => None
		return result
	}, configurable: false, writable: false}
})

exports.Opt = Opt
exports.Some = Some
exports.None = None
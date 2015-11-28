"use strict"

let IteratorFns = require('./iterator_functions.js')

function define(fn) {
	return function(combine) {
		return (current, item) => fn(combine, current, item)
	}
}

function enableInstantApplication(transducer, args, optionalsStart) {
	if (args.length > optionalsStart) {
		let itr = args[optionalsStart][Symbol.iterator]()
		if (args.length > optionalsStart + 1) {
			let reduceFn = args[optionalsStart + 1]
			let destination = args[optionalsStart + 2]
			return IteratorFns.reduce(itr, transducer(reduceFn), destination)
		} else {
			return IteratorFns.transform(itr, transducer)
		}
	}
	return transducer
}

function map(transformFn) {
	let transducer = define(function(combine, current, item) {
		var result = transformFn(item)
		return combine(current, result)
	})
	return enableInstantApplication(transducer, arguments, 1)
}

function filter(filterFn, itr, reduceFn, destination) {
	let transducer = define((combine, current, item) => filterFn(item) ? combine(current, item) : current)
	return enableInstantApplication(transducer, arguments, 1)
}

function takeWhile(predicate) {
	let done = false
	let transducer = define((combine, current, item) => {
		if (!done) {
			done = !predicate(item)
		}
		return done ? current : combine(current, item)
	})
	return enableInstantApplication(transducer, arguments, 1)
}

function take(number, itr, reduceFn, destination) {
	let args = Array.prototype.slice.call(arguments)
	args[0] = (item) => --number >= 0
	return takeWhile.apply(this, args)
}

function dropWhile(predicate, itr, reduceFn, destination) {
	let dropping = true
	let transducer = define((combine, current, item) => {
		if (dropping) {
			dropping = predicate(item)
		}
		return dropping ? current : combine(current, item)
	})
	return enableInstantApplication(transducer, arguments, 1)
}

function drop(items, itr, reduceFn, destination) {
	let args = Array.prototype.slice.call(arguments)
	args[0] = (item) => --items >= 0
	return dropWhile.apply(this, args)
}

function edge() {
	let lastValue = undefined
	let transducer = define((combine, current, item) => {
		if (item != lastValue) {
			lastValue = item
			return combine(current, item)
		} else {
			return current
		}
	})
	return enableInstantApplication(transducer, arguments, 0)
}

exports.define = define
exports.map = map
exports.filter = filter
exports.take = take
exports.takeWhile = takeWhile
exports.drop = drop
exports.dropWhile = dropWhile
exports.edge = edge
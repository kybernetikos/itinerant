"use strict"

exports.pipe = function pipe(fnA, fnB) {
	return function(item) {
		return fnB(fnA(item))
	}
}

exports.compose = function compose(f, g) {
	let fns = arguments
	return function(item) {
		let currentItem = item
		for (var i = fns.length - 1; i >= 0; --i) {
			currentItem = fns[i](currentItem)
		}
		return currentItem
	}
}

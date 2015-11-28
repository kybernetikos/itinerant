"use strict"

let opt = require("./opt.js")
let Opt = opt.Opt, Some = opt.Some, None = opt.None

let iterators = require("./iterators.js")
let FnItr = iterators.FnItr

let FunctionFns = require('./function_functions.js')

// Steps the iterator and returns the last value
function end(iterator, defaultValue) {
	let result = defaultValue
	let resultOpt
	do {
		resultOpt = iterator.next()
		if (resultOpt.done) {
			return result
		} else {
			result = resultOpt.value
		}
	} while (true)
}

// returns an iterator that can be stepped through each stage of the reduce
// may be used in either pull or push mode.
// to get the typical reduce behaviour, call end on the resulting iterator, and that will pull
// values through.
function reduce(iterator, reduceFn, destination) {
	if (arguments.length < 2) {
		reduceFn = (arr, item) => {
			arr.push(item)
			return arr
		}
		destination = []
	}
	let result = destination
	return new FnItr(() => Opt.map(iterator.next(), (value) => result = reduceFn(result, value) ))
}

// applies a transducer to this iterator, returning a new iterator.
// fulfilling .next on the new iterator may require multiple .nexts on the source iterator
// so this iterator will pull values.
function transform(iterator, transduceFn) {
	// applies a transduce fn returning an iterator over final values
	// will pull values as needed.
	let transducer = transduceFn
	if (arguments.length > 2) {
		transducer = FunctionFns.compose.apply(null, Array.prototype.slice.call(arguments, 1))
	}
	let provided = None
	let reduceFn = transducer((x, i) => {
		provided = Some(i)
	})
	let src = reduce(iterator, reduceFn)
	return new FnItr(() => {
		while (provided === None) {
			if (src.next().done) {
				break;
			}
		}
		let result = provided
		provided = None
		return result
	})
}

exports.end = end
exports.reduce = reduce
exports.transform = transform
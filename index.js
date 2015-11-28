"use strict"

let opt = require("./lib/opt.js")
let Opt = opt.Opt, Some = opt.Some, None = opt.None

let bless = require('./lib/bless.js')
let Itr = require('./lib/Itr.js')
let IteratorFns = require('./lib/iterator_functions.js')
let iterators = require('./lib/iterators.js')
let transducers = require('./lib/transducers.js')
let map = transducers.map, filter = transducers.filter, take = transducers.take, takeWhile = transducers.takeWhile,
	drop = transducers.drop, dropWhile = transducers.dropWhile, edge = transducers.edge
let FunctionFns = require('./lib/function_functions.js')
let compose = FunctionFns.compose

bless(Itr.prototype, IteratorFns)
bless(Function.prototype, FunctionFns)
bless(Array.prototype, {
	iter: iterators.ArrayItr
})

Array.push = function push(arr, item) {
	if (arr === undefined) {
		arr = []
	}
	arr.push(item)
	return arr
}

let l = [1, 2, 3, 5, 10, 2, 9, 1]
	.iter()
	.transform(
		map((x) => x * 2),
		filter((x) => x > 6),
		takeWhile((x) => x !== 18)
	)
	.reduce()
	.end()

let i = [1, 1, 1, 2, 3, 2, 2, 2, 4, 4, 1, 2, 3]
	.iter()
	.transform(
		edge(),
		map((x) => x * 5)
	)
	.reduce()
	.end()

console.log(i)
"use strict"

function bless(target, benefaction) {
	let allDescriptors = {}
	for (let propertyName of Object.getOwnPropertyNames(benefaction)) {
		let descriptor = Object.getOwnPropertyDescriptor(benefaction, propertyName)
		if (descriptor.value instanceof Function) {
			let unboundFunction = descriptor.value
			descriptor.value = function() {
				let args = Array.prototype.slice.call(arguments)
				Array.prototype.splice.call(args, 0, 0, this)
				return unboundFunction.apply(this, args)
			}
			descriptor.enumerable = false
		}
		allDescriptors[propertyName] = descriptor
	}
	Object.defineProperties(target, allDescriptors)
}

module.exports = bless
import Index from './src/mobx';

// function doSomething(name) {
// 	console.log('Hello, ' + name);
// }

// function loggingDecorator(wrapped) {
// 	return function () {
// 		console.log('Starting');
// 		const result = wrapped.apply(this, arguments);
// 		console.log('Finished');
// 		return result;
// 	};
// }

// const wrapped = loggingDecorator(doSomething);

// doSomething('tom')

// wrapped('json')


// decorator

// function log(Class) {
// 	return (...args) => {
// 		console.log(args);
// 		return new Class(...args);
// 	};
// }

// @log
// class Example {
// 	constructor(name, age) {
// 	}
// }

// const e = new Example('Graham', 34);
// // [ 'Graham', 34 ]
// console.log(e);
// // Example {}

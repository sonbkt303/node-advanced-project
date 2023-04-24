import awilix from "awilix";
import { mongodb } from './datasource/index.js';
const { createContainer, asClass, asValue, asFunction } = awilix;
const container = createContainer();

const sayHi = () => {
  console.log('Hi');
}

const makePrintTime =
  ({ time }) =>
  () => {
    console.log("Time:", time);
  };

const getTime = () => new Date().toString();

container.register({
  printTime: asFunction(makePrintTime).singleton(),
  time: asFunction(getTime).transient(),
  sayHi: asFunction(sayHi).transient(),
  mongodbConnection: asValue(mongodb),
});

// Resolving `time` 2 times will
// invoke `getTime` 2 times.
// container.resolve("time");
// container.resolve("time");

// container.resolve('printTime')()
// container.resolve('printTime')()
// container.resolve('sayHi');


export default container;
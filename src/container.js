import * as awilix from "awilix";
import { mongodb } from "@datasource";
import UserSchema from "./modules/users/models.js";
import { modelConfig } from "@config";

const { createContainer, asClass, asValue, asFunction } = awilix;

const container = createContainer();

const sayHi = () => {
  console.log("Hi");
};

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
  mongodbConnection: asValue(mongodb?.connection),
  userProvider: asValue(
    mongodb?.model(
      modelConfig.modelName.USER.NAME,
      UserSchema,
      modelConfig.modelName.USER.COLLECTION
    )
  ),
});

// Resolving `time` 2 times will
// invoke `getTime` 2 times.
// container.resolve("time");
// container.resolve("time");

// container.resolve('printTime')()
// container.resolve('printTime')()
// container.resolve('sayHi');

export default container;

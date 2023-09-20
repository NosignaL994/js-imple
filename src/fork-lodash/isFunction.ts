import { Noop } from "../typings";

function isFunction(func: any): func is Noop {
  return typeof func === "function";
}

export default isFunction;

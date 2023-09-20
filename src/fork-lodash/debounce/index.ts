/**
 * debounce
 * delay `func` running, and flush the delay when each call debounced
 */

import { Noop, TimeoutId } from "@/typings";
// import type { Timeout } from "node";

/**
 * @param func function to be debounced
 * @param delay millsecond of the debounce delay
 * @param options debounce options
 * @returns debounced function
 */
function debounce<F extends Noop>(func: F, delay: number, options?: Options) {
  let lastCallTime = 0;
  let lastRunTime = 0;
  let lastArgs: Parameters<F> | undefined = undefined;
  let lastThis: ThisParameterType<F> | undefined = undefined;
  let timerId: TimeoutId | undefined = undefined;
  let result: ReturnType<F>;

  const lead = !!options && options.lead;
  const trail = !!options && options.trail;
  const delayLimit = options?.delayLimit;

  const calcRemainWait = (time: number) => {
    return delay - (time - lastCallTime);
  };

  const run = () => {
    if (lastArgs === undefined) return;
    lastRunTime = Date.now();
    result = func.apply(lastThis, lastArgs);
    lastThis = lastArgs = undefined;
  };

  // check should run, run `func`, else new remain timeout
  const timeExpire = () => {
    const time = Date.now();
    const sinceLastCall = time - lastCallTime;
    const sinceLastRun = time - lastRunTime;

    // timeout of delay or timeout of delayLimit
    const isDelayEnd =
      sinceLastCall >= delay || (!!delayLimit && sinceLastRun >= delayLimit);
    console.log("isDelayEnd: ", isDelayEnd, calcRemainWait(time));
    // timeout is not over, continue the remain timeout
    if (!isDelayEnd) {
      timerId = setTimeout(timeExpire, calcRemainWait(time));
      return;
    }

    // timeout is over, run `func` if trail setted true and debounced function called at lease on in the delay
    if (trail && lastArgs) run();
    timerId = undefined;
  };

  function debounced(this: ThisParameterType<F>, ...args: Parameters<F>) {
    lastArgs = args;
    lastCallTime = Date.now();
    lastThis = this;

    if (lead && timerId === undefined) run();

    if (timerId === undefined) timerId = setTimeout(timeExpire, delay);

    return result;
  }

  return debounced;
}

interface Options {
  delayLimit?: number;
  lead?: boolean;
  trail?: boolean;
}

export default debounce;

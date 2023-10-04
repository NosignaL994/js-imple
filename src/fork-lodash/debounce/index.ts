/**
 * debounce
 * delay `func` running, and flush the delay when each call debounced
 */

import { Noop, TimeoutId } from "@/typings";

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

  const lead = !!(options && options.lead);
  const trail = !!((options && options.trail) ?? true);
  const delayLimit = options?.delayLimit;

  const hitLead = () => timerId === undefined;
  const hitTrail = (time: number) => !!(time - lastCallTime >= delay);
  const hitLimit = (time: number) =>
    !!(timerId && delayLimit) && time - lastRunTime >= delayLimit;

  const calcRemainWait = (time: number) => {
    return delay - (time - lastCallTime);
  };

  const run = () => {
    // debounced function called at lease once after last running
    if (lastArgs === undefined) return;
    // invoke func and clean the context to avoid running repeated
    lastRunTime = Date.now();
    result = func.apply(lastThis, lastArgs);
    lastThis = lastArgs = undefined;
  };

  // check is trail, handle is or not
  const timeExpire = () => {
    const time = Date.now();
    const isHitTrail = hitTrail(time);

    // handle not hit trail, timeout is not over, continue the remain timeout
    if (!isHitTrail) {
      timerId = setTimeout(timeExpire, calcRemainWait(time));
      return;
    }

    // handle trail hitted, run `func` if trail setted true and debounced function called at lease once in the delay
    timerId = undefined;
    if (trail) run();
    // reset lastRunTime when trail as the end point of the delay
    lastCallTime = lastRunTime = 0;
  };

  function debounced(this: ThisParameterType<F>, ...args: Parameters<F>) {
    const now = Date.now();
    lastArgs = args;
    lastCallTime = now;
    lastThis = this;

    const isHitLead = hitLead();
    // handle hit lead
    if (isHitLead) {
      // set now time to lastRunTime as start point of the delay
      lastRunTime = now;
      if (lead) run();
    }

    const isHitLimit = hitLimit(now);
    // handle hit limit, run func immediately
    if (isHitLimit) run();

    // set timeout timer
    if (timerId === undefined) timerId = setTimeout(timeExpire, delay);

    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastRunTime = lastCallTime = 0;
    lastArgs = lastThis = timerId = undefined;
  }
  function pending() {
    return timerId !== undefined;
  }
  // function flush() {}

  debounced.cancel = cancel;
  debounced.pending = pending;
  return debounced;
}

interface Options {
  delayLimit?: number;
  lead?: boolean;
  trail?: boolean;
}

export default debounce;

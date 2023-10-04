import debounce from "@/fork-lodash/debounce";
import { Noop } from "@/typings";

export default function throttle<T extends Noop>(fn: T, interval: number) {
  return debounce(fn, interval, { delayLimit: interval });
}

import { TIME_INTERVALS } from 'utils/constants';
import { Interval } from 'utils/types';

function getIntervalObject(seconds: number, interval: number, index: number): Interval {
  if (Math.floor(seconds % interval) !== 0) {
    // revert to seconds
    return { name: TIME_INTERVALS.names[0], value: seconds, index: 0 };
  }
  return {
    name: TIME_INTERVALS.names[index],
    value: Math.floor(seconds / interval),
    index: index,
  };
}

/**
 * getInterval tries to convert seconds to an aproximate type of Interval
 * following the breakpoints of:
 * -less then 1 minute - show seconds
 * -less then 1 hour - show minutes
 * -less then 1 day - show hours
 * -more than 1 day - show days
 * if not exact amounts or miltiplies of the above breakpoints reached
 * then it revert back to seconds
 *
 * @param {number} seconds time in second
 * @returns {Interval}
 */
function getInterval(seconds: number): Interval | undefined {
  const intervals = TIME_INTERVALS.values;
  let determined = false;
  let index = intervals.length - 1;

  while (!determined) {
    if (seconds >= intervals[intervals.length - 1]) {
      determined = true;
      return getIntervalObject(seconds, intervals[intervals.length - 1], intervals.length - 1);
    }

    // find range
    if (seconds < intervals[index] && seconds >= intervals[index - 1]) {
      determined = true;
      return getIntervalObject(seconds, intervals[index - 1], index - 1);
    }

    index--;
    if (index === 0) {
      break;
    }
  }
}

export default getInterval;

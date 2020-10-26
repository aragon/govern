import dayjs from 'dayjs'

export function getExecutionTimeFromUnix(futureTimestamp) {
  const now = dayjs()
  const executionTime = dayjs.unix(Number(futureTimestamp))

  const minutesDiff = executionTime.diff(now, 'm')

  if (minutesDiff <= 0) {
    const secondsDiff = executionTime.diff(now, 's')
    return executionTime.diff(now, 's') <= 0 ? 'None' : `0m ${secondsDiff}s`
  }

  return `${minutesDiff}m`
}

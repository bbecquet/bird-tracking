export const tsToDate = timestamp => new Date(timestamp * 1000)
export const dateToTs = date => Math.round(date.getTime() / 1000)

export const getTimeRange = (features, sameYear) => {
  const allTimes = features.flatMap(f => f.properties.times)

  if (sameYear) {
    const minYear = allTimes.reduce(
      (min, v) => Math.min(min, tsToDate(v).getFullYear()),
      [Number.MAX_SAFE_INTEGER]
    )
    const minTime = dateToTs(new Date(minYear, 0, 1))
    return [minTime, minTime + 3600 * 24 * 365]
  } else {
    return allTimes.reduce(
      ([min, max], v) => [Math.min(min, v), Math.max(max, v)],
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    )
  }
}

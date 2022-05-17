import { min } from './utils'

export function transformData(features) {
  // extract min year accross every observations
  const parsedDates = features.map(f => ({
    ...f,
    properties: {
      ...f.properties,
      times: f.properties.times.map(dt => new Date(dt)),
    },
  }))
  const minYear = min(parsedDates.flatMap(f => f.properties.times.map(t => t.getFullYear())))

  // apply same start year to every trip
  const sameYear = parsedDates.map(f => {
    const yearShift = f.properties.times[0].getFullYear() - minYear
    return {
      ...f,
      properties: {
        ...f.properties,
        times: f.properties.times.map(date => {
          // also converts to times expressed in seconds
          return date.setFullYear(date.getFullYear() - yearShift)
        }),
      },
    }
  })

  return sameYear
}

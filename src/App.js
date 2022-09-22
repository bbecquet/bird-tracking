import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ANIMATION_SPEED, AUTO_PLAY } from './config'
import { getTimeRange } from './times'
import { usePageVisibility } from './usePageVisibility'
import { useSetting } from './Settings'
import { tsToDate } from './times'

const App = () => {
  const [data, setData] = useState([])
  const [timeRange, setTimeRange] = useState([])
  const [time, setTime] = useState(0)
  const [isTimeRunning, setIsTimeRunning] = useState(false)
  const updateHandle = useRef(null)

  const [highlightedSpecies] = useSetting('highlightedSpecies')
  const [activeSpeciesList] = useSetting('activeSpeciesList', [])
  const [sameYear] = useSetting('sameYear')
  const [speed] = useSetting('speed')

  const isPageVisible = usePageVisibility()

  useEffect(() => {
    document.body.classList.add('loading')
    fetch('./birds.geojson')
      .then(response => response.json())
      .then(data => data.features)
      .then(features => {
        setData(features)
        document.body.classList.remove('loading')
      })
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const [minTime, maxTime] = getTimeRange(data, sameYear)
      setTimeRange([minTime, maxTime])
      setTime(minTime)
      if (AUTO_PLAY) {
        setIsTimeRunning(true)
      }
    }
  }, [sameYear, data])

  useEffect(() => {
    const pauseOnSpace = e => {
      if (
        e.key === ' ' &&
        data.length !== 0 &&
        !['BUTTON', 'A', 'INPUT'].includes(e.target?.tagName)
      ) {
        setIsTimeRunning(prev => !prev)
      }
    }
    document.body.addEventListener('keypress', pauseOnSpace)

    return () => {
      document.body.removeEventListener('keypress', pauseOnSpace)
    }
  }, [data])

  useEffect(() => {
    if (isPageVisible && isTimeRunning && !updateHandle.current) {
      updateHandle.current = setInterval(() => {
        setTime(time => time + ANIMATION_SPEED * speed)
      }, 50)
    }

    return () => {
      if (updateHandle.current) {
        clearInterval(updateHandle.current)
        updateHandle.current = null
      }
    }
  }, [isTimeRunning, setTime, speed, isPageVisible])

  useEffect(() => {
    if (time > timeRange[1]) {
      setTime(timeRange[0])
    }
  }, [time, timeRange, setTime])

  const transformedData = useMemo(() => {
    const filteredData = data.filter(d => activeSpeciesList.includes(d.properties.species))

    const minYear = new Date(timeRange[0] * 1000).getFullYear()

    if (!sameYear || !minYear) {
      return filteredData
    }

    return filteredData.map(feature => {
      const times = feature.properties.times
      // transform times so they are all considered in the same year
      const timeStampShift =
        (new Date(tsToDate(times[0]).getFullYear(), 0, 1) - new Date(minYear, 0, 1)) / 1000
      return {
        ...feature,
        properties: {
          ...feature.properties,
          times: times.map(t => t - timeStampShift),
        },
      }
    })
  }, [data, activeSpeciesList, sameYear, timeRange])

  return (
    <>
      <div id="layout">
        <MapView time={time} data={transformedData} highlightedSpecies={highlightedSpecies} />
        <Panel
          time={time}
          timeRange={timeRange}
          setTime={setTime}
          isTimeRunning={isTimeRunning}
          setIsTimeRunning={setIsTimeRunning}
        />
      </div>
      {data.length === 0 && <div id="loading">Please wait for data to be fetched…</div>}
    </>
  )
}

export default App

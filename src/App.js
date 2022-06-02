import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ANIMATION_SPEED, AUTO_PLAY } from './config'
import { getTimeRange } from './times'
import { usePageVisibility } from './usePageVisibility'
import { useSetting } from './Settings'

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

  const filteredData = useMemo(
    () => data.filter(d => activeSpeciesList.includes(d.properties.species)),
    [data, activeSpeciesList]
  )

  return (
    <>
      <div id="layout">
        <MapView
          time={time}
          minTime={timeRange[0]}
          sameYear={sameYear}
          data={filteredData}
          highlightedSpecies={highlightedSpecies}
        />
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

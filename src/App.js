import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo, useRef } from 'react'
import { speciesList, ANIMATION_SPEED, AUTO_PLAY } from './config'

const getTimeRange = features => {
  return features
    .flatMap(f => f.properties.times)
    .reduce(
      ([min, max], v) => [Math.min(min, v), Math.max(max, v)],
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    )
}

const App = () => {
  const [time, setTime] = useState(0)
  const [timeRange, setTimeRange] = useState([])
  const [data, setData] = useState([])
  const [highlightedSpecies, setHighlightedSpecies] = useState(null)
  const [activeSpeciesList, setActiveSpeciesList] = useState(
    speciesList.map(species => species.name)
  )
  const [isTimeRunning, setIsTimeRunning] = useState(false)
  const updateHandle = useRef(null)

  useEffect(() => {
    document.body.classList.add('loading')
    fetch('./birds.geojson')
      .then(response => response.json())
      .then(data => data.features)
      .then(features => {
        const [minTime, maxTime] = getTimeRange(features)
        setTimeRange([minTime, maxTime])
        setTime(minTime)
        setData(features)
        if (AUTO_PLAY) {
          setIsTimeRunning(true)
        }
        document.body.classList.remove('loading')
      })
  }, [])

  useEffect(() => {
    const pauseOnSpace = e => {
      if (e.key === ' ' && data.length !== 0) {
        setIsTimeRunning(prev => !prev)
      }
    }
    document.body.addEventListener('keypress', pauseOnSpace)

    return () => {
      document.body.removeEventListener('keypress', pauseOnSpace)
    }
  }, [data])

  useEffect(() => {
    if (isTimeRunning) {
      if (!updateHandle.current) {
        updateHandle.current = setInterval(() => {
          setTime(time => time + ANIMATION_SPEED)
        }, 50)
      }
    } else if (updateHandle.current) {
      clearInterval(updateHandle.current)
      updateHandle.current = null
    }
  }, [isTimeRunning, setTime])

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
        <MapView time={time} data={filteredData} highlightedSpecies={highlightedSpecies} />
        <Panel
          time={time}
          timeRange={timeRange}
          setTime={setTime}
          setHighlightedSpecies={setHighlightedSpecies}
          activeSpeciesList={activeSpeciesList}
          setActiveSpeciesList={setActiveSpeciesList}
          isTimeRunning={isTimeRunning}
          setIsTimeRunning={setIsTimeRunning}
        />
      </div>
      {data.length === 0 && <div id="loading">Loading…</div>}
    </>
  )
}

export default App

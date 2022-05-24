import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo, useRef } from 'react'
import { min } from './utils'
import { speciesList, ANIMATION_SPEED, LOOP, AUTO_PLAY } from './config'

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
        const minTime = min(features.flatMap(f => f.properties.times))
        setTimeRange([minTime, minTime + LOOP])
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
    if (time > timeRange[0] + LOOP) {
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

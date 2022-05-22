import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo } from 'react'
import { min } from './utils'
import { speciesList, LOOP } from './config'

const App = () => {
  const [time, setTime] = useState(0)
  const [timeRange, setTimeRange] = useState([])
  const [data, setData] = useState([])
  const [highlightedSpecies, setHighlightedSpecies] = useState(null)
  const [activeSpeciesList, setActiveSpeciesList] = useState(
    speciesList.map(species => species.name)
  )

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
        document.body.classList.remove('loading')
      })
  }, [])

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
        />
      </div>
      {data.length === 0 && <div id="loading">Loading…</div>}
    </>
  )
}

export default App

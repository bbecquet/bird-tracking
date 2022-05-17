import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo } from 'react'
import { transformData } from './transformData'
import { min } from './utils'
import { speciesList } from './birdSpecies'

const LOOP = 3600 * 24 * 365 * 1000

const App = () => {
  const [time, setTime] = useState(0)
  const [timeRange, setTimeRange] = useState([])
  const [data, setData] = useState([])
  const [highlightedSpecies, setHighlightedSpecies] = useState(null)
  const [activeSpeciesList, setActiveSpeciesList] = useState(
    speciesList.map(species => species.name)
  )

  useEffect(() => {
    fetch('./birds.geojson')
      .then(response => response.json())
      .then(data => data.features)
      .then(transformData)
      .then(features => {
        const minTime = min(features.flatMap(f => f.properties.times))
        setTimeRange([minTime, minTime + LOOP])
        setTime(minTime)
        setData(features)
      })
  }, [])

  const filteredData = useMemo(
    () => data.filter(d => activeSpeciesList.includes(d.properties.species)),
    [data, activeSpeciesList]
  )

  return (
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
  )
}

export default App

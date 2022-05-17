import { speciesList } from './birdSpecies'
import SpeciesToggles from './SpeciesToggles'
import TimeControl from './TimeControl'

const Panel = ({
  time,
  timeRange,
  setTime,
  setHighlightedSpecies,
  setActiveSpeciesList,
  activeSpeciesList,
}) => {
  return (
    <div id="panel">
      <div>
        {/* <h1>Bird tracking</h1> */}
        <TimeControl time={time} timeRange={timeRange} setTime={setTime} />
        <SpeciesToggles
          speciesList={speciesList}
          setHighlighted={setHighlightedSpecies}
          activeSpeciesList={activeSpeciesList}
          setActiveSpeciesList={setActiveSpeciesList}
        />
      </div>
      <div className="credits">
        <h2>Credits</h2>
        <p>
          Data source: <a href="https://gbif.org">GBIF.org</a> - BirdMap Data - GPS tracking of
          Storks, Cranes and birds of prey, breeding in Northern and Eastern Europe
          <a href="https://doi.org/10.15468/dl.fufxjs">Occurrence download</a> (09 May 2022) (CC
          BY-NC 4.0)
        </p>
        <p>
          Bird pictures: <a href="https://commons.wikimedia.org">WikiMedia Commons</a>
        </p>
        <p>
          Map background: &copy; <a href="https://carto.com/about-carto/">CARTO</a> &copy;{' '}
          <a href="http://www.openstreetmap.org/about/">OpenStreetMap</a> contributors
        </p>
        <p>Built with deck.gl and MapLibre-GL</p>
      </div>
    </div>
  )
}

export default Panel

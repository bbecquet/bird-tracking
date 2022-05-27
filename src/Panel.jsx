import { speciesList } from './config'
import BirdControls from './BirdControls'
import TimeControl from './TimeControl'
import Credits from './Credits'

const Panel = ({
  time,
  timeRange,
  setTime,
  setHighlightedSpecies,
  setActiveSpeciesList,
  activeSpeciesList,
  isTimeRunning,
  setIsTimeRunning,
  sameYear,
  setSameYear,
}) => {
  return (
    <div id="panel">
      <h1 className="u-mobileHidden">Flying paths of some birds</h1>
      <TimeControl
        time={time}
        timeRange={timeRange}
        setTime={setTime}
        isTimeRunning={isTimeRunning}
        setIsTimeRunning={setIsTimeRunning}
        sameYear={sameYear}
        setSameYear={setSameYear}
      />
      <BirdControls
        speciesList={speciesList}
        setHighlighted={setHighlightedSpecies}
        activeSpeciesList={activeSpeciesList}
        setActiveSpeciesList={setActiveSpeciesList}
      />
      <Credits />
    </div>
  )
}

export default Panel

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
}) => {
  return (
    <div id="panel">
      {/* <h1>Bird tracking</h1> */}
      <TimeControl
        time={time}
        timeRange={timeRange}
        setTime={setTime}
        isTimeRunning={isTimeRunning}
        setIsTimeRunning={setIsTimeRunning}
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

import BirdControls from './BirdControls'
import TimeControl from './TimeControl'
import Credits from './Credits'

const Panel = ({ time, timeRange, setTime, isTimeRunning, setIsTimeRunning }) => {
  return (
    <div id="panel">
      <h1 className="u-mobileHidden">Flying paths of some birds</h1>
      <TimeControl
        time={time}
        timeRange={timeRange}
        setTime={setTime}
        isTimeRunning={isTimeRunning}
        setIsTimeRunning={setIsTimeRunning}
      />
      <BirdControls />
      <Credits />
    </div>
  )
}

export default Panel

import { format as formatDate } from 'date-fns'
import './TimeControl.css'

const TimeControl = ({ isTimeRunning, setIsTimeRunning, time, timeRange, setTime }) => {
  return (
    <div className="timeControl">
      <div className="time">{formatDate(new Date(time * 1000), 'dd MMMM')}</div>
      <div className="timePlayer">
        <button
          className={`playPauseButton ${isTimeRunning ? 'pause' : 'play'}`}
          aria-label={isTimeRunning ? 'Pause' : 'Play'}
          onClick={() => setIsTimeRunning(!isTimeRunning)}
        />
        <input
          className="timeScale"
          type="range"
          step={3600 * 24}
          min={timeRange[0]}
          max={timeRange[1]}
          value={time}
          onChange={e => setTime(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default TimeControl

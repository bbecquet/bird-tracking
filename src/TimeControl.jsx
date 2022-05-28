import { format as formatDate } from 'date-fns'
import './TimeControl.css'

const TimeControl = ({
  isTimeRunning,
  setIsTimeRunning,
  time,
  timeRange,
  setTime,
  sameYear,
  setSameYear,
  speed,
  setSpeed,
}) => {
  return (
    <div className="timeControl">
      <div className="time">
        {formatDate(new Date(time * 1000), sameYear ? 'dd MMMM' : 'dd MMM yyyy')}
      </div>
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
      <div className="u-flex">
        <label className="sameYear">
          <input type="checkbox" checked={sameYear} onChange={() => setSameYear(!sameYear)} />
          Merge observations in a single year
        </label>
        <div className="u-flex">
          <button onClick={() => setSpeed(speed >= 5 ? 1 : speed + 2)}>Speed</button>
          <div
            className="speedIndicator"
            style={{ '--level': Math.floor((speed * 100) / 5) + '%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default TimeControl

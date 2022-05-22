import { useEffect, useState, useRef } from 'react'
import { format as formatDate } from 'date-fns'
import { AUTO_PLAY, ANIMATION_SPEED, LOOP } from './config'
import './TimeControl.css'

const TimeControl = ({ time, timeRange, setTime }) => {
  const [isTimeRunning, setIsTimeRunning] = useState(!!AUTO_PLAY)
  const updateHandle = useRef(null)

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

  return (
    <div className="timeControl">
      <div className="time">{formatDate(new Date(time), 'dd MMMM')}</div>
      <div className="timePlayer">
        <button
          className={`playPauseButton ${isTimeRunning ? 'pause' : 'play'}`}
          aria-label={isTimeRunning ? 'Pause' : 'Play'}
          onClick={() => setIsTimeRunning(!isTimeRunning)}
        />
        <input
          className="timeScale"
          type="range"
          step={3600 * 24 * 1000}
          min={timeRange[0]}
          max={timeRange[1]}
          value={time}
          onChange={e => {
            setTime(Number(e.target.value))
          }}
        />
      </div>
    </div>
  )
}

export default TimeControl

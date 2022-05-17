import { useEffect, useState, useRef } from 'react'
import { format as formatDate } from 'date-fns'

const ANIMATION_SPEED = 3600 * 3 * 1000 // 1 "step", in seconds
const LOOP = 3600 * 24 * 365 * 1000

const TimeControl = ({ time, timeRange, setTime }) => {
  const [isTimeRunning, setIsTimeRunning] = useState(false)
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
    <div>
      {formatDate(new Date(time), 'dd MMMM')}
      <div className="timeControl">
        <button onClick={() => setIsTimeRunning(!isTimeRunning)}>
          {isTimeRunning ? '▮▮' : <span dangerouslySetInnerHTML={{ __html: '&#9654;' }} />}
        </button>
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

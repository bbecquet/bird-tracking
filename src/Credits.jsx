import { useEffect, useState } from 'react'
import './Credits.css'

const Credits = () => {
  const [creditsOpen, setCreditsOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('creditsOpen', creditsOpen)
  }, [creditsOpen])

  return (
    <div className="creditsWrapper">
      <div className="creditsHeader u-desktopHidden">
        <h1>Flying paths of some birds</h1>

        <button
          className="toggleCredits"
          type="button"
          onClick={() => setCreditsOpen(!creditsOpen)}
        >
          {creditsOpen ? 'Close' : '?'}
        </button>
      </div>
      <div className="credits">
        <h2 className="u-mobileHidden">Credits</h2>
        <p>
          Data source: <a href="https://gbif.org">GBIF.org</a>: BirdMap Data -{' '}
          <a href="https://www.gbif.org/dataset/712dba38-74cc-4704-87c0-63d1bf8484bc">
            GPS tracking of Storks, Cranes and birds of prey, breeding in Northern and Eastern
            Europe
          </a>{' '}
          (<a href="https://doi.org/10.15468/dl.fufxjs">09 May 2022</a>)
        </p>
        <p className="u-mobileHidden">
          Bird pictures: <a href="https://commons.wikimedia.org">WikiMedia Commons</a>
        </p>
        <p>
          Map background: &copy; <a href="https://carto.com/about-carto/">CARTO</a> &copy;{' '}
          <a href="http://www.openstreetmap.org/about/">OpenStreetMap</a> contributors
        </p>
        <p>
          Built with <a href="https://deck.gl/">deck.gl</a> and{' '}
          <a href="https://maplibre.org/projects/maplibre-gl-js/">MapLibre-GL</a>.{' '}
          <a href="https://github.com/bbecquet/bird-tracking">Source code</a>
        </p>
        <p>
          Author: <a href="https://bbecquet.net/">Benjamin Becquet</a>.
        </p>
      </div>
    </div>
  )
}

export default Credits

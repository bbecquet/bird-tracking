import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import Map from 'react-map-gl/maplibre'
import { ANIMATION_SPEED, speciesConfig } from './config'
import { TripsLayer } from '@deck.gl/geo-layers'
import { WebMercatorViewport } from '@deck.gl/core'

const INITIAL_VIEW = {
  longitude: 32.5,
  latitude: 4.5,
  zoom: 3,
  minZoom: 0,
  maxZoom: 20,
}

const MapView = ({ time, data, highlightedSpecies }) => {
  const [tripLayer, setTripLayer] = useState(undefined)
  const [initialViewState, setInitialViewState] = useState(null)
  const mapContainer = useRef(null)

  useLayoutEffect(() => {
    if (!initialViewState) {
      const mapDimensions = {
        width: mapContainer.current.clientWidth,
        height: mapContainer.current.clientHeight,
      }
      const { latitude, longitude, zoom } = new WebMercatorViewport(mapDimensions).fitBounds(
        [
          [-19, -37],
          [54, 65],
        ],
        // { padding: 0, offset: [-400, 0] }  // Bug in deck.gl? Doesn't work at all and crashes on many cases
      )
      setInitialViewState({ ...INITIAL_VIEW, latitude, longitude, zoom })
    }
  }, [initialViewState])

  useEffect(() => {
    setTripLayer(
      new TripsLayer({
        id: 'birds',
        data,
        currentTime: time,
        getTimestamps: d => d.properties.times,
        trailLength: ANIMATION_SPEED * 150,
        getColor: ({ properties }) => speciesConfig[properties.species].color,
        getPath: d => d.geometry.coordinates,
        getWidth: d => (d.properties.species === highlightedSpecies ? 8 : 2),
        jointRounded: true,
        capRounded: true,
        opacity: 0.75,
        widthUnits: 'pixels',
        shadowEnabled: false,
        parameters: { blend: true },
        updateTriggers: { getWidth: highlightedSpecies },
      }),
    )
  }, [data, time, highlightedSpecies])

  return (
    <div id="map" ref={mapContainer}>
      {initialViewState && (
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={tripLayer ? [tripLayer] : []}
        >
          <Map
            attributionControl={false}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
          />
        </DeckGL>
      )}
    </div>
  )
}

export default MapView

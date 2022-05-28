import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import Map from 'react-map-gl'
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from '!maplibre-gl'
import { ANIMATION_SPEED, speciesConfig } from './config'
import { TripsLayer } from '@deck.gl/geo-layers'
import GL from '@luma.gl/constants'
import { WebMercatorViewport } from '@deck.gl/core'
import { tsToDate } from './times'

import maplibreglWorker from 'maplibre-gl/dist/maplibre-gl-csp-worker'
maplibregl.workerClass = maplibreglWorker

const INITIAL_VIEW = {
  longitude: 32.5,
  latitude: 4.5,
  zoom: 3,
  minZoom: 0,
  maxZoom: 20,
}

const MapView = ({ time, minTime, sameYear, data, highlightedSpecies }) => {
  const [tripLayer, setTripLayer] = useState(undefined)
  const [initialViewState, setInitialViewState] = useState(null)
  const mapContainer = useRef(null)
  const minYear = new Date(minTime * 1000).getFullYear()

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
        ]
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
        getTimestamps: d => {
          if (!sameYear || !minYear) {
            return d.properties.times
          }
          // transform times so they are all considered in the same year
          const timeStampShift =
            (new Date(tsToDate(d.properties.times[0]).getFullYear(), 0, 1) -
              new Date(minYear, 0, 1)) /
            1000
          return d.properties.times.map(t => t - timeStampShift)
        },
        trailLength: ANIMATION_SPEED * 150,
        getColor: ({ properties }) => speciesConfig[properties.species].color,
        getPath: d => d.geometry.coordinates,
        getWidth: d => (d.properties.species === highlightedSpecies ? 8 : 2),
        jointRounded: true,
        capRounded: true,
        opacity: 0.75,
        widthUnits: 'pixels',
        shadowEnabled: false,
        parameters: {
          blend: true,
          blendFunc: [GL.SRC_ALPHA, GL.CONSTANT_ALPHA],
        },
        updateTriggers: {
          getWidth: highlightedSpecies,
          getTimestamps: sameYear,
        },
      })
    )
  }, [data, time, sameYear, minYear, highlightedSpecies])

  return (
    <div id="map" ref={mapContainer}>
      {initialViewState && (
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={tripLayer ? [tripLayer] : []}
        >
          <Map
            mapLib={maplibregl}
            attributionControl={false}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
          />
        </DeckGL>
      )}
    </div>
  )
}

export default MapView

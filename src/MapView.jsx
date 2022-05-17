import { useEffect, useState } from 'react'
import DeckGL from '@deck.gl/react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { speciesList, speciesConfig } from './birdSpecies'
import { TripsLayer } from '@deck.gl/geo-layers'
import GL from '@luma.gl/constants'

const INITIAL_VIEW = {
  longitude: 32.5,
  latitude: 4.5,
  zoom: 3,
  minZoom: 2,
  maxZoom: 20,
  pitch: 46,
  bearing: 22,
  // bounds: [
  //   [-19, -37],
  //   [54, 72],
  // ],
  // fitBoundsOptions: {
  //   padding: {
  //     right: 400,
  //   },
  // },
}

const ANIMATION_SPEED = 3600 * 3 * 1000 // 1 "step", in seconds

const MapView = ({ time, data, highlightedSpecies }) => {
  const [tripLayer, setTripLayer] = useState(undefined)

  useEffect(() => {
    setTripLayer(
      new TripsLayer({
        id: 'birds',
        data,
        currentTime: time,
        getTimestamps: d => d.properties.times,
        trailLength: ANIMATION_SPEED * 200,
        getColor: ({ properties }) => speciesConfig[properties.species].color,
        getPath: d => d.geometry.coordinates,
        getWidth: d => (d.properties.species === highlightedSpecies ? 10 : 3),
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
        },
      })
    )
  }, [data, time, highlightedSpecies])

  return (
    <div id="map">
      <DeckGL
        initialViewState={INITIAL_VIEW}
        controller={true}
        layers={tripLayer ? [tripLayer] : []}
      >
        <Map
          mapLib={maplibregl}
          attributionControl={false}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        />
      </DeckGL>
    </div>
  )
}

export default MapView

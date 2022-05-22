import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { ANIMATION_SPEED, speciesConfig } from './config'
import { BitmapLayer } from '@deck.gl/layers'
import { TripsLayer, TileLayer } from '@deck.gl/geo-layers'
import GL from '@luma.gl/constants'
import { WebMercatorViewport, _GlobeView as GlobeView } from '@deck.gl/core'

const INITIAL_VIEW = {
  longitude: 32.5,
  latitude: 4.5,
  zoom: 3,
  minZoom: 0,
  maxZoom: 20,
  // pitch: 45,
  // bearing: 15,
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
        ]
        // { padding: 0, offset: [-400, 0] }  // Bug in deck.gl? Doesn't work at all and crash on many cases
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
    <div id="map" ref={mapContainer}>
      {initialViewState && (
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={
            tripLayer
              ? [
                  // new TileLayer({
                  //   // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
                  //   data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

                  //   minZoom: 0,
                  //   maxZoom: 19,
                  //   tileSize: 256,

                  //   renderSubLayers: props => {
                  //     const {
                  //       bbox: { west, south, east, north },
                  //     } = props.tile

                  //     return new BitmapLayer(props, {
                  //       data: null,
                  //       image: props.data,
                  //       bounds: [west, south, east, north],
                  //     })
                  //   },
                  // }),
                  tripLayer,
                ]
              : []
          }
          // views={new GlobeView({ resolution: 10 })}
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

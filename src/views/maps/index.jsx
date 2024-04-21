import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// third imports
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

// mui imports
import { Box } from '@mui/material'

// project imports
import { GOOGLE_MAP_KEY } from '../../config'
import { apiCall } from '../../contexts/api'
import LoadingInfo from '../../ui-components/LoadingInfo'
import NoInfoOverlay from '../../ui-components/NoInfoOverlay'
import { DARK_MODE_STYLE_MAP } from '../../utils/constants'

import icon from '../../assets/image/greenMarkMap.png'

const BASE_URL_API = 'https://ws-tangraph.ever-track.com/api'

const MapVisualization = () => {
  const { h3, terminal } = useParams()

  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAP_KEY })

  const [center, setCenter] = useState({
    lat: 25.2970145,
    lng: -103.053388
  })
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        if (h3 && terminal) {
          setLoading(true)
          const res = await apiCall({ url: `${BASE_URL_API}/LocationH3?h3=${h3}&terminal=${terminal}` })
          if (typeof res === 'object') {
            console.log(res)
            setCenter({
              lat: res.latitudeDegrees,
              lng: res.longitudeDegrees
            })
          } else {
            setHasError(true)
          }

          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    })()

    return () => {
      setLoading(true)
      setHasError(false)
    }
  }, [h3, terminal])

  if (!isLoaded || loading) {
    return (
      <Box
        flex={1} minWidth='100vw' minHeight='100vh' maxHeight='100vh'
        maxWidth='100vw' width='100%' height='100%' display='flex' justifyContent={center} alignItems='center'
      ><LoadingInfo />
      </Box>
    )
  }
  return (
    <Box
      flex={1} minWidth='100vw' minHeight='100vh' maxHeight='100vh'
      maxWidth='100vw' width='100%' height='100%' display='flex' justifyContent={center} alignItems='center'
    >
      {hasError
        ? <NoInfoOverlay />
        : (
          <GoogleMap
            mapContainerStyle={{ minWidth: '100vw', maxWidth: '100vw', minHeight: '100vh', maxHeight: '100vh', height: '100%', width: '100%' }}
            center={{ lat: center.lat, lng: center.lng }}
            zoom={5}
            options={{
              streetViewControl: false,
              gestureHandling: 'greedy',
              fullscreenControl: false,
              panControl: true,
              scaleControl: false,
              mapTypeControl: true,
              styles: DARK_MODE_STYLE_MAP
            }}
          >
            {!loading && isLoaded && <Marker
              position={{ lat: center.lat, lng: center.lng }} icon={{ url: icon, scaledSize: new window.google.maps.Size(90, 45) }} animation={window.google.maps.Animation.DROP}
              label={{
                text: terminal,
                color: 'white',
                className: 'label-map'
              }}
                                     />}
          </GoogleMap>
          )}
    </Box>
  )
}

export default MapVisualization

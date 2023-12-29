import { Input } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'

import { Map, APILoader, Provider, Marker } from '@uiw/react-baidu-map'
import { useCallback, useEffect, useMemo, useState } from 'react'
import pointImg from './point.png'
import { useTranslate } from '@refinedev/core'

const PI = Math.PI
const x_pi = (PI * 3000.0) / 180.0

//GCJ-02 to BD-09
export const bdEncrypt = (gcjLat: number, gcjLng: number) => {
  const x = gcjLng,
    y = gcjLat
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  const bdLon = z * Math.cos(theta) + 0.0065
  const bdLat = z * Math.sin(theta) + 0.006
  return { lat: bdLat, lng: bdLon }
}

//BD-09 to GCJ-02
export const bdDecrypt = (bdLat: number, gcjLng: number) => {
  const x = gcjLng - 0.0065,
    y = bdLat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  const gcjLon = z * Math.cos(theta)
  const gcjLat = z * Math.sin(theta)
  return { lat: gcjLat, lng: gcjLon }
}

export interface MapSelectData {
  province: string
  city: string
  district: string
  address: string
  lat: number
  lng: number
}

export type MapSelectValue = Record<string, any>

export interface MapSelectProps {
  onChange?: (value?: MapSelectValue) => void
  onSelect?: (data?: MapSelectData) => void
  value?: MapSelectValue
  defaultValue?: MapSelectValue
}

export const MapSelect = ({ value, defaultValue, onChange, onSelect }: MapSelectProps) => {
  return (
    <div className='relative h-150 w-full'>
      <APILoader akay='eYpCTECSntZmw0WyoQ7zFpCRR9cpgHFG'>
        <Provider>
          <MapMarker
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onSelect={onSelect}
          />
        </Provider>
      </APILoader>
    </div>
  )
}

const MapMarker = ({ onSelect, ...props }: MapSelectProps) => {
  const [data, setData] = useControllableValue<MapSelectValue | undefined>(props)
  const [address, setAddress] = useState('')

  const icon = new BMap.Icon(pointImg, new BMap.Size(32, 32))
  const geoc = new BMap.Geocoder()
  const localcity = new BMap.LocalCity()

  const translate = useTranslate()

  const setGeo = useCallback(
    (point: BMap.Point) => {
      const gcjData = bdDecrypt(point.lat, point.lng)
      setData({
        lat: gcjData.lat,
        lng: gcjData.lng,
      })
      geoc.getLocation(point, (re) => {
        setAddress(re?.address)
        onSelect?.({
          province: re?.addressComponents.province,
          city: re?.addressComponents.city,
          district: re?.addressComponents.province,
          address: re?.addressComponents.street + re?.addressComponents.streetNumber,
          lat: gcjData.lat,
          lng: gcjData.lng,
        })
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSelect, geoc]
  )

  useEffect(() => {
    if (data) {
      return
    }
    localcity.get((e) => {
      geoc.getLocation(e.center, (re) => {
        setAddress(re.address)
      })
      setGeo({
        lat: e.center.lat,
        lng: e.center.lng,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const search = useCallback((keyword: string) => {
    geoc.getPoint(
      keyword,
      (point) => {
        setGeo({
          lat: point.lat,
          lng: point.lng,
        })
      },
      ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bdData = useMemo<Record<string, number>>(() => {
    if (!data) {
      return {}
    }
    return bdEncrypt(Number(data.lat), Number(data.lng))
  }, [data])

  return (
    <>
      <Map
        widget={['NavigationControl']}
        center={{
          lat: bdData?.lat,
          lng: bdData?.lng,
        }}
        zoom={13}
        onClick={(event) => {
          setGeo(event.point)
        }}
        enableScrollWheelZoom
        enableMapClick={false}
        defaultCursor='default'
      >
        {data && <Marker position={{ lat: bdData?.lat, lng: bdData?.lng }} icon={icon} />}
      </Map>
      <div className='pointer-events-none absolute top-5 w-full flex justify-center'>
        <div className='pointer-events-auto w-60 rounded p-2 shadow bg-container'>
          <Input
            suffixIcon={<div className='i-tabler:search'></div>}
            placeholder={translate('common.search')}
            align='center'
            onChange={(v) => {
              search(v)
            }}
          />
        </div>
      </div>

      <div className='pointer-events-none absolute bottom-5 w-full flex justify-center'>
        {address && (
          <div className='pointer-events-auto rounded px-4 py-2 shadow bg-container'>{address}</div>
        )}
      </div>

      <div className='absolute bottom-5 right-5 rounded text-gray-900'>
        {data ? `${data.lat},${data.lng}` : ''}
      </div>
    </>
  )
}

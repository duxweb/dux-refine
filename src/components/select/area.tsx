import { useCallback, useEffect, useState } from 'react'
import { useControllableValue } from 'ahooks'
import { Select, SelectValue } from 'tdesign-react/esm'
import { useClient } from '../../provider/dataProvider'
import clsx from 'clsx'

export interface AreaSelectProps {
  url: string
  range?: number
  onChange?: (value?: string[]) => void
  value?: string[]
  defaultValue?: string[]
  className?: string
  block?: boolean
}

export const AreaSelect = ({ url, range = 3, className, block, ...props }: AreaSelectProps) => {
  const { request } = useClient()
  const [data, setData] = useControllableValue<string[]>(props)
  const [loading, setLoading] = useState(false)

  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [streetList, setStreetList] = useState([])

  const getList = useCallback((query: Record<string, any>) => {
    setLoading(true)
    return request(url, 'get', {
      params: query,
    })
      .then((res) => {
        return res?.data || []
      })
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProvinceList = useCallback(() => {
    getList({ level: 0 }).then((data) => {
      setProvinceList(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCityList = useCallback((name?: string) => {
    if (!name) {
      setCityList([])
      return
    }
    getList({ level: 1, parent: name }).then((data) => {
      setCityList(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDistrictList = useCallback((name?: string) => {
    if (!name) {
      setDistrictList([])
      return
    }
    getList({ level: 2, parent: name }).then((data) => {
      setDistrictList(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStreetList = useCallback((name?: string) => {
    if (!name) {
      setStreetList([])
      return
    }
    getList({ level: 3, parent: name }).then((data) => {
      setStreetList(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const provinceChange = useCallback((value: SelectValue) => {
    if (range > 0) {
      getCityList(value as string)
      getDistrictList()
      getStreetList()
    }
    setData([value as string])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cityChange = useCallback((value: SelectValue) => {
    if (range > 1) {
      getDistrictList(value as string)
      getStreetList()
    }
    setData((v) => {
      return [v[0], value as string]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const districtChange = useCallback((value: SelectValue) => {
    if (range > 2) {
      getStreetList(value as string)
    }
    setData((v) => {
      return [v[0], v[1], value as string]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const streetChange = useCallback((value: SelectValue) => {
    setData((v) => {
      return [v[0], v[1], v[2], value as string]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getProvinceList()
    if (data?.[0]) {
      provinceChange(data[0])
    }
    if (data?.[1]) {
      cityChange(data[1])
    }
    if (data?.[2]) {
      districtChange(data[2])
    }
    if (data?.[3]) {
      streetChange(data[3])
    }
  }, [])

  return (
    <div className={clsx(['w-full gap-4 ', !block ? 'flex flex-col flex-wrap lg:flex-row' : 'grid lg:grid-cols-2 grid-cols-1', className || ''])}>
      <div>
        <Select
          clearable
          loading={loading}
          options={provinceList}
          onChange={provinceChange}
          value={data?.[0]}
        />
      </div>
      {range >= 1 && (
        <div>
          <Select
            clearable
            loading={loading}
            options={cityList}
            onChange={cityChange}
            value={data?.[1]}
          />
        </div>
      )}
      {range >= 2 && (
        <div>
          <Select
            clearable
            loading={loading}
            options={districtList}
            onChange={districtChange}
            value={data?.[2]}
          />
        </div>
      )}
      {range >= 3 && (
        <div>
          <Select
            clearable
            loading={loading}
            options={streetList}
            onChange={streetChange}
            value={data?.[3]}
          />
        </div>
      )}
    </div>
  )
}

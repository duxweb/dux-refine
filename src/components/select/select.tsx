import { Select, SelectProps } from 'tdesign-react/esm'
import { useMemo, useState } from 'react'
import { useClient } from '../../provider'
import { useDeepCompareEffect } from 'ahooks'

export interface SelectAsyncProps extends SelectProps {
  url: string
  query?: Record<string, any>
}

export const SelectAsync = ({ url, query, value, ...props }: SelectAsyncProps) => {
  const [hasExecuted, setHasExecuted] = useState(false)
  const [keyword, setKeyword] = useState<string>()
  const [options, setOptions] = useState([])
  const [select, setSelect] = useState([])

  const { request, isLoading } = useClient()
  useDeepCompareEffect(() => {
    if (!hasExecuted || value != undefined) {
      setHasExecuted(true)
      request(url, 'get', {
        params: {
          ...query,
          ids: Array.isArray(value) ? value.join(',') : value,
        },
      }).then((res) => {
        setSelect(res?.data || [])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, query, value])

  useDeepCompareEffect(() => {
    request(url, 'get', {
      params: {
        ...query,
        keyword,
      },
    }).then((res) => {
      setOptions(res?.data || [])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, url, keyword])

  const getOptions = useMemo(() => {
    const mergedArray = [...options, ...select]
    return Array.from(new Set(mergedArray))
  }, [options, select])

  return (
    <Select
      options={getOptions}
      onSearch={(k) => setKeyword(k)}
      value={value}
      loading={isLoading}
      {...props}
    />
  )
}

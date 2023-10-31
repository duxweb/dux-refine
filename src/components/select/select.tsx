import { Select, SelectProps } from 'tdesign-react/esm'
import { useEffect, useMemo, useState } from 'react'
import { useClient } from '../../provider'

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
  useEffect(() => {
    if (!hasExecuted || value != undefined) {
      setHasExecuted(true)
      request(url, 'get', {
        params: {
          ids: Array.isArray(value) ? value.join(',') : value,
        },
      }).then((res) => {
        setSelect(res?.data || [])
      })
    }
  }, [hasExecuted, request, url, value])

  useEffect(() => {
    request(url, 'get', {
      params: {
        ...query,
        keyword,
      },
    }).then((res) => {
      setOptions(res?.data || [])
    })
  }, [query, request, url, keyword])

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

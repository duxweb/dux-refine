import { CascaderProps, Cascader } from 'tdesign-react/esm'
import { useState } from 'react'
import { useClient } from '../../provider'
import { useDeepCompareEffect } from 'ahooks'

export interface CascaderAsyncProps extends CascaderProps {
  url: string
  query?: Record<string, any>
  format?: (value: any) => any
}

export const CascaderAsync = ({
  url,
  query,
  defaultValue,
  value,
  format,
  ...props
}: CascaderAsyncProps) => {
  const [options, setOptions] = useState([])

  const { request, isLoading } = useClient()
  useDeepCompareEffect(() => {
    request(url, 'get', {
      params: {
        ...query,
      },
    }).then((res) => {
      setOptions(res?.data || [])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, url])

  return (
    <Cascader
      options={options}
      defaultValue={format?.(defaultValue) || defaultValue}
      value={format?.(value) || value}
      loading={isLoading}
      {...props}
    />
  )
}

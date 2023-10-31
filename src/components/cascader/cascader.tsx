import { CascaderProps, Cascader } from 'tdesign-react/esm'
import { useEffect, useState } from 'react'
import { useClient } from '../../provider'

export interface CascaderAsyncProps extends CascaderProps {
  url: string
  query?: Record<string, any>
}

export const CascaderAsync = ({
  url,
  query,
  defaultValue,
  value,
  ...props
}: CascaderAsyncProps) => {
  const [options, setOptions] = useState([])

  const { request, isLoading } = useClient()
  useEffect(() => {
    request(url, 'get', {
      params: {
        ...query,
      },
    }).then((res) => {
      setOptions(res?.data || [])
    })
  }, [query, request, url])

  return (
    <Cascader
      options={options}
      defaultValue={defaultValue}
      value={value}
      loading={isLoading}
      {...props}
    />
  )
}

import { CascaderProps, Cascader } from 'tdesign-react/esm'
import { useList } from '@refinedev/core'

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
  const { data, isLoading } = useList({
    resource: url,
    meta: {
      params: query,
    },
    pagination: {
      mode: 'off',
    },
  })

  return (
    <Cascader
      options={data?.data || []}
      defaultValue={format?.(defaultValue) || defaultValue}
      value={format?.(value) || value}
      loading={isLoading}
      {...props}
    />
  )
}

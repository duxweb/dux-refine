import { PaginationMini, Select, SelectProps } from 'tdesign-react/esm'
import { ReactNode, useMemo, useState } from 'react'
import { useSelect } from './useSelect'
import { BaseKey, BaseOption } from '@refinedev/core'

export interface SelectAsyncProps extends SelectProps {
  url: string
  query?: Record<string, any>
  pagination?: boolean
  optionValue?: string
  optionLabel?: string
  optionRender?: (item: Record<string, any>) => ReactNode
  format?: (value: any) => any
}

export const SelectAsync = ({
  url,
  query,
  pagination,
  optionValue = 'id',
  optionLabel = 'title',
  optionRender,
  format,
  ...props
}: SelectAsyncProps) => {
  const [page, setPage] = useState(1)

  const { options, queryResult, onSearch } = useSelect<Record<string, any>>({
    resource: url,
    optionLabel: optionLabel,
    optionValue: optionValue,
    defaultValue: (props.value || props.defaultValue) as BaseKey | BaseKey[],
    meta: {
      params: query,
    },
    pagination: {
      mode: pagination ? 'server' : 'off',
      current: page,
      pageSize: 20,
    },
  })

  const pages = useMemo(() => {
    return Math.ceil(queryResult?.data?.meta?.total / 20)
  }, [queryResult])

  const getOptions = useMemo(() => {
    return Array.from(new Set(options)).map((item: BaseOption) => {
      return {
        content: optionRender?.(item),
        label: item?.label,
        value: item?.value,
        row: item,
      }
    })
  }, [optionRender, options])

  return (
    <Select
      options={getOptions}
      onSearch={onSearch}
      loading={queryResult.isLoading}
      defaultValue={format?.(props.defaultValue) || props.defaultValue}
      value={format?.(props.value) || props.value}
      panelBottomContent={
        pagination ? (
          <div className='flex justify-center pb-2'>
            <PaginationMini
              size='small'
              onChange={({ trigger }) => {
                if (trigger == 'next') {
                  if (page < pages) {
                    setPage((e) => e + 1)
                  }
                }
                if (trigger == 'prev') {
                  if (page > 1) {
                    setPage((e) => e - 1)
                  }
                }
                if (trigger == 'current') {
                  setPage((e) => e)
                }
              }}
            />
          </div>
        ) : undefined
      }
      {...props}
    />
  )
}

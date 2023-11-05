import { PaginationMini, Select, SelectProps } from 'tdesign-react/esm'
import { ReactNode, useMemo, useState } from 'react'
import { useClient } from '../../provider'
import { useDeepCompareEffect } from 'ahooks'

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
  value,
  defaultValue,
  pagination,
  optionValue,
  optionLabel,
  optionRender,
  format,
  ...props
}: SelectAsyncProps) => {
  const [hasExecuted, setHasExecuted] = useState(false)
  const [keyword, setKeyword] = useState<string>()
  const [options, setOptions] = useState([])
  const [select, setSelect] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

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
        limit: 20,
        page,
      },
    }).then((res) => {
      setOptions(res?.data || [])
      if (pagination) {
        setPage(res?.meta?.page || 1)
        const totalPages = Math.ceil(res?.meta?.total / 20)
        setPages(totalPages)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, url, keyword, page])

  const getOptions = useMemo(() => {
    const mergedArray = [...options, ...select]
    return Array.from(new Set(mergedArray)).map((item) => {
      return {
        content: optionRender?.(item),
        label: item[optionLabel || 'label'],
        value: item[optionValue || 'value'],
        row: item,
      }
    })
  }, [optionLabel, optionRender, optionValue, options, select])

  return (
    <Select
      options={getOptions}
      onSearch={(k) => setKeyword(k)}
      defaultValue={format?.(defaultValue) || defaultValue}
      value={format?.(value) || value}
      loading={isLoading}
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

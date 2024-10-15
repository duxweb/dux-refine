import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
  Form,
  Card,
  PrimaryTableCol,
  Radio,
  Pagination,
  FormInstanceFunctions,
  Button,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, TableTab, useTable, useTableProps, useTableReturnType } from './useTable'
import { Main } from '../main'
import { useResource, BaseRecord, HttpError, useTranslate } from '@refinedev/core'
import { appHook } from '../../utils/hook'
import { useModuleContext } from '../../core'
import { StatusEmpty } from '../status/empty'
import { PageTableRenderProps } from './page'

export interface PageListProps {
  title?: React.ReactNode
  tabs?: Array<TableTab>
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  headerRender?: (params: PageTableRenderProps) => React.ReactElement
  footerRender?: (params: PageTableRenderProps) => React.ReactElement
  actionRender?: (params: PageTableRenderProps) => React.ReactElement
  filterRender?: (params: PageTableRenderProps) => React.ReactElement
  filterAdvRender?: (params: PageTableRenderProps) => React.ReactElement
  batchRender?: (params: PageTableRenderProps) => React.ReactElement
  children?: (data: useTableReturnType<BaseRecord>) => React.ReactNode
  filterForm?: FormInstanceFunctions
}

export const PageList = forwardRef(
  (
    {
      title,
      tabs,
      columns,
      headerRender,
      footerRender,
      filterRender,
      filterAdvRender,
      actionRender,
      batchRender,
      tableHook,
      children,
      filterForm,
    }: PageListProps,
    ref: React.ForwardedRef<TableRef>,
  ) => {
    const tableResult = useTable({
      pagination: {
        current: 0,
        pageSize: 10,
      },
      columns: columns,
      ...tableHook,
    })

    const { data, pagination, selecteds, selectOptions, filters, setFilters, refetch } = tableResult

    const [size, sizeMap] = useWindowSize()
    const [form] = Form.useForm(filterForm)
    const [advFilter, setAdvFilter] = useState(false)
    const translate = useTranslate()

    useImperativeHandle(ref, () => {
      return {
        refetch: refetch,
        selecteds,
        selectOptions,
        filters,
        setFilters,
        form,
      }
    })
    const { resource } = useResource()
    const { name: moduleName } = useModuleContext()

    const renderParams: PageTableRenderProps = {
      filters,
      selecteds,
      selectOptions,
    }

    return (
      <Main
        title={title}
        header={
          tabs && (
            <Radio.Group
              variant='default-filled'
              value={filters?.tab == undefined ? tabs?.[0]?.value : filters?.tab}
              onChange={(value) => {
                setFilters({
                  tab: value,
                })
              }}
            >
              {tabs.map((item, key) => (
                <Radio.Button key={key} value={item.value}>
                  {item.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          )
        }
        actions={
          <>
            <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'action']} />
            {actionRender?.(renderParams)}
          </>
        }
      >
        {headerRender?.(renderParams)}

        <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'header']} />

        {size <= sizeMap.md && (
          <div className='md:hidden flex flex-col gap-2 mb-2 app-mobile-header'>
            {tabs && (
              <Radio.Group
                variant='default-filled'
                value={filters?.tab == undefined ? tabs?.[0]?.value : filters?.tab}
                onChange={(value) => {
                  setFilters({
                    tab: value,
                  })
                }}
              >
                {tabs.map((item, key) => (
                  <Radio.Button key={key} value={item.value}>
                    {item.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )}
            <div>{actionRender?.(renderParams)}</div>
          </div>
        )}

        {(filterRender || (selecteds && selecteds.length > 0)) && (
          <div className='flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center'>
            <Form
              initialData={filters}
              labelWidth={0}
              labelAlign='right'
              className='flex flex-col gap-2'
              onValuesChange={setFilters}
              form={form}
            >
              <div className='app-filter'>
                {filterRender?.(renderParams)}
                <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'filter']} />
                <Form.FormItem>
                  <div className='flex-1 flex gap-2 flex-wrap'>
                    <Button type='submit' icon={<div className='t-icon i-tabler:search'></div>}>
                      {translate('buttons.query')}
                    </Button>
                    {filterAdvRender && (
                      <Button
                        theme='primary'
                        variant='text'
                        suffix={<div className='t-icon i-tabler:chevrons-down'></div>}
                        onClick={() => {
                          setAdvFilter((v) => !v)
                        }}
                      >
                        {translate('buttons.adv')}
                      </Button>
                    )}
                  </div>
                </Form.FormItem>
              </div>
              {advFilter && filterAdvRender && (
                <div className='app-filter'>
                  {filterAdvRender?.(renderParams)}

                  <appHook.Render
                    mark={[moduleName, resource?.name as string, 'list', 'filterAdv']}
                  />
                </div>
              )}
            </Form>
            {selecteds && selecteds.length > 0 && (
              <div>
                {batchRender?.(renderParams)}{' '}
                <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'batch']} />
              </div>
            )}
          </div>
        )}

        {data && data.length > 0 ? (
          children?.(tableResult)
        ) : (
          <Card>
            <StatusEmpty />
          </Card>
        )}

        <Pagination
          {...pagination}
          className='app-pagination'
          theme={pagination?.theme || size <= sizeMap.xl ? 'simple' : 'default'}
          showJumper={pagination?.showJumper !== undefined || size <= sizeMap.xl ? false : true}
          showPageSize={pagination?.showPageSize !== undefined || size <= sizeMap.xl ? false : true}
        />

        {footerRender?.(renderParams)}
        <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'footer']} />
      </Main>
    )
  },
)

PageList.displayName = 'PageList'

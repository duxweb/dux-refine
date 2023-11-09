import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Card, PrimaryTableCol, Radio, Pagination } from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, TableTab, useTable, useTableProps, useTableReturnType } from './table'
import { Main } from '../main'
import { useResource, BaseRecord, HttpError } from '@refinedev/core'
import { appHook } from '../../utils/hook'
import { useModuleContext } from '../../core'
import { StatusEmpty } from '../status/empty'

export interface PageListProps {
  title?: React.ReactNode
  tabs?: Array<TableTab>
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  headerRender?: () => React.ReactElement
  footerRender?: () => React.ReactElement
  actionRender?: () => React.ReactElement
  filterRender?: () => React.ReactElement
  batchRender?: () => React.ReactElement
  children?: (data: useTableReturnType<BaseRecord>) => React.ReactNode
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
      actionRender,
      batchRender,
      tableHook,
      children,
    }: PageListProps,
    ref: React.ForwardedRef<TableRef>
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
    const [form] = Form.useForm()

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

    return (
      <Main
        title={title}
        icon={resource?.meta?.icon}
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
            {actionRender?.()}
          </>
        }
      >
        {headerRender?.()}

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
            <div>{actionRender?.()}</div>
          </div>
        )}

        {(filterRender || (selecteds && selecteds.length > 0)) && (
          <div className='flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center'>
            <Form
              initialData={filters}
              labelWidth={0}
              className='app-filter flex-wrap'
              onValuesChange={setFilters}
              form={form}
            >
              {filterRender?.()}
              <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'filter']} />
            </Form>
            {selecteds && selecteds.length > 0 && (
              <div>
                {batchRender?.()}{' '}
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

        {footerRender?.()}
        <appHook.Render mark={[moduleName, resource?.name as string, 'list', 'footer']} />
      </Main>
    )
  }
)

PageList.displayName = 'PageList'

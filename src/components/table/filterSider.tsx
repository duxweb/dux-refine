import React, { ComponentType, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslate, useList, useDeleteMany } from '@refinedev/core'
import { Button, Menu, Dropdown, MenuValue, DialogPlugin } from 'tdesign-react/esm'
import { CardSider } from '../card/cardSider'
import { ButtonModal } from '../action'
import { EmptyWidget } from '../status/emptyWidget'
import { Modal } from '../modal'
import { pageTableContext } from './page'

interface FilterSiderProps {
  title: string
  field: string
  resource: string
  component: () => Promise<{
    default: ComponentType<any>
  }>
  optionLabel?: any
  optionValue?: any
  defaultSelect?: boolean
}

export const FilterSider = ({
  field,
  title,
  resource,
  component,
  optionLabel,
  optionValue,
  defaultSelect,
}: FilterSiderProps) => {
  const translate = useTranslate()
  const [init, setInit] = useState(false)
  const tableContext = useContext(pageTableContext)
  const { mutate } = useDeleteMany()
  const [value, setValue] = useState<MenuValue>(tableContext.filters[field])
  const { data } = useList({
    resource: resource,
  })

  const onChange = useCallback(
    (value: MenuValue) => {
      setValue(value)
      tableContext.setFilters({
        [field]: value,
      })
    },
    [field, tableContext],
  )

  useEffect(() => {
    if (!defaultSelect || !data?.data?.length || !tableContext || init) {
      return
    }
    setInit(() => true)
    const defaultValue = data?.data[0]['optionValue']
    onChange(defaultValue)
  }, [defaultSelect, field, init, data?.data, tableContext, onChange])

  return (
    <CardSider
      title={title}
      tools={
        <>
          <ButtonModal
            resource={resource}
            action='create'
            variant='text'
            shape='circle'
            theme='default'
            title={translate('buttons.create')}
            icon={<div className='i-tabler:plus' />}
            component={component}
          >
            <></>
          </ButtonModal>
          <Button
            variant='text'
            shape='circle'
            theme='default'
            icon={<div className='i-tabler:refresh' />}
            onClick={() => {
              setValue('0')
              tableContext.setFilters({
                [field]: undefined,
              })
            }}
          />
          {value && value != '0' && (
            <Dropdown direction='right' hideAfterItemClick placement='bottom-left' trigger='hover'>
              <Button
                variant='text'
                shape='circle'
                theme='default'
                icon={<div className='i-tabler:dots-vertical' />}
              />
              <Dropdown.DropdownMenu>
                <Dropdown.DropdownItem
                  value={1}
                  prefixIcon={<div className='i-tabler:edit'></div>}
                  onClick={() => {
                    Modal.open({
                      title: translate('buttons.edit'),
                      component: component,
                      componentProps: {
                        id: value,
                      },
                    })
                  }}
                >
                  {translate('buttons.edit')}
                </Dropdown.DropdownItem>
                <Dropdown.DropdownItem
                  value={2}
                  prefixIcon={<div className='i-tabler:x'></div>}
                  onClick={() => {
                    const confirmDia = DialogPlugin.confirm({
                      className: 'app-modal',
                      header: translate('buttons.delete'),
                      width: 350,
                      body: <div className='p-4'>{translate('buttons.confirm')}</div>,
                      onClose: () => {
                        confirmDia.hide()
                      },
                      onConfirm: () => {
                        mutate({
                          resource: resource,
                          ids: [value],
                        })
                        confirmDia.hide()
                      },
                    })
                  }}
                >
                  {translate('buttons.delete')}
                </Dropdown.DropdownItem>
              </Dropdown.DropdownMenu>
            </Dropdown>
          )}
        </>
      }
    >
      {data?.data && data?.data.length > 0 ? (
        <Menu
          expandType='normal'
          theme='light'
          width={'100%'}
          className='app-sider-menu bg-transparent'
          value={value}
          onChange={(v) => {
            onChange(v)
          }}
        >
          <SideTreeChilren data={data?.data} optionLabel={optionLabel} optionValue={optionValue} />
        </Menu>
      ) : (
        <div className='text-sm mt-4'>
          <EmptyWidget type='simple' />
        </div>
      )}
    </CardSider>
  )
}

interface SideTreeChilrenProps {
  data?: Record<string, any>[]
  optionLabel?: string
  optionValue?: string
  optionChildren?: string
}

const SideTreeChilren = ({
  data,
  optionLabel = 'label',
  optionValue = 'value',
  optionChildren = 'children',
}: SideTreeChilrenProps) => {
  return data?.map((item, k) => {
    if (item['optionChildren'] && item['optionChildren'].length > 0) {
      return (
        <Menu.SubMenu key={k} title={item[optionLabel]} value={String(item[optionValue])}>
          {SideTreeChilren({
            data: item[optionChildren] as Record<string, any>[],
          })}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.MenuItem key={k} value={String(item[optionValue])}>
          {item[optionLabel]}
        </Menu.MenuItem>
      )
    }
  })
}

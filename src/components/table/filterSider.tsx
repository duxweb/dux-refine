import React, { ComponentType, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslate, useList, useDeleteMany } from '@refinedev/core'
import { Button, Dropdown, DialogPlugin, Tree, TreeNodeValue } from 'tdesign-react/esm'
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
  optionLabel?: string
  optionValue?: string
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
  const [value, setValue] = useState<TreeNodeValue[]>([tableContext.filters[field]])
  const { data } = useList({
    resource: resource,
  })

  const onChange = useCallback(
    (value: TreeNodeValue[]) => {
      setValue(value)
      tableContext.setFilters({
        [field]: value[0],
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
              setValue([])
              tableContext.setFilters({
                [field]: undefined,
              })
            }}
          />
          {value && (
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
                          ids: [value[0]],
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
      <Tree
        data={data?.data}
        activable
        line
        expandAll={true}
        actived={value}
        icon={true}
        keys={{
          label: optionLabel,
          value: optionValue,
        }}
        onActive={onChange}
        empty={
          <div className='text-sm mt-4'>
            <EmptyWidget type='simple' />
          </div>
        }
      />
    </CardSider>
  )
}

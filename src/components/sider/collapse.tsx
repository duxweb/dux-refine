import { useMemo, useState } from 'react'
import { Menu, Button, Tag, SelectInput } from 'tdesign-react/esm'
import { useTranslate, useGo, useResource } from '@refinedev/core'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
const { MenuGroup, MenuItem, SubMenu } = Menu
import { ViewListIcon, SearchIcon } from 'tdesign-icons-react'
import { DuxLogo } from '../logo'
import { useMenu } from './util'
import clsx from 'clsx'
import './style.css'
import { useModuleContext } from '../../core'
import { useCanHelper } from '../../provider'

const Search = () => {
  const translate = useTranslate()
  const { resources } = useResource()

  const { name } = useModuleContext()
  const { check } = useCanHelper(name)

  const data = useMemo(() => {
    return resources
      .filter((item) => {
        if (!item.list || !check({ resource: item.name, action: 'list' })) {
          return false
        }
        return true
      })
      .map((item) => {
        return {
          label: translate(`${item.meta?.label}.name`),
          route: item.list as string,
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, translate])

  const go = useGo()
  const [popupVisible, setPopupVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState(data)

  const onInputChange = (value: string) => {
    setInputValue(value)
    if (value) {
      setOptions(
        data.filter((item) => {
          return item.label.includes(value)
        })
      )
    } else {
      setOptions(data)
    }
  }
  return (
    <SelectInput
      placeholder={translate('common.search')}
      allowInput
      clearable
      inputValue={inputValue}
      onInputChange={onInputChange}
      suffixIcon={<SearchIcon />}
      popupVisible={popupVisible}
      onPopupVisibleChange={setPopupVisible}
      panel={
        <ul className='flex flex-col gap-2 py-1'>
          {options.length > 0 ? (
            options.map((item, index) => (
              <li
                key={index}
                className='px-4 py-1 text-primary hover:bg-brand hover:text-white-1 rounded cursor-pointer'
                onClick={() => {
                  setPopupVisible(false)
                  go({
                    to: item.route,
                  })
                }}
              >
                {item.label}
              </li>
            ))
          ) : (
            <li className='p-4 py-1'>{translate('common.notMenu')}</li>
          )}
        </ul>
      }
    />
  )
}

export const SiderCollapse = () => {
  const go = useGo()
  const translate = useTranslate()
  const { defaultOpenKeys, menuData } = useMenu()
  const [collapse, setCollapse] = useState<boolean>(false)
  const [value, setValue] = useState<string>(defaultOpenKeys?.[0])
  return (
    <Menu
      className='app-sider-collapse hidden md:block'
      width='210px'
      value={value}
      onChange={(value) => setValue(value as string)}
      collapsed={collapse}
      logo={
        <>
          {collapse ? (
            <div className='w-full flex items-center justify-center'>
              <DuxLogo className='h-3' />
            </div>
          ) : (
            <div className='px-6 flex items-center gap-1'>
              <DuxLogo className='h-5' />
            </div>
          )}
        </>
      }
      operations={
        <Button
          variant='text'
          shape='square'
          icon={<ViewListIcon />}
          onClick={() => setCollapse(!collapse)}
        />
      }
    >
      {!collapse && (
        <div className='mb-2'>
          <Search />
        </div>
      )}
      {menuData.map((app: TreeMenuItem) => {
        return app?.children?.length == 0 ? (
          <MenuItem
            key={app.key}
            value={app.key}
            icon={<div className={clsx(['t-icon', app.icon])}></div>}
            onClick={() => {
              go({
                to: app.route,
              })
            }}
          >
            {translate(`${app.label}.name`) || app?.label}
          </MenuItem>
        ) : (
          <MenuGroup key={app.key} title={translate(`${app.label}.name`) || app?.label}>
            {app?.children?.length > 0 &&
              app?.children?.map((parent: TreeMenuItem) => {
                return parent?.children?.length > 0 ? (
                  <SubMenu
                    key={parent.key}
                    title={translate(`${parent.label}.name`) || parent?.label}
                    value={parent.key}
                    icon={
                      parent.icon ? (
                        <div className={clsx(['t-icon', parent.icon])}></div>
                      ) : undefined
                    }
                  >
                    {parent?.children?.map((sub: TreeMenuItem) => (
                      <MenuItem
                        key={sub.name}
                        value={sub.key}
                        icon={
                          sub.icon ? <div className={clsx(['t-icon', sub.icon])}></div> : undefined
                        }
                        onClick={() => {
                          go({
                            to: sub.route,
                          })
                        }}
                      >
                        {translate(`${sub.label}.name`) || sub?.label}
                      </MenuItem>
                    ))}
                  </SubMenu>
                ) : (
                  <MenuItem
                    key={parent.key}
                    value={parent.key}
                    icon={
                      parent.icon ? (
                        <div className={clsx(['t-icon', parent.icon])}></div>
                      ) : undefined
                    }
                    onClick={() => {
                      go({
                        to: parent.route,
                      })
                    }}
                  >
                    {translate(`${parent.label}.name`) || parent?.label}
                  </MenuItem>
                )
              })}
          </MenuGroup>
        )
      })}
    </Menu>
  )
}

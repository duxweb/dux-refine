import { useState } from 'react'
import { Menu, Button } from 'tdesign-react/esm'
import { useTranslate, useGo } from '@refinedev/core'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
const { MenuGroup, MenuItem, SubMenu } = Menu
import { ViewListIcon } from 'tdesign-icons-react'
import { DuxLogo } from '../logo'
import { useMenu } from './util'
import clsx from 'clsx'
import './style.css'

export const SiderCollapse = () => {
  const go = useGo()
  const translate = useTranslate()
  const { defaultOpenKeys, menuData } = useMenu()
  const [collapse, setCollapse] = useState<boolean>(false)
  const [value, setValue] = useState<string>(defaultOpenKeys?.[0])
  return (
    <Menu
      className='app-sider-collapse hidden md:block'
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
            <div className='px-6 flex items-center'>
              <DuxLogo className='h-6' />
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
                    icon={<div className={clsx(['t-icon', app.icon])}></div>}
                  >
                    {parent?.children?.map((sub: TreeMenuItem) => (
                      <MenuItem
                        key={sub.name}
                        value={sub.key}
                        icon={<div className={clsx(['t-icon', app.icon])}></div>}
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
                    icon={<div className={clsx(['t-icon', parent.icon])}></div>}
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

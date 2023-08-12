import clsx from 'clsx'
import { Tooltip } from 'tdesign-react/esm'
import { useMenu, useGo, useLogout, useTranslate } from '@refinedev/core'
import { useMemo, useState } from 'react'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { DuxLogo } from '../logo'

const Sider = () => {
  const { menuItems, defaultOpenKeys } = useMenu()
  const { mutate: logout } = useLogout()
  const go = useGo()

  const [active, setActive] = useState<string[]>(
    defaultOpenKeys.length > 0 ? defaultOpenKeys : ['/index']
  )
  const [collapse, setCollapse] = useState(true)

  const menuInfo = useMemo<TreeMenuItem>(() => {
    return menuItems.find((item) => active[active.length - 1] == item.key)
  }, [active, menuItems])

  const translate = useTranslate()

  return (
    <div className='z-1 hidden flex-none flex-row md:flex'>
      <div className='h-screen w-18 flex flex-col border-r bg-container border-component'>
        <div className='h-16 flex items-center justify-center gap-2'>
          <DuxLogo className='w-12' />
        </div>
        <ul className='mt-6 flex flex-1 flex-col items-center gap-3 p-2 text-secondary'>
          {menuItems.map((item) => {
            return (
              <MenuApp
                key={item.name}
                name={translate(`${item.name}.name`) || item?.label}
                icon={item.icon}
                active={active[active.length - 1] == item.key}
                onClick={() => {
                  if (active[active.length - 1] !== item.key) {
                    setActive([item.key])
                    setCollapse(true)
                  } else {
                    setCollapse((status) => !status)
                  }
                  if (item.route) {
                    go({
                      to: item.route,
                    })
                  }
                }}
              />
            )
          })}
        </ul>
        <div className='mb-2 flex flex-none'>
          <ul className='flex flex-1 flex-col items-center gap-3 p-2 text-secondary'>
            <MenuApp
              name='Logout'
              icon='i-tabler:logout-2'
              onClick={() => {
                logout()
              }}
            />
          </ul>
        </div>
      </div>
      {menuInfo && (
        <div
          className={clsx([
            'border-component h-screen flex flex-col transition-all bg-container',
            collapse && menuInfo?.children?.length > 0
              ? 'w-45 opacity-100 border-r'
              : 'w-0 opacity-0 border-none',
          ])}
        >
          <div className='h-14 flex items-center px-4'>
            {menuInfo?.meta?.element || (
              <div className='font-bold text-secondary'>
                {translate(`${menuInfo.name}.name`) || menuInfo?.label}
              </div>
            )}
          </div>
          {menuInfo?.children?.map((item: TreeMenuItem, index: number) => (
            <div key={index} className='flex flex-col px-2 text-sm'>
              {item.children?.length == 0 && item.route && (
                <MenuTitle
                  key={item.name}
                  label={translate(`${item.name}.name`) || item?.label}
                  icon={item?.icon}
                  active={
                    active[active.length - 1] == menuInfo.key &&
                    active[active.length - 2] == item.key
                  }
                  onClick={() => {
                    setActive([item.key, menuInfo.key])
                    go({
                      to: item.route,
                    })
                  }}
                />
              )}
              {item?.children?.length > 0 && (
                <CollapseMenu key={item.name} item={item}>
                  <ul className='flex flex-col'>
                    {item.children.map((sub: TreeMenuItem) => (
                      <li key={sub.name}>
                        <div
                          className={clsx([
                            'cursor-pointer rounded pr-2 pl-8 py-2',
                            active[active.length - 1] == menuInfo.key &&
                            active[active.length - 2] == item.key &&
                            active[active.length - 3] == sub.key
                              ? 'text-brand bg-brand-1'
                              : 'text-secondary hover:bg-secondarycontainer',
                          ])}
                          onClick={() => {
                            setActive([sub.key, item.key, menuInfo.key])
                            go({
                              to: sub.route,
                            })
                          }}
                        >
                          {translate(`${sub.name}.name`) || sub?.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CollapseMenu>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface MenuAppProps {
  name: string
  icon: string
  active?: boolean
  onClick?: () => void
}
const MenuApp = ({ name, icon, active, onClick }: MenuAppProps) => {
  return (
    <li>
      <Tooltip
        content={name}
        destroyOnClose
        duration={0}
        placement='right'
        showArrow
        theme='default'
      >
        <div
          className={clsx([
            'flex items-center justify-center rounded px-2.5 py-1.5 hover:bg-brand-1 cursor-pointer',
            active ? 'bg-brand text-white hover:bg-brand hover:text-white' : '',
          ])}
          onClick={onClick}
        >
          <div className={clsx(['h-5 w-5', icon])}></div>
        </div>
      </Tooltip>
    </li>
  )
}

interface MenuTitleProps {
  label?: string
  icon?: string
  active?: boolean
  collapse?: boolean
  onClick?: () => void
}
const MenuTitle = ({ label, icon, active, collapse, onClick }: MenuTitleProps) => {
  return (
    <div
      className={clsx([
        'mb-1 flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-secondarycontainer',
        active ? 'text-brand bg-brand-1 hover:bg-brand-1' : '',
      ])}
      onClick={onClick}
    >
      <div className={clsx(['w-4 h-4', icon])}></div>
      <div className='flex-1'>{label}</div>
      {collapse != undefined && (
        <div
          className={clsx([
            'i-tabler:chevron-down transition-all',
            collapse ? 'rotate-0' : '-rotate-90',
          ])}
        ></div>
      )}
    </div>
  )
}

interface CollapseMenuProps {
  item: TreeMenuItem
  children?: React.ReactNode
}
const CollapseMenu = ({ item, children }: CollapseMenuProps) => {
  const [collapse, setCollapse] = useState(true)
  const translate = useTranslate()
  return (
    <div>
      <MenuTitle
        label={translate(`${item.name}.name`) || item?.label}
        icon={item?.icon}
        collapse={collapse}
        onClick={() => {
          setCollapse((status) => !status)
        }}
      />
      <div className={clsx(['transition-all overflow-hidden', collapse ? 'max-h-200' : 'max-h-0'])}>
        {children}
      </div>
    </div>
  )
}

export default Sider

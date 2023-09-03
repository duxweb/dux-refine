import { useMemo, useState } from 'react'
import { useGo, useTranslate } from '@refinedev/core'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { useSiderContext } from '../app'
import clsx from 'clsx'

export const Sub = () => {
  const { active, setActive, collapse, menuData } = useSiderContext()
  const translate = useTranslate()
  const go = useGo()

  const menuInfo = useMemo<TreeMenuItem>(() => {
    return menuData?.find((item) => active[active.length - 1] == item.key)
  }, [active, menuData])

  if (!menuInfo) {
    return null
  }

  return (
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
            {translate(`${menuInfo.label}.name`) || menuInfo?.label}
          </div>
        )}
      </div>
      {menuInfo?.children?.map((item: TreeMenuItem, index: number) => (
        <div key={index} className='flex flex-col px-2 text-sm'>
          {item.children?.length == 0 && item.route && (
            <MenuTitle
              key={item.name}
              label={translate(`${item.label}.name`) || item?.label}
              icon={item?.icon}
              active={
                active[active.length - 1] == menuInfo.key && active[active.length - 2] == item.key
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
                {item?.children?.map((sub: TreeMenuItem) => (
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
                      {translate(`${sub.label}.name`) || sub?.label}
                    </div>
                  </li>
                ))}
              </ul>
            </CollapseMenu>
          )}
        </div>
      ))}
    </div>
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
        label={translate(`${item.label}.name`) || item?.label}
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

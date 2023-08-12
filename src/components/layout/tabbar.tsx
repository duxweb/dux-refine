import { useMenu, useGo, useParsed } from '@refinedev/core'
import clsx from 'clsx'
import { useState } from 'react'
import { Button, Link } from 'tdesign-react/esm'
import { CloseIcon } from 'tdesign-icons-react'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { motion } from 'framer-motion'
import config from '@/config'

export const TabBar = () => {
  const go = useGo()
  const [open, setOpen] = useState(false)

  const { params } = useParsed<{ app: string }>()

  return (
    <>
      <div className='h-15 flex justify-between border-t bg-container border-component md:hidden'>
        {params &&
          config.tabBar[params.app]?.map((item, index) => (
            <TabBarItem
              key={index}
              name={item.label}
              icon={item.icon}
              onClick={() => {
                go({
                  to: item.route,
                })
              }}
            />
          ))}
        <TabBarItem
          name='more'
          icon={'i-tabler:dots'}
          onClick={() => {
            setOpen(!open)
          }}
        />
      </div>
      <div className='md:hidden'>{open && <Menu onClose={() => setOpen(false)} />}</div>
    </>
  )
}

interface MenuProps {
  onClose: () => void
  visible?: boolean
}
const Menu = ({ onClose }: MenuProps) => {
  const { menuItems, defaultOpenKeys } = useMenu()
  const [active, setActive] = useState<string[]>(defaultOpenKeys)
  return (
    <div
      className={clsx([
        'fixed inset-0 z-100  items-center justify-center overflow-hidden bg-black/50 p-4',
      ])}
    >
      <motion.div
        className='h-full w-full flex flex-col rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-black/80'
        animate={'show'}
        variants={{
          show: {
            opacity: 1,
          },
          hidden: {
            opacity: 0,
          },
        }}
      >
        <div className='flex flex-none flex-row items-center justify-between'>
          <div className='text-lg'>Menu</div>
          <div className=''>
            <Button shape='circle' icon={<CloseIcon />} variant='outline' onClick={onClose} />
          </div>
        </div>
        <ul className='flex flex-1 flex-col gap-2 py-4 text-sm'>
          {menuItems.map((item, index) => {
            return (
              <CollapseMenu
                key={index}
                item={item}
                active={active}
                setActive={setActive}
                onClose={onClose}
              />
            )
          })}
        </ul>
      </motion.div>
    </div>
  )
}

interface CollapseMenuProps {
  item: TreeMenuItem
  active: string[]
  setActive: (active: string[]) => void
  onClose: () => void
}
const CollapseMenu = ({ item, active, setActive, onClose }: CollapseMenuProps) => {
  const [collapse, setCollapse] = useState(active[active.length - 1] == item.key)
  return (
    <li className={clsx(['rounded bg-container'])}>
      <CollapseMenuTitle {...{ item, collapse, setCollapse, active, setActive, onClose }} />
      <div className={clsx(['p-2', item.children?.length != 0 && collapse ? 'block' : 'hidden'])}>
        <div className='rounded bg-gray-1 p-1'>
          <CollapseMenuTree
            items={item.children}
            path={[item.key]}
            active={active}
            setActive={setActive}
            onClose={onClose}
          />
        </div>
      </div>
    </li>
  )
}

interface MenuTitleProps {
  item: TreeMenuItem
  collapse: boolean
  active: string[]
  setCollapse: (collapse: boolean) => void
  setActive: (active: string[]) => void
  onClose: () => void
}

const CollapseMenuTitle = ({
  item,
  collapse,
  setCollapse,
  active,
  setActive,
  onClose,
}: MenuTitleProps) => {
  const go = useGo()
  return (
    <div
      className={clsx([
        'flex cursor-pointer items-center justify-between gap-2 p-4 py-3',
        active[active.length - 1] == item.key ? 'text-brand' : '',
      ])}
      onClick={() => {
        item.children?.length > 0 && setCollapse(!collapse)
        if (!item.children?.length && item.route) {
          go({ to: item.route })
          setActive([item.key])
          onClose?.()
        }
      }}
    >
      <div className='flex items-center gap-2'>
        <div className={item.icon}></div>
        {item.label}
      </div>
      {item.children?.length > 0 && (
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

interface CollapseMenuTreeProps {
  items: TreeMenuItem[]
  path: string[]
  active: string[]
  setActive: (active: string[]) => void
  onClose: () => void
}

const CollapseMenuTree = ({ items, path, active, setActive, onClose }: CollapseMenuTreeProps) => {
  const go = useGo()

  return items?.map((item, index) => (
    <ul key={index}>
      <li>
        <Link
          className={clsx([
            'block flex items-center gap-2 px-4 py-2',
            JSON.stringify(active) === JSON.stringify([item.key, ...path]) ? 'text-brand' : '',
          ])}
          hover={'color'}
          onClick={() => {
            if (!item.route) {
              return
            }
            go({
              to: item.route,
            })
            onClose?.()
            setActive([item.key, ...path])
          }}
        >
          {item.children?.length > 0 ? (
            <div className='i-tabler:caret-down-filled opacity-40'></div>
          ) : (
            <div className='w-3'></div>
          )}
          {item.label}
        </Link>
        {item.children?.length > 0 && (
          <div className='pl-4'>
            <CollapseMenuTree
              items={item.children}
              path={[item.key, ...path]}
              active={active}
              setActive={setActive}
              onClose={onClose}
            />
          </div>
        )}
      </li>
    </ul>
  ))
}

interface TabBarItemProps {
  name: string
  icon: string
  active?: boolean
  onClick?: () => void
}
const TabBarItem = ({ name, icon, active, onClick }: TabBarItemProps) => {
  return (
    <>
      <div
        className={clsx([
          'flex flex-1 flex-col items-center p-2 hover:text-brand cursor-pointer',
          active ? 'text-brand' : '',
        ])}
        onClick={onClick}
      >
        <div className={clsx(['h-5 w-5', icon])}></div>
        <div className='text-sm'>{name}</div>
      </div>
    </>
  )
}

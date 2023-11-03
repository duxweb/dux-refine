import { useGo, useMenu, useTranslate } from '@refinedev/core'
import clsx from 'clsx'
import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'
import { motion } from 'framer-motion'
import { Button, Link } from 'tdesign-react/esm'
import { CloseIcon } from 'tdesign-icons-react'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'

interface MenuContextProps {
  active: string[]
  setActive: Dispatch<SetStateAction<string[]>>
  close: () => void
}

const menuContext = createContext<MenuContextProps>({} as MenuContextProps)

const useMenuContext = () => {
  return useContext(menuContext)
}

export interface TabMenuProps {
  close: () => void
}
export const TabMenu = ({ close }: TabMenuProps) => {
  const { menuItems, defaultOpenKeys } = useMenu()
  const [active, setActive] = useState<string[]>(defaultOpenKeys)

  return (
    <menuContext.Provider value={{ active, setActive, close }}>
      <Modal>
        <ul className='flex flex-1 flex-col gap-2 py-4 text-sm'>
          {menuItems.map((item, index) => {
            return <MenuPanel key={index} item={item} />
          })}
        </ul>
      </Modal>
    </menuContext.Provider>
  )
}

const Modal = ({ children }: React.PropsWithChildren) => {
  const { close } = useMenuContext()
  const translate = useTranslate()
  return (
    <div className='fixed inset-0 z-100  items-center justify-center overflow-hidden bg-black/50 p-4'>
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
          <div className='text-lg'>{translate('common.menu')}</div>
          <div className=''>
            <Button shape='circle' icon={<CloseIcon />} variant='outline' onClick={close} />
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

interface MenuPanelProps {
  item: TreeMenuItem
}
const MenuPanel = ({ item }: MenuPanelProps) => {
  const { active } = useMenuContext()
  const [collapse, setCollapse] = useState(active[active.length - 1] == item.key)
  return (
    <li className={'rounded bg-container'}>
      <MenuPanelTitle item={item} collapse={collapse} setCollapse={setCollapse} />
      <div className={clsx(['p-2', item.children?.length != 0 && collapse ? 'block' : 'hidden'])}>
        <div className='rounded p-1 bg-gray-1 dark:bg-black/50'>
          <MenuTree items={item.children} path={[item.key]} />
        </div>
      </div>
    </li>
  )
}

interface MenuPanelTitleProps {
  item: TreeMenuItem
  collapse: boolean
  setCollapse: (collapse: boolean) => void
}

const MenuPanelTitle = ({ item, collapse, setCollapse }: MenuPanelTitleProps) => {
  const go = useGo()
  const { close, setActive, active } = useMenuContext()
  const translate = useTranslate()
  return (
    <div
      className={clsx([
        'flex cursor-pointer items-center justify-between gap-2 p-4 py-3',
        active[active.length - 1] == item.key ? 'text-brand' : '',
      ])}
      onClick={() => {
        item.children?.length > 0 && setCollapse(!collapse)
        if (!item.children?.length && item.route) {
          setActive([item.key])
          go({ to: item.route })
          close?.()
        }
      }}
    >
      <div className='flex items-center gap-2'>
        <div className={(item.icon as string) || ''}></div>
        {translate(`${item.label}.name`)}
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

interface MenuTreeProps {
  items: TreeMenuItem[]
  path: string[]
}

const MenuTree = ({ items, path }: MenuTreeProps) => {
  const go = useGo()
  const { close, setActive, active } = useMenuContext()
  const translate = useTranslate()

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
            setActive([item.key, ...path])
            go({
              to: item.route,
            })
            close?.()
          }}
        >
          {item.children?.length > 0 ? (
            <div className='i-tabler:caret-down-filled opacity-40'></div>
          ) : (
            <div className='w-3'></div>
          )}
          {translate(`${item.label}.name`)}
        </Link>
        {item.children?.length > 0 && (
          <div className='pl-4'>
            <MenuTree items={item.children} path={[item.key, ...path]} />
          </div>
        )}
      </li>
    </ul>
  ))
}

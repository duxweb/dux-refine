import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslate, useGo } from '@refinedev/core'
import { useKBar } from 'kbar'
import { useModuleContext } from '../../core/module'
import { useAppStore } from '../../stores'
import { MenuItemProps } from './menu'
import { DuxLogo } from '../logo'
import { Icon } from 'tdesign-icons-react'
import clsx from 'clsx'
import { SideUser } from './collapse'

export interface SiderAppProps {
  menuData: MenuItemProps[]
  defaultOpenKeys: string[]
}

interface siderContextProps {
  menus: MenuItemProps[]
  value: string[] | undefined
  setValue: Dispatch<SetStateAction<string[] | undefined>>
}

const siderContext = createContext<siderContextProps>({
  menus: [],
  value: [],
  setValue: () => [],
})

export const SiderApp = ({ defaultOpenKeys, menuData }: SiderAppProps) => {
  const go = useGo()
  const translate = useTranslate()
  const [collapse, setCollapse] = useState<boolean>(false)
  const [value, setValue] = useState<string[] | undefined>()
  const module = useModuleContext()
  const dark = useAppStore((state) => state.dark)

  useEffect(() => {
    setValue(defaultOpenKeys.reverse())
  }, [defaultOpenKeys])

  const panelData = useMemo(() => {
    return menuData.find((item) => {
      return item.key == value?.[0]
    })
  }, [menuData, value])

  const { query } = useKBar()

  return (
    <div className='flex h-screen'>
      <div
        className={clsx([
          'flex flex-col w-[80px] bg-component',
          !collapse && panelData?.children?.length && panelData.children.length > 0
            ? 'border-r border-component'
            : '',
        ])}
      >
        <div
          className='my-4 py-4 flex justify-center flex-none cursor-pointer'
          onClick={() => setCollapse((v) => !v)}
        >
          <DuxLogo className='h-4' />
        </div>

        <div className='flex-none  mb-6 flex justify-center items-center'>
          <div
            className='w-8 h-8 shadow-sm hover:shadow rounded-full flex justify-center items-center bg-container cursor-pointer'
            onClick={() => {
              query.toggle()
            }}
          >
            <Icon size='16px' name='search' />
          </div>
        </div>

        <div className='flex-1 h-1 flex flex-col overflow-y-auto gap-4 px-1'>
          {menuData.map((item, key) => (
            <div
              key={key}
              className={clsx([
                'flex flex-col gap-1 justify-center items-center cursor-pointer hover:text-brand',
                value?.[0] == item.key ? 'text-brand' : 'text-secondary',
              ])}
              onClick={() => {
                if (item.route) {
                  go({
                    to: item.route,
                  })
                  setValue([item.key])
                } else if (item.children?.[0]?.route) {
                  go({
                    to: item.children[0].route,
                  })
                  setValue([item.key, item.children[0].key])
                } else if (item.children?.[0]?.children?.[0]?.route) {
                  go({
                    to: item.children[0].children[0].route,
                  })
                  setValue([item.key, item.children[0].key, item.children[0].children[0].key])
                }
              }}
            >
              <div>
                {item.icon?.includes('i-') ? (
                  <div className={clsx(['h-6 w-6', item.icon])}></div>
                ) : (
                  <Icon size={'22px'} name={item.icon} />
                )}
              </div>
              <div className='text-sm'>{translate(`${item.label}.name`, item?.label)}</div>
            </div>
          ))}
        </div>

        <div className='flex-none flex justify-center items-center py-2'>
          <SideUser collapse={true} menu={module.userMenu} size='large' />
        </div>
      </div>
      <siderContext.Provider
        value={{
          menus: menuData,
          value: value,
          setValue: setValue,
        }}
      >
        {!collapse && panelData?.children?.length && panelData?.children.length > 0 ? (
          <div className='flex flex-col w-[190px] bg-container divide-y divide-gray-3 dark:divide-gray-11 px-3 text-sm '>
            {panelData?.children?.map((sub, subIndex) => {
              return sub.children && sub.children.length > 0 ? (
                <SiderGroup menuData={sub} key={subIndex} />
              ) : (
                <div className='py-2' key={subIndex}>
                  <SiderItem menuData={sub} active={value?.[1]} icon={sub.icon} />
                </div>
              )
            })}
          </div>
        ) : (
          ''
        )}
      </siderContext.Provider>
    </div>
  )
}

interface SiderGroupProps {
  menuData: MenuItemProps
  //value: string[] | undefined
  //setValue: Dispatch<SetStateAction<string[] | undefined>>
}

const SiderGroup = ({ menuData }: SiderGroupProps) => {
  const translate = useTranslate()
  const { value } = useContext(siderContext)
  const [open, setOpen] = useState(value?.[1] == menuData.key)
  return (
    <div className='pb-2 pt-2'>
      <div
        className='text-sm text-secondary py-2.5 pl-4 pr-2 flex gap-2 cursor-pointer'
        onClick={() => setOpen((v) => !v)}
      >
        <div className='flex gap-2 flex-1'>
          {menuData.icon &&
            (menuData.icon?.includes('i-') ? (
              <div className={clsx(['h-5 w-5', menuData.icon])}></div>
            ) : (
              <Icon size={'20px'} name={menuData.icon} />
            ))}
          {translate(`${menuData.label}.name`, menuData?.label)}
        </div>
        <div>
          <div
            className={clsx([
              'transition w-5 h-5 i-tabler:chevron-down text-placeholder',
              open ? 'rotate-180' : 'rotate-0',
            ])}
          ></div>
        </div>
      </div>
      <div
        className={clsx([
          'transition flex flex-col gap-1 overflow-hidden',
          !open ? 'h-0' : 'h-auto',
        ])}
      >
        {menuData.children?.map((item, itemIndex) => (
          <SiderItem key={itemIndex} menuData={item} active={value?.[2]} />
        ))}
      </div>
    </div>
  )
}

interface SiderItemProps {
  menuData: MenuItemProps
  active?: string
  icon?: string
}

const SiderItem = ({ menuData, active, icon }: SiderItemProps) => {
  const go = useGo()
  const translate = useTranslate()

  const { menus, setValue } = useContext(siderContext)
  return (
    <div
      className={clsx([
        'flex gap-2 py-2.5 px-4 items-center rounded hover:text-brand-7 cursor-pointer',
        active && active == menuData.key ? 'bg-brand-1 text-brand-7' : 'text-secondary',
      ])}
      onClick={() => {
        setValue(getPathValue(menus, menuData.key))
        go({
          to: menuData.route,
        })
      }}
    >
      <div className='w-[20px]'>
        {icon &&
          (icon?.includes('i-') ? (
            <div className={clsx(['h-5 w-5', icon])}></div>
          ) : (
            <Icon size={'20px'} name={icon} />
          ))}
      </div>

      {translate(`${menuData.label}.name`, menuData?.label)}
    </div>
  )
}

const getPathValue = (menuData: MenuItemProps[], key: string) => {
  let path: string[] = []

  function search(subArray: MenuItemProps[], currentPath: string[]) {
    for (const obj of subArray) {
      if (obj.key === key) {
        path = currentPath.concat(obj.key)
        return true
      }

      if (obj.children) {
        if (search(obj.children, currentPath.concat(obj.key))) {
          return true
        }
      }
    }
    return false
  }
  search(menuData, [])
  return path
}

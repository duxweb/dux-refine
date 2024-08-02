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
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

export interface SliderAppProps {
  menuData: MenuItemProps[]
  defaultOpenKeys: string[]
}

interface sliderContextProps {
  menus: MenuItemProps[]
  value: string[] | undefined
  setValue: Dispatch<SetStateAction<string[] | undefined>>
}

const sliderContext = createContext<sliderContextProps>({
  menus: [],
  value: [],
  setValue: () => [],
})

export const SliderApp = ({ defaultOpenKeys, menuData }: SliderAppProps) => {
  const go = useGo()
  const translate = useTranslate()
  const [value, setValue] = useState<string[] | undefined>()
  const module = useModuleContext()
  const dark = useAppStore((state) => state.dark)
  const siderHidden = useAppStore((state) => state.siderHidden)
  const switchSiderHidden = useAppStore((state) => state.switchSiderHidden)

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
          'flex flex-col w-[75px] bg-component border-r',
          !siderHidden && panelData?.children?.length && panelData.children.length > 0
            ? 'border-component'
            : 'border-transparent',
        ])}
      >
        <div
          className='h-20 flex items-center justify-center flex-none cursor-pointer px-3'
          onClick={() => switchSiderHidden()}
        >
          {module.config?.appLogo ? (
            <img
              src={
                dark ? module.config?.appDarkLogo || module.config.appLogo : module.config.appLogo
              }
              className='max-w-full  max-h-6'
            />
          ) : (
            <DuxLogo className='max-w-full  max-h-6' />
          )}
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
        <OverlayScrollbarsComponent defer className='flex-1 h-1'>
          <div className=' flex flex-col gap-2 px-2 text-secondary'>
            {menuData.map((item, key) => (
              <div
                key={key}
                className={clsx([
                  'flex flex-col justify-center py-1.5 items-center cursor-pointer hover:text-brand rounded-md',
                  value?.[0] == item.key ? 'text-brand bg-gray-1 dark:bg-gray-10' : '',
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
        </OverlayScrollbarsComponent>
        <div className='flex-none flex justify-center items-center py-2'>
          <SideUser collapse={true} menu={module.userMenu} size='large' />
        </div>
      </div>
      <sliderContext.Provider
        value={{
          menus: menuData,
          value: value,
          setValue: setValue,
        }}
      >
        {!siderHidden && panelData?.children?.length && panelData?.children.length > 0 ? (
          <OverlayScrollbarsComponent defer className='w-[190px] bg-container'>
            <div className='flex flex-col divide-y divide-gray-3 dark:divide-gray-11 px-3 text-sm'>
              {panelData?.children?.map((sub, subIndex) => {
                return sub.children && sub.children.length > 0 ? (
                  <SliderGroup menuData={sub} key={subIndex} />
                ) : (
                  <div className='py-2' key={subIndex}>
                    <SliderItem menuData={sub} active={value?.[1]} icon={sub.icon} />
                  </div>
                )
              })}
            </div>
          </OverlayScrollbarsComponent>
        ) : (
          ''
        )}
      </sliderContext.Provider>
    </div>
  )
}

interface SliderGroupProps {
  menuData: MenuItemProps
  //value: string[] | undefined
  //setValue: Dispatch<SetStateAction<string[] | undefined>>
}

const SliderGroup = ({ menuData }: SliderGroupProps) => {
  const translate = useTranslate()
  const { value } = useContext(sliderContext)
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
          <SliderItem key={itemIndex} menuData={item} active={value?.[2]} />
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

const SliderItem = ({ menuData, active, icon }: SiderItemProps) => {
  const go = useGo()
  const translate = useTranslate()

  const { menus, setValue } = useContext(sliderContext)
  return (
    <div
      className={clsx([
        'flex gap-2 py-2.5 px-4 items-center rounded hover:text-brand cursor-pointer',
        active && active == menuData.key ? 'bg-brand-1 text-brand' : 'text-secondary',
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

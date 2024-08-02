import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslate, useGo, useGetIdentity, useLogout, useSetLocale } from '@refinedev/core'
import { Menu, Button, Dropdown, Avatar, DropdownOption, Input } from 'tdesign-react/esm'
import { useKBar } from 'kbar'

const { MenuItem, SubMenu } = Menu
import {
  Icon,
  SearchIcon,
  MoreIcon,
  BrightnessIcon,
  Brightness1Icon,
  EarthIcon,
} from 'tdesign-icons-react'
import { DuxLogo } from '../logo'
import { MenuItemProps } from './menu'
import { siderType, useModuleContext, userMenuItem } from '../../core'
import { useAppStore } from '../../stores'
import './style.css'
import clsx from 'clsx'

const getShortcutKey = () => {
  const userAgent = navigator.userAgent
  const isMac = /Mac|iPod|iPhone|iPad/.test(userAgent)
  return isMac ? '⌘ + R' : 'Ctrl + R'
}

const Search = () => {
  const translate = useTranslate()
  const { query } = useKBar()
  return (
    <Input
      placeholder={translate('common.search')}
      prefixIcon={<SearchIcon />}
      suffix={getShortcutKey()}
      readonly
      onClick={() => {
        query.toggle()
      }}
    />
  )
}

export interface SiderCollapseProps {
  type: siderType
  menuData: MenuItemProps[]
  defaultOpenKeys: string[]
}

export const SiderCollapse = ({ defaultOpenKeys, menuData, type }: SiderCollapseProps) => {
  const go = useGo()
  const translate = useTranslate()
  const siderHidden = useAppStore((state) => state.siderHidden)
  const switchSiderHidden = useAppStore((state) => state.switchSiderHidden)

  const [value, setValue] = useState<string | undefined>()
  const module = useModuleContext()
  const dark = useAppStore((state) => state.dark)

  useEffect(() => {
    if (value) {
      return
    }
    setValue(defaultOpenKeys[0])
  }, [defaultOpenKeys, value])

  return (
    <Menu
      className='h-full'
      width='210px'
      value={value}
      onChange={(value) => setValue(value as string)}
      collapsed={siderHidden}
      logo={
        <div className='relative w-full h-full flex items-center !ml-0'>
          <div
            className={clsx([
              'w-full h-15 flex items-center cursor-pointer',
              siderHidden ? 'px-2 justify-center' : 'px-4 justify-start',
            ])}
            onClick={() => switchSiderHidden()}
          >
            {module.config?.sideLogo ? (
              <img
                src={
                  dark ? module.config?.appDarkLogo || module.config.appLogo : module.config.appLogo
                }
                className='max-w-full  max-h-6'
              />
            ) : (
              <DuxLogo className='max-w-full max-h-6' />
            )}
          </div>
        </div>
      }
      operations={
        <>
          <div>
            <SideUser collapse={siderHidden} menu={module.userMenu} />
          </div>
        </>
      }
    >
      {!siderHidden && (
        <div className='mb-2'>
          <Search />
        </div>
      )}
      {menuData.map((app: MenuItemProps) => {
        return app?.children?.length == 0 ? (
          <MenuItem
            key={app.key}
            value={app.key}
            icon={
              app.icon?.includes('i-') ? (
                <div className={clsx(['t-icon h-6 w-6', app.icon])}></div>
              ) : (
                <Icon size={'22px'} name={app.icon} />
              )
            }
            onClick={() => {
              go({
                to: app.route,
              })
            }}
          >
            {translate(`${app.label}.name`, app?.label)}
          </MenuItem>
        ) : type == 'collapse' ? (
          <SubMenu
            key={app.key}
            title={translate(`${app.label}.name`, app?.label)}
            value={app.key}
            icon={
              app.icon ? (
                app.icon?.includes('i-') ? (
                  <div className={clsx(['t-icon h-6 w-6', app.icon])}></div>
                ) : (
                  <Icon size={'22px'} name={app.icon} />
                )
              ) : undefined
            }
          >
            {app?.children?.length > 0 && SiderCollapseSub({ data: app?.children })}
          </SubMenu>
        ) : (
          <Menu.MenuGroup title={translate(`${app.label}.name`, app?.label)} key={app.key}>
            {app?.children?.length > 0 && SiderCollapseSub({ data: app?.children, icon: true })}
          </Menu.MenuGroup>
        )
      })}
    </Menu>
  )
}

export interface SiderCollapseSubProps {
  data: MenuItemProps[]
  icon?: boolean
}

export const SiderCollapseSub = ({ data, icon }: SiderCollapseSubProps) => {
  const go = useGo()
  const translate = useTranslate()
  return data?.map((parent: MenuItemProps) => {
    return parent?.children?.length > 0 ? (
      <SubMenu
        key={parent.key}
        title={translate(`${parent.label}.name`, parent?.label)}
        value={parent.key}
        icon={
          icon && parent.icon ? (
            parent.icon?.includes('i-') ? (
              <div className={clsx(['t-icon h-6 w-6', parent.icon])}></div>
            ) : (
              <Icon size={'22px'} name={parent.icon} />
            )
          ) : undefined
        }
      >
        {parent?.children?.map((sub: MenuItemProps) => (
          <MenuItem
            key={sub.key}
            value={sub.key}
            icon={
              icon && sub.icon ? (
                sub.icon?.includes('i-') ? (
                  <div className={clsx(['t-icon h-6 w-6', sub.icon])}></div>
                ) : (
                  <Icon size={'22px'} name={sub.icon} />
                )
              ) : undefined
            }
            onClick={() => {
              go({
                to: sub.route,
              })
            }}
          >
            {translate(`${sub.label}.name`, sub?.label)}
          </MenuItem>
        ))}
      </SubMenu>
    ) : (
      <MenuItem
        key={parent.key}
        value={parent.key}
        icon={
          icon && parent.icon ? (
            parent.icon?.includes('i-') ? (
              <div className={clsx(['t-icon h-6 w-6', parent.icon])}></div>
            ) : (
              <Icon size={'22px'} name={parent.icon} />
            )
          ) : undefined
        }
        onClick={() => {
          go({
            to: parent.route,
          })
        }}
      >
        {translate(`${parent.label}.name`, parent?.label)}
      </MenuItem>
    )
  })
}

interface UserProps {
  menu?: userMenuItem[]
  size?: string
  collapse: boolean
}
export const SideUser = ({ collapse, menu = [], size = 'medium' }: UserProps) => {
  const { data } = useGetIdentity<{
    userInfo: Record<string, any>
  }>()
  const go = useGo()
  const translate = useTranslate()
  const { mutate: logout } = useLogout()
  const switchDark = useAppStore((state) => state.switchDark)
  const dark = useAppStore((state) => state.dark)
  const changeLanguage = useSetLocale()
  const { config } = useModuleContext()

  const switchLang = useCallback(
    (data: DropdownOption) => {
      changeLanguage(data.value as string)
    },
    [changeLanguage],
  )

  const options = useMemo(() => {
    const optionData: Array<DropdownOption> = menu.map((item) => {
      return {
        content: translate(`userMenu.${item.label}`),
        prefixIcon: <div className={item.icon}></div>,
        onClick: () => {
          go({
            to: item.route,
          })
        },
      }
    })
    optionData.push({
      content: dark ? translate('common.light') : translate('common.dark'),
      prefixIcon: dark ? <BrightnessIcon /> : <Brightness1Icon />,
      onClick: () => {
        switchDark()
      },
    })

    if (!config.lang) {
      optionData.push({
        content: translate('common.lang'),
        prefixIcon: <EarthIcon />,
        children: [
          {
            value: 'en-US',
            content: 'English',
            prefixIcon: <div>🇬🇧</div>,
            onClick: switchLang,
          },
          {
            value: 'zh-CN',
            content: '中文',
            prefixIcon: <div>🇨🇳</div>,
            onClick: switchLang,
          },
          {
            value: 'zh-TW',
            content: '繁体中文',
            prefixIcon: <div>🇨🇳</div>,
            onClick: switchLang,
          },
          {
            value: 'ja-JP',
            content: 'はい',
            prefixIcon: <div>🇯🇵</div>,
            onClick: switchLang,
          },
          {
            value: 'ru-RU',
            content: 'россия',
            prefixIcon: <div>🇷🇺</div>,
            onClick: switchLang,
          },
          {
            value: 'ko-KR',
            content: '한국어',
            prefixIcon: <div>🇰🇷</div>,
            onClick: switchLang,
          },
        ],
      })
    }

    optionData.push({
      content: translate('common.logout'),
      prefixIcon: <div className='i-tabler:logout h-4 w-4 text-primary'></div>,
      onClick: () => {
        logout()
      },
    })
    return optionData
  }, [menu, dark])

  return (
    <div className='flex items-center gap-2 leading-5'>
      <Dropdown options={options} minColumnWidth={150} trigger='click'>
        <Avatar className='cursor-pointer' image={data?.userInfo?.avatar} size={size}>
          {data?.userInfo?.nickname[0]}
        </Avatar>
      </Dropdown>
      {!collapse && (
        <>
          <div className='flex-1 w-1 flex flex-col text-xs truncate'>
            <div>{data?.userInfo?.nickname}</div>
            <div className='text-placeholder'>{data?.userInfo?.rolename}</div>
          </div>
          <div className='flex-none'>
            <Dropdown
              options={options}
              minColumnWidth={150}
              trigger='click'
              placement={'right-bottom'}
            >
              <Button shape='square' variant='text'>
                <MoreIcon />
              </Button>
            </Dropdown>
          </div>
        </>
      )}
    </div>
  )
}

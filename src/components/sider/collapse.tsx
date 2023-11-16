import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslate, useGo, useGetIdentity, useLogout, useSetLocale } from '@refinedev/core'
import { Menu, Button, Dropdown, Avatar, DropdownOption, Input } from 'tdesign-react/esm'
import { useKBar } from 'kbar'

const { MenuItem, SubMenu } = Menu
import {
  Icon,
  ViewListIcon,
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
  col: boolean
  menuData: MenuItemProps[]
  defaultOpenKeys: string[]
}

export const SiderCollapse = ({ defaultOpenKeys, menuData, type, col }: SiderCollapseProps) => {
  const go = useGo()
  const translate = useTranslate()
  const [collapse, setCollapse] = useState<boolean>(false)
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
      collapsed={collapse}
      logo={
        <div className='relative w-full h-full flex items-center'>
          {collapse ? (
            <div
              className='w-full h-full flex items-center justify-center cursor-pointer'
              onClick={() => setCollapse(!collapse)}
            >
              {module.config?.sideLogo ? (
                <img
                  src={
                    dark
                      ? module.config?.appDarkLogo || module.config.appLogo
                      : module.config.appLogo
                  }
                  className='h-3'
                />
              ) : (
                <DuxLogo className='h-3' />
              )}
            </div>
          ) : (
            <>
              <div className='w-full flex items-center px-4'>
                {module.config?.sideLogo ? (
                  <img
                    src={
                      dark
                        ? module.config?.sideDarkLogo || module.config.sideLogo
                        : module.config.sideLogo
                    }
                    className='h-5'
                  />
                ) : (
                  <DuxLogo className='h-6' />
                )}
              </div>
              {col && (
                <div className='absolute -right-3 z-1'>
                  <Button
                    size='small'
                    shape='circle'
                    icon={<ViewListIcon />}
                    onClick={() => setCollapse(!collapse)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      }
      operations={
        <>
          <div>
            <User collapse={collapse} menu={module.userMenu} />
          </div>
        </>
      }
    >
      {!collapse && (
        <div className='mb-2'>
          <Search />
        </div>
      )}
      {menuData.map((app: MenuItemProps) => {
        return app?.children?.length == 0 ? (
          <MenuItem
            key={app.key}
            value={app.key}
            icon={<Icon name={app.icon} />}
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
            icon={app.icon ? <Icon name={app.icon} /> : undefined}
          >
            {app?.children?.length > 0 && <SiderCollapseSub data={app?.children} />}
          </SubMenu>
        ) : (
          <Menu.MenuGroup title={translate(`${app.label}.name`, app?.label)} key={app.key}>
            {app?.children?.length > 0 && <SiderCollapseSub data={app?.children} />}
          </Menu.MenuGroup>
        )
      })}
    </Menu>
  )
}

export interface SiderCollapseSubProps {
  data: MenuItemProps[]
}

export const SiderCollapseSub = ({ data }: SiderCollapseSubProps) => {
  const go = useGo()
  const translate = useTranslate()
  return data?.map((parent: MenuItemProps) => {
    return parent?.children?.length > 0 ? (
      <SubMenu
        key={parent.key}
        title={translate(`${parent.label}.name`, parent?.label)}
        value={parent.key}
        icon={parent.icon ? <Icon name={parent.icon} /> : undefined}
      >
        {parent?.children?.map((sub: MenuItemProps) => (
          <MenuItem
            key={sub.key}
            value={sub.key}
            icon={sub.icon ? <Icon name={sub.icon} /> : undefined}
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
        icon={parent.icon ? <Icon name={parent.icon} /> : undefined}
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
  collapse: boolean
}
const User = ({ collapse, menu = [] }: UserProps) => {
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
    [changeLanguage]
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
            value: 'en',
            content: 'English',
            prefixIcon: <div>🇬🇧</div>,
            onClick: switchLang,
          },
          {
            value: 'zh',
            content: '中文',
            prefixIcon: <div>🇨🇳</div>,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu])

  return (
    <div className='flex items-center gap-2 leading-5'>
      <Avatar image={data?.userInfo?.avatar}>{data?.userInfo?.nickname[0]}</Avatar>
      {!collapse && (
        <>
          <div className='flex-1 w-1 flex flex-col text-xs truncate'>
            <div>{data?.userInfo?.nickname}</div>
            <div className='text-placeholder'>{data?.userInfo?.rolename}</div>
          </div>
          <div className='flex-none'>
            <Dropdown options={options} minColumnWidth={150} trigger='click'>
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

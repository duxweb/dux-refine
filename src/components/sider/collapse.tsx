import { useCallback, useMemo, useState } from 'react'
import {
  useTranslate,
  useGo,
  useResource,
  useGetIdentity,
  useLogout,
  useSetLocale,
} from '@refinedev/core'
import { Menu, Button, Dropdown, SelectInput, Avatar, DropdownOption } from 'tdesign-react/esm'
const { MenuItem, SubMenu } = Menu
import {
  ViewListIcon,
  SearchIcon,
  MoreIcon,
  BrightnessIcon,
  Brightness1Icon,
  EarthIcon,
} from 'tdesign-icons-react'
import { DuxLogo } from '../logo'
import { MenuItemProps, useMenu } from './util'
import { useModuleContext, userMenuItem } from '../../core'
import { useCanHelper } from '../../provider'
import { useAppStore } from '../../stores'
import clsx from 'clsx'
import './style.css'

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
  const module = useModuleContext()
  const dark = useAppStore((state) => state.dark)
  return (
    <Menu
      className='app-sider-collapse hidden md:block'
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
              <div className='flex items-center px-4'>
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
              <Button
                size='small'
                className='absolute -right-3 z-1'
                shape='circle'
                variant='outline'
                icon={<ViewListIcon />}
                onClick={() => setCollapse(!collapse)}
              />
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
            icon={<div className={clsx(['t-icon', app.icon])}></div>}
            onClick={() => {
              go({
                to: app.route,
              })
            }}
          >
            {translate(`${app.label}.name`, app?.label)}
          </MenuItem>
        ) : (
          <SubMenu
            key={app.key}
            title={translate(`${app.label}.name`, app?.label)}
            value={app.key}
            icon={app.icon ? <div className={clsx(['t-icon', app.icon])}></div> : undefined}
          >
            {app?.children?.length > 0 &&
              app?.children?.map((parent: MenuItemProps) => {
                return parent?.children?.length > 0 ? (
                  <SubMenu
                    key={parent.key}
                    title={translate(`${parent.label}.name`, parent?.label)}
                    value={parent.key}
                    icon={
                      parent.icon ? (
                        <div className={clsx(['t-icon', parent.icon])}></div>
                      ) : undefined
                    }
                  >
                    {parent?.children?.map((sub: MenuItemProps) => (
                      <MenuItem
                        key={sub.key}
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
                        {translate(`${sub.label}.name`, sub?.label)}
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
                    {translate(`${parent.label}.name`, parent?.label)}
                  </MenuItem>
                )
              })}
          </SubMenu>
        )
      })}
    </Menu>
  )
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

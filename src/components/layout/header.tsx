import React, { PropsWithChildren, useMemo, useState } from 'react'
import {
  useSetLocale,
  useTranslate,
  useGetIdentity,
  useGo,
  useResource,
  useLogout,
} from '@refinedev/core'
import {
  Avatar,
  Dropdown,
  Button,
  DropdownOption,
  Radio,
  SelectInput,
  Menu,
} from 'tdesign-react/esm'
import { TranslateIcon, SearchIcon } from 'tdesign-icons-react'
import { useAppStore } from '../../stores/app'
import { userMenuItem } from '../../core/config'
import { DuxLogo } from '../logo'
import { useCanHelper } from '../../provider'
import { useModuleContext } from '../../core/module'
const { HeadMenu, MenuItem } = Menu

interface UserProps {
  menu?: userMenuItem[]
}

const User = ({ menu = [] }: UserProps) => {
  const { data } = useGetIdentity<{
    userInfo: Record<string, any>
  }>()
  const go = useGo()
  const translate = useTranslate()
  const { mutate: logout } = useLogout()

  const options = useMemo(() => {
    const optionData = menu.map((item) => {
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
    <Dropdown options={options} minColumnWidth={150}>
      <div className='flex items-center gap-2 leading-5'>
        <Avatar image={data?.userInfo?.avatar} />
        <div className='hidden md:flex flex-col'>
          <div>{data?.userInfo?.nickname}</div>
        </div>
      </div>
    </Dropdown>
  )
}

const Lang = () => {
  const changeLanguage = useSetLocale()

  const options: DropdownOption[] = [
    {
      value: 'en',
      content: 'English',
      prefixIcon: <div>🇬🇧</div>,
    },
    {
      value: 'zh',
      content: '中文',
      prefixIcon: <div>🇨🇳</div>,
    },
  ]

  return (
    <Dropdown
      minColumnWidth={150}
      options={options}
      onClick={(data) => {
        changeLanguage(data.value as string)
        window.location.reload()
      }}
    >
      <Button variant='text'>
        <TranslateIcon />
      </Button>
    </Dropdown>
  )
}

const Dark = () => {
  const switchDark = useAppStore((state) => state.switchDark)
  const dark = useAppStore((state) => state.dark)
  return (
    <Radio.Group
      variant='default-filled'
      value={dark ? 'dark' : 'light'}
      onChange={() => {
        switchDark()
      }}
    >
      <Radio.Button value='light'>
        <div className='i-tabler:sun h-3 w-3 text-warning'></div>
      </Radio.Button>
      <Radio.Button value='dark'>
        <div className='i-tabler:moon h-3 w-3 text-primary'></div>
      </Radio.Button>
    </Radio.Group>
  )
}

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

const Item = ({ children }: PropsWithChildren) => {
  return <div className='px-2 flex items-center'>{children}</div>
}

interface HeaderProps {
  userMenu?: userMenuItem[]
}

const Header = ({ userMenu }: HeaderProps) => {
  return (
    <>
      <HeadMenu
        className='border-b border-component'
        logo={<DuxLogo className='w-14 md:hidden ml-4' />}
        operations={
          <>
            <Item>
              <Dark />
            </Item>
            <Item>
              <Lang />
            </Item>
            <Item>
              <User menu={userMenu} />
            </Item>
          </>
        }
      >
        <div className='items-center hidden md:flex w-50'>
          <Search />
        </div>
      </HeadMenu>
      {/* <div className='md:hidden flex h-16  flex-none border-b px-3 bg-container border-b border-component items-center'>
        <div>
          <Lang />
        </div>
        <div className='flex-1 flex justify-center'>
          <DuxLogo className='w-14' />
        </div>
        <Item>
          <User menu={userMenu} />
        </Item>
      </div>
      <div className='hidden md:flex h-16  flex-none border-b px-3 bg-container border-component justify-between'>
        <div className=' items-center md:flex w-50'>
          <Search />
        </div>
        <div className='flex items-center justify-end'>
          <Item>
            <Dark />
          </Item>
          <Item>
            <Lang />
          </Item>
          <Item>
            <User menu={userMenu} />
          </Item>
        </div>
      </div> */}
    </>
  )
}

export default Header

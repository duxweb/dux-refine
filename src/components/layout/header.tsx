import React, { PropsWithChildren, useMemo, useState } from 'react'
import { useSetLocale, useTranslate, useGetIdentity, useGo, useResource } from '@refinedev/core'
import { Avatar, Dropdown, Button, DropdownOption, Radio, SelectInput } from 'tdesign-react/esm'
import { TranslateIcon, SearchIcon } from 'tdesign-icons-react'
import { useAppStore } from '../../stores/app'
import { userMenuItem } from '../../core/config'
import { DuxLogo } from '../logo'

interface UserProps {
  menu?: userMenuItem[]
}

const User = ({ menu = [] }: UserProps) => {
  const { data } = useGetIdentity<{
    userInfo: Record<string, any>
  }>()
  const go = useGo()
  const translate = useTranslate()

  const options = useMemo(() => {
    return menu.map((item) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu])

  return (
    <Dropdown options={options}>
      <div className='flex items-center gap-2'>
        <Avatar image={data?.userInfo?.avatar} />
        <div className='flex flex-col'>
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
      options={options}
      onClick={(data) => {
        changeLanguage(data.value as string)
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

const Item = ({ children }: PropsWithChildren) => {
  return <div className='flex cursor-pointer items-center gap-2 px-2'>{children}</div>
}

interface HeaderProps {
  userMenu?: userMenuItem[]
}

const Header = ({ userMenu }: HeaderProps) => {
  const translate = useTranslate()
  const { resources } = useResource()
  const go = useGo()
  const [popupVisible, setPopupVisible] = useState(false)

  const data = useMemo(() => {
    return resources
      .filter((item) => {
        return !!item.list
      })
      .map((item) => {
        return {
          label: translate(`${item.meta?.label}.name`),
          route: item.list as string,
        }
      })
  }, [resources, translate])

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
    <div className='h-16 flex flex-none border-b px-3 bg-container border-component justify-between'>
      <div className='flex items-center md:hidden'>
        <DuxLogo className='w-14' />
      </div>
      <div className='hidden items-center md:flex w-50'>
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
                    className='px-4 py-1 text-primary hover:bg-brand hover:text-while-1 rounded cursor-pointer'
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
    </div>
  )
}

export default Header

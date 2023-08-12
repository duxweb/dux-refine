import { PropsWithChildren } from 'react'
import { useSetLocale, useTranslate, useGetIdentity } from '@refinedev/core'
import { Avatar, Dropdown, Button, DropdownOption, Radio } from 'tdesign-react/esm'
import { TranslateIcon, SearchIcon } from 'tdesign-icons-react'
import { useAppStore } from '@/stores/app'

const User = () => {
  const { data } = useGetIdentity<{
    userInfo: Record<string, any>
  }>()
  return (
    <>
      <Avatar image='https://tdesign.gtimg.com/site/avatar.jpg' shape='circle' />
      <div className='flex flex-col'>
        <div>{data?.userInfo?.nickname}</div>
      </div>
    </>
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
      <Button variant='text' shape='circle'>
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
      size='small'
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

const Header = () => {
  const translate = useTranslate()
  return (
    <div className='h-16 flex flex-none border-b px-3 bg-container border-component'>
      <div className='flex flex-1 items-center'>
        <div className='ml-6 h-8 max-w-50 w-full flex cursor-pointer border rounded px-2 text-sm transition-all bg-component border-transparent hover:border hover:bg-secondarycontainer hover:border-brand'>
          <div className='flex flex-1 items-center text-placeholder'>
            {translate('common.search')}...
          </div>
          <div className='flex items-center'>
            <SearchIcon size={16} />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <Item>
          <Dark />
        </Item>
        <Item>
          <Lang />
        </Item>
        <Item>
          <User />
        </Item>
      </div>
    </div>
  )
}

export default Header

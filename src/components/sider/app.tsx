import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslate, useGo, useGetIdentity, useLogout, useSetLocale } from '@refinedev/core'
import { Menu, Button, Dropdown, Avatar, DropdownOption, Input } from 'tdesign-react/esm'
import { useKBar } from 'kbar'
import { useModuleContext } from '../../core/module'
import { useAppStore } from '../../stores'
import { MenuItemProps } from './menu'
import { DuxLogo } from '../logo'
import { Icon } from 'tdesign-icons-react'

export interface SiderAppProps {
  menuData: MenuItemProps[]
  defaultOpenKeys: string[]
}

export const SiderApp = ({ defaultOpenKeys, menuData }: SiderAppProps) => {
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
    <div className='flex h-screen'>
      <div className='flex flex-col w-[80px] bg-component border-r border-component'>
        <div className='py-8 flex justify-center flex-none'>
          <DuxLogo className='h-4' />
        </div>

        <div className='flex-1 h-1 flex flex-col overflow-y-auto gap-1 px-1'>
          <div className='flex flex-col gap-0.5 justify-center items-center text-secondary'>
            <div className='i-tabler:home text-[22px]'></div>
            <div className='text-sm'>仪表盘</div>
          </div>
        </div>

        <div className='flex-none'>user</div>
      </div>
      <div className='flex flex-col w-[190px] bg-white divide-y divide-gray-3 px-3 text-sm'>
        <div className='pb-4 pt-2'>
          <div className='text-sm text-placeholder py-4 px-4'>文章管理</div>
          <div className='flex flex-col '>
            <div className='flex gap-2 py-3 px-4 items-center rounded bg-brand-1 text-brand-7'>
              <Icon name='list' size='20px' />
              文章管理
            </div>
            <div className='flex gap-2 py-3 px-4 items-center rounded'>
              <Icon name='list' size='20px' />
              文章内容
            </div>
          </div>
        </div>

        <div className='pb-4 pt-2'>
          <div className='text-sm text-placeholder py-4 px-4'>文章管理</div>
          <div className='flex flex-col '>
            <div className='flex gap-2 py-3 px-4 items-center rounded'>
              <Icon name='list' size='20px' />
              文章管理
            </div>
            <div className='flex gap-2 py-3 px-4 items-center rounded'>
              <Icon name='list' size='20px' />
              文章内容
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

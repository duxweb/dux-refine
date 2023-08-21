import { useGo, useTranslate } from '@refinedev/core'
import clsx from 'clsx'
import { useState } from 'react'
import { TabMenu } from './menu'
import { tabBarItem } from '../../core/config'

interface TabBarProps {
  data: tabBarItem[]
}
export const TabBar = ({ data }: TabBarProps) => {
  const go = useGo()
  const [open, setOpen] = useState(false)
  const translate = useTranslate()

  return (
    <>
      <div className='h-15 flex justify-between border-t bg-container border-component md:hidden'>
        {data?.map((item, index) => (
          <TabBarItem
            key={index}
            name={translate(`${item.label}.name`)}
            icon={item.icon}
            onClick={() => {
              go({
                to: item.route,
              })
            }}
          />
        ))}
        <TabBarItem
          name={translate('common.more')}
          icon={'i-tabler:dots'}
          onClick={() => {
            setOpen(!open)
          }}
        />
      </div>
      <div className='md:hidden'>{open && <TabMenu close={() => setOpen(false)} />}</div>
    </>
  )
}

interface TabBarItemProps {
  name: string
  icon: string
  active?: boolean
  onClick?: () => void
}
const TabBarItem = ({ name, icon, active, onClick }: TabBarItemProps) => {
  return (
    <>
      <div
        className={clsx([
          'flex flex-1 flex-col items-center p-2 hover:text-brand cursor-pointer',
          active ? 'text-brand' : '',
        ])}
        onClick={onClick}
      >
        <div className={clsx(['h-5 w-5', icon])}></div>
        <div className='text-sm'>{name}</div>
      </div>
    </>
  )
}

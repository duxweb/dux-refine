import React, { useState } from 'react'
import { DuxLogo } from '../logo'
import { useWindowSize } from '../../core'
import { Button, Menu } from 'tdesign-react/esm'
import { MoreIcon, Icon } from 'tdesign-icons-react'
import { TabMenu } from './menu'
import clsx from 'clsx'
const { HeadMenu } = Menu

interface HeaderProps {
  actions?: React.ReactNode
  children?: React.ReactNode
  title?: React.ReactNode
  icon?: string
}

const Header = ({ title, icon, actions, children }: HeaderProps) => {
  const [size, sizeMap] = useWindowSize()
  const [open, setOpen] = useState(false)
  return (
    <>
      <HeadMenu
        className='border-b border-component'
        logo={size <= sizeMap.md && <DuxLogo className='w-14 md:hidden ml-4' />}
        operations={
          size > sizeMap.md ? (
            <div className='md:flex gap-2 items-center'>{actions}</div>
          ) : (
            <Button shape='square' variant='text'>
              <MoreIcon onClick={() => setOpen(true)} />
            </Button>
          )
        }
      >
        {size > sizeMap.md &&
          (children || (
            <div className='flex items-center gap-2'>
              {icon ? (
                icon?.includes('i-') ? (
                  <div className={clsx(['t-icon', icon])}></div>
                ) : (
                  <Icon name={icon} />
                )
              ) : (
                ''
              )}

              <div className='text-base'>{title}</div>
            </div>
          ))}
      </HeadMenu>
      {open && <TabMenu close={() => setOpen(false)} />}
    </>
  )
}

export default Header

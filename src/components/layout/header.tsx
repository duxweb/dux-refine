import React, { useState } from 'react'
import { DuxLogo } from '../logo'
import { useModuleContext, useWindowSize } from '../../core'
import { Button, Menu } from 'tdesign-react/esm'
import { MoreIcon, Icon } from 'tdesign-icons-react'
import { TabMenu } from './menu'
import clsx from 'clsx'
import { useAppStore } from '../../stores'
const { HeadMenu } = Menu

interface HeaderProps {
  actions?: React.ReactNode
  children?: React.ReactNode
  title?: React.ReactNode
}

const Header = ({ title, actions, children }: HeaderProps) => {
  const [size, sizeMap] = useWindowSize()
  const [open, setOpen] = useState(false)
  const module = useModuleContext()
  const dark = useAppStore((state) => state.dark)
  const siderHidden = useAppStore((state) => state.siderHidden)
  const switchSiderHidden = useAppStore((state) => state.switchSiderHidden)

  return (
    <>
      <HeadMenu
        className='border-b border-component'
        logo={
          size <= sizeMap.md ? (
            module.config?.appLogo ? (
              <img
                src={
                  dark ? module.config?.appDarkLogo || module.config.appLogo : module.config.appLogo
                }
                className='h-4 md:hidden ml-4'
              />
            ) : (
              <DuxLogo className='w-14 md:hidden ml-4' />
            )
          ) : undefined
        }
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
              <Button
                onClick={() => switchSiderHidden()}
                theme='default'
                variant='text'
                shape='circle'
                icon={
                  <div
                    className={clsx([
                      'w-5 h-5',
                      siderHidden
                        ? 'i-tabler:layout-sidebar-right-collapse'
                        : 'i-tabler:layout-sidebar-left-collapse',
                    ])}
                  ></div>
                }
              ></Button>

              <div className='text-base'>{title}</div>
            </div>
          ))}
      </HeadMenu>
      {open && <TabMenu close={() => setOpen(false)} />}
    </>
  )
}

export default Header

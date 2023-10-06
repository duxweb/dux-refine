import React, { PropsWithChildren } from 'react'
import Header from '../layout/header'
import { Breadcrumb } from '../layout'
import { useResource, useTranslate } from '@refinedev/core'
interface MainProps extends PropsWithChildren {
  title?: React.ReactNode
  icon?: React.ReactNode
  header?: React.ReactNode
  actions?: React.ReactNode
}
export const Main = ({ title, icon, header, actions, children }: MainProps) => {
  const { resource } = useResource()
  const translate = useTranslate()
  return (
    <>
      <Header
        title={
          title ||
          (resource?.meta?.label
            ? translate(`${resource?.meta?.label}.name`, resource?.meta?.label)
            : '')
        }
        icon={typeof icon == 'string' ? icon : undefined}
        actions={actions}
      >
        {header}
      </Header>
      <div className='flex-1 overflow-auto'>
        <div className='p-4'>
          <div className='mb-4'>
            <Breadcrumb />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

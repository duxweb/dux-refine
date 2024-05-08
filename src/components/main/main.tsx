import React, { PropsWithChildren } from 'react'
import Header from '../layout/header'
import { Breadcrumb } from '../layout'
import { useResource, useTranslate } from '@refinedev/core'
interface MainProps extends PropsWithChildren {
  title?: React.ReactNode
  header?: React.ReactNode
  actions?: React.ReactNode
}
export const Main = ({ title, header, actions, children }: MainProps) => {
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
        actions={actions}
      >
        {header}
      </Header>
      <div className='flex-1 overflow-auto flex flex-col p-4'>
        <div className='mb-4 flex-none'>
          <Breadcrumb />
        </div>
        {children}
      </div>
    </>
  )
}

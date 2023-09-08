import React, { PropsWithChildren } from 'react'
import Header from '../layout/header'
interface MainProps extends PropsWithChildren {
  title?: React.ReactNode
  icon?: React.ReactNode
  header?: React.ReactNode
  actions?: React.ReactNode
}
export const Main = ({ title, icon, header, actions, children }: MainProps) => {
  return (
    <>
      <Header title={title} icon={icon} actions={actions}>
        {header}
      </Header>
      <div className='flex-1 overflow-auto'>
        <div className='p-4'>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

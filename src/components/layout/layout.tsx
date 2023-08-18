import React, { PropsWithChildren } from 'react'
import Header from './header'
import { Sider } from '../sider'
import { TabBar } from '../tabbar/tabbar'

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='inset-0 h-screen w-screen flex flex-row overflow-hidden'>
      <Sider />

      <div className='w-1 flex flex-1 flex-col'>
        <Header />
        <div className='flex-1 overflow-auto'>{children}</div>
        <TabBar />
      </div>
    </div>
  )
}

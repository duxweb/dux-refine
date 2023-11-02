import React from 'react'
import { SiderCollapse } from '../sider'
import { siderType } from '../../core/config'

export interface LayoutProps {
  siderType?: siderType
  children?: React.ReactNode
}

export const Layout = ({ children, siderType = 'collapse' }: LayoutProps) => {
  return (
    <div className='inset-0 h-screen w-screen flex flex-row overflow-hidden'>
      <div className='app-sider-collapse   hidden md:block'>
        <SiderCollapse type={siderType} col={true} />
      </div>
      <div className='w-1 flex flex-1 flex-col'>{children}</div>
    </div>
  )
}

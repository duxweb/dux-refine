import React, { PropsWithChildren } from 'react'
import { Breadcrumb } from '../layout'

export const MainHeader: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='mb-4 flex items-center justify-between'>
      <Breadcrumb />
      <div className='flex flex-col md:flex-row gap-2'>{children}</div>
    </div>
  )
}

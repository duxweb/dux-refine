import React, { ReactNode} from 'react'
import { Card } from 'tdesign-react/esm'

interface StatsPieProps {
  icon?: string
  name?: string
  children?: ReactNode
  data?: ReactNode
}

export const StatsChart = ({ name, icon, data, children }: StatsPieProps) => {
  return (
    <Card bordered>
      <div className='flex flex-col gap-2'>
        <div className='text-sm'>{name}</div>
        <div className='text-3xl font-bold'>{data}</div>
        <div>{children}</div>
      </div>
    </Card>
  )
}

import { ReactNode } from 'react'
import { Card, Statistic } from 'tdesign-react/esm'

export interface StatsSimpleCardProps {
  isLoading?: boolean
  value?: number
  title?: string
  unit?: string
  icon?: ReactNode
}
export const StatsSimpleCard = ({ isLoading, title, value, unit, icon }: StatsSimpleCardProps) => {
  return (
    <Card>
      <div className='flex'>
        <div className='flex flex-1 flex-col gap-1 text-sm'>
          <Statistic
            loading={isLoading}
            title={title}
            value={value || 0}
            unit={unit}
            trendPlacement='right'
          />
        </div>
        <div className='flex items-center justify-center'>{icon}</div>
      </div>
    </Card>
  )
}

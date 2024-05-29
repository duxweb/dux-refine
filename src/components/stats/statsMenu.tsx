import { clsx } from 'clsx'
import { StatsColorClass, StatsColorName } from './statsColor'

export interface StatsMenuProps {
  color?: StatsColorName
  title?: string
  desc?: string
  icon?: string
  onClick?: () => void
}
export const StatsMenuCard = ({ color = 'blue', title, desc, icon, onClick }: StatsMenuProps) => {
  return (
    <div
      className='flex cursor-pointer items-center gap-4 rounded bg-gray-50 p-4 transition-all dark:bg-gray-12 hover:bg-gray-100 hover:dark:bg-gray-11'
      onClick={onClick}
    >
      <div className={clsx(['rounded-full p-3', StatsColorClass(color)])}>
        <div className={clsx(['h-6 w-6', icon])}></div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-base'>{title}</div>
        <div className='text-sm text-placeholder'>{desc}</div>
      </div>
    </div>
  )
}

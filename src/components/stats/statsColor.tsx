import { clsx } from 'clsx'

export type StatsColorName = 'red' | 'orange' | 'green' | 'blue' | 'pink' | 'cyan'

export interface StatsColorProps {
  color?: StatsColorName
  value?: number | string
  title?: string
  icon?: string
}

export const StatsColorClass = (color: string) => {
  switch (color) {
    case 'red':
      return 'bg-error-2 text-error'
    case 'orange':
      return 'bg-warning-2 text-warning'
    case 'green':
      return 'bg-success-2 text-success'
    case 'blue':
      return 'bg-brand-2 text-brand'
    case 'pink':
      return 'bg-pink-1 text-pink-6 dark:bg-pink-9 dark:text-pink-5'
    case 'cyan':
      return 'bg-cyan-1 text-cyan-6 dark:bg-cyan-9 dark:text-cyan-5'
  }
}

export const StatsColorCard = ({ color = 'blue', title, value, icon }: StatsColorProps) => {
  return (
    <div className='flex items-center gap-4 rounded bg-gray-50 p-4 transition-all dark:bg-gray-12 hover:bg-gray-100 hover:dark:bg-gray-11'>
      <div className={clsx(['rounded-full p-3', StatsColorClass(color)])}>
        <div className={clsx(['h-6 w-6', icon])}></div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm text-placeholder'>{title}</div>
        <div className='text-2xl font-bold'>{value}</div>
      </div>
    </div>
  )
}

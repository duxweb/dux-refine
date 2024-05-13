import clsx from 'clsx'
import { ReactNode, useState } from 'react'
import { Button } from 'tdesign-react/esm'

export interface CardSiderProps {
  title?: ReactNode
  className?: string
  classWidth?: string
  width?: string | number
  tools?: ReactNode
  children?: ReactNode
}

export const CardSider = ({ title, className, classWidth, tools, children }: CardSiderProps) => {
  const [collapse, setCollapse] = useState<boolean>(true)

  return (
    <div
      className={clsx([
        'relative lg:border-r  border-component lg:flex-none',
        collapse ? 'lg:pr-6' : 'lg:pr-2',
        className,
      ])}
    >
      <Button
        className={clsx([
          'hidden lg:inline-flex  absolute top-50% -right-3 -mt-3 transition-all bg-white dark:bg-gray-12',
          collapse ? 'rotate-0' : 'rotate-180',
        ])}
        action='create'
        variant='outline'
        shape='circle'
        theme='default'
        size='small'
        icon={<div className='i-tabler:chevron-left' />}
        onClick={() => setCollapse((v) => !v)}
      />
      <div
        className={clsx([
          'w-full overflow-hidden transition-all ',
          collapse ? `${classWidth || 'lg:w-50'} lg:opacity-100` : 'lg:w-0 lg:opacity-0',
        ])}
      >
        <div className={clsx(['w-full', classWidth || 'lg:w-50'])}>
          <div className='flex flex-1 items-center justify-between gap-2 border-b px-0 lg:py-1.8 pb-2 font-bold border-component'>
            <div className='flex items-center gap-2 pl-2'>
              {title}
              <Button
                className={clsx(['inline-flex lg:hidden', collapse ? 'rotate-0' : 'rotate-180'])}
                action='create'
                variant='text'
                shape='circle'
                theme='default'
                icon={<div className='i-tabler:chevron-up' />}
                onClick={() => setCollapse((v) => !v)}
              />
            </div>
            <div className='flex'>{tools}</div>
          </div>

          <div className={clsx('mt-2 transition-all lg:h-auto', collapse ? 'h-auto' : 'h-0')}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

import clsx from 'clsx'
import { ReactNode } from 'react'

export interface CardProps {
  className?: string
  border?: boolean
  headerBorder?: boolean
  header?: ReactNode
  title?: ReactNode
  children?: ReactNode
  headerPadding?: boolean
  padding?: boolean
}

export const Card = ({
  className,
  border,
  headerBorder,
  header,
  title,
  children,
  headerPadding = true,
  padding = true,
}: CardProps) => {
  return (
    <div
      className={clsx([
        'rounded-md bg-container',
        border ? 'border border-container' : 'shadow-sm',
        className,
      ])}
    >
      {(header || title) && (
        <div
          className={clsx([
            headerPadding ? 'px-4 py-3' : '',
            headerBorder ? 'border-b border-component' : '',
          ])}
        >
          {header || <div className='text-lg font-bold'>{title}</div>}
        </div>
      )}
      <div className={clsx([padding ? 'p-4' : ''])}>{children}</div>
    </div>
  )
}

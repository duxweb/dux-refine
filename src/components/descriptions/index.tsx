import clsx from 'clsx'
import React, { forwardRef, useMemo, ReactNode, ForwardedRef, ReactElement } from 'react'
import { Skeleton } from 'tdesign-react/esm'
import './style.css'

export interface DescriptionsProps {
  title?: ReactNode
  loading?: boolean
  children?: ReactNode
  border?: boolean
  column?: number
  direction?: 'horizontal' | 'vertical'
  className?: string
  align?: 'left' | 'right'
}

export interface DescriptionsItemProps {
  label?: ReactNode
  children?: ReactNode
  className?: string
  labelClassName?: string
  contentClassName?: string
}

export interface DescriptionsLayoutProps {
  border?: boolean
  direction?: 'horizontal' | 'vertical'
  align?: 'left' | 'right'
  children: ReactNode
}

const DescriptionsComp = (
  {
    title,
    children,
    border,
    column = 1,
    loading = false,
    direction = 'horizontal',
    className = '',
    align = 'left',
  }: DescriptionsProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const data = useMemo(() => {
    const childArray = React.Children.toArray(children) as ReactElement[]
    const groupedChildren = childArray.reduce((grouped: ReactElement[][], child, i) => {
      const isDescriptionsItem =
        React.isValidElement(child) &&
        (child.type as React.FunctionComponent).displayName === 'DescriptionsItem'
      if (!isDescriptionsItem) {
        return grouped
      }
      if (i % column === 0) {
        grouped.push([])
      }
      grouped[grouped.length - 1].push(child)
      return grouped
    }, [])
    return groupedChildren
  }, [children, column])

  return (
    <div className={className} ref={ref}>
      {title && <div className='text-lg'>{title}</div>}

      <Skeleton theme='paragraph' loading={loading}>
        <div className={clsx(['app-descriptions', border ? 'app-descriptions-border' : ''])}>
          {data?.map((col, i) => (
            <DescriptionsLayout key={i} border={border} direction={direction} align={align}>
              {col}
            </DescriptionsLayout>
          ))}
        </div>
      </Skeleton>
    </div>
  )
}

const DescriptionsLayout: React.FC<DescriptionsLayoutProps> = ({
  border,
  direction,
  align,
  children,
}) => {
  return (
    <ul
      className={clsx([
        'app-descriptions-list',
        border ? 'app-descriptions-border' : '',
        direction === 'vertical' ? 'app-descriptions-vertical' : '',
        direction === 'horizontal' ? 'app-descriptions-horizontal' : '',
        align === 'right' ? 'app-descriptions-right' : '',
      ])}
    >
      {children}
    </ul>
  )
}

const DescriptionsItem: React.FC<DescriptionsItemProps> = ({
  label,
  children,
  className,
  labelClassName,
  contentClassName,
}) => {
  return (
    <li className={clsx(['app-descriptions-item', className])}>
      <div className={clsx(['app-descriptions-label', labelClassName])}>{label}</div>
      <div className={clsx(['app-descriptions-content', contentClassName])}>{children}</div>
    </li>
  )
}

DescriptionsItem.displayName = 'DescriptionsItem'

export const Descriptions = forwardRef(DescriptionsComp) as React.ForwardRefExoticComponent<
  DescriptionsProps & React.RefAttributes<HTMLDivElement>
> & {
  Item: typeof DescriptionsItem
}

Descriptions.Item = DescriptionsItem

import clsx from 'clsx'

export interface ListProps {
  className?: string
  children?: React.ReactNode
}
export const List = ({ className, children }: ListProps) => {
  return <div className={clsx(['flex flex-col gap-4', className])}>{children}</div>
}

export interface ListItemProps {
  className?: string
  children?: React.ReactNode
  append?: React.ReactNode
}
const ListItem = ({ children, append }: ListItemProps) => {
  return (
    <div className='flex items-center gap-4'>
      <div className='flex-1'>{children}</div>
      <div className='flex-none'>{append}</div>
    </div>
  )
}

List.Item = ListItem

import { PropsWithChildren } from 'react'

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='p-4'>
      <div>{children}</div>
    </div>
  )
}

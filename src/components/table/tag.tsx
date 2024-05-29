import { useMemo } from 'react'
import { Tag } from 'tdesign-react/esm'

interface ColumnTagProps {
  theme: 'primary' | 'success' | 'danger' | 'warning'
  children?: React.ReactNode
}

export const ColumnTag = ({ theme, children }: ColumnTagProps) => {
  const icon = useMemo(() => {
    switch (theme) {
      case 'primary':
        return <div className='t-icon i-tabler:info-circle-filled'></div>
      case 'success':
        return <div className='t-icon i-tabler:circle-check-filled'></div>
      case 'danger':
        return <div className='t-icon i-tabler:circle-x-filled'></div>
      case 'warning':
        return <div className='t-icon i-tabler:info-circle-filled'></div>
    }
  }, [theme])

  return (
    <Tag shape='round' theme={theme} variant='light-outline' icon={icon}>
      {children}
    </Tag>
  )
}

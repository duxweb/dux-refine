import { Card, Statistic, Tag } from 'tdesign-react/esm'
import clsx from 'clsx'

export interface StatsContrastProps {
  isLoading?: boolean
  value?: number | string
  contrast?: number | string
  rate?: number
  title?: string
  currentTtitle?: string
  contrastTitle?: string
  contrastRateTitle?: string
  footTitle?: string
  footValue?: number | string
}

export const StatsContrastCard = ({
  isLoading,
  title,
  contrastTitle,
  contrastRateTitle,
  currentTtitle,
  footTitle,
  footValue,
  value,
  contrast,
  rate = 0,
}: StatsContrastProps) => {
  return (
    <Card
      title={title}
      headerBordered
      actions={
        <Tag theme='primary' variant='outline'>
          {currentTtitle}
        </Tag>
      }
      footer={
        <div className='flex justify-between text-placeholder border-component'>
          <div>{footTitle}</div>
          <div>{footValue}</div>
        </div>
      }
    >
      <div className='flex items-start gap-4'>
        <Statistic
          value={value as number}
          loading={isLoading}
          extra={
            <div className='flex gap-4'>
              <div>{contrastTitle}</div>
              <div>{contrast}</div>
              <div>{contrastRateTitle}</div>
              <div
                className={clsx(['flex items-center gap-1 ', rate ? 'text-error' : 'text-success'])}
              >
                {rate > 0 ? (
                  <div className='i-tabler:arrow-narrow-up'></div>
                ) : (
                  <div className='i-tabler:arrow-narrow-down'></div>
                )}
                <div>{rate || 0}%</div>
              </div>
            </div>
          }
        ></Statistic>
      </div>
    </Card>
  )
}

import clsx from 'clsx'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Card, Skeleton } from 'tdesign-react/esm'

interface StatsCardProps {
  icon: string
  name: string
  children?: ReactNode
  data?: any[]
}

export const StatsCard = ({ name, icon, data, children }: StatsCardProps) => {
  const calcGrowthRate = useCallback((pre: number, cur: number) => {
    const growthRate = (cur - pre) / pre
    let status
    if (growthRate > 0) {
      status = 'increase'
    } else if (growthRate < 0) {
      status = 'decrease'
    } else {
      status = 'equal'
    }
    return [(!growthRate ? 0 : growthRate * 100).toFixed(2), status]
  }, [])

  const [info, setInfo] = useState<Record<string, any> | undefined>()

  useEffect(() => {
    if (!data) {
      return
    }

    const lastValue = data.slice(-1)?.[0] || 0
    const pervValue = data.slice(-2, -1)?.[0] || 0
    console.log(pervValue, lastValue)

    const [rate, rateStatus] = calcGrowthRate(pervValue, lastValue)

    setInfo({
      lastValue,
      pervValue,
      rate,
      rateStatus,
    })
  }, [calcGrowthRate, data])

  return (
    <Card bordered>
      <div className='flex items-center'>
        <div className='flex flex-1 flex-col'>
          <div className='flex items-center gap-2 text-primary'>
            <div className={clsx(['h-5 w-5', icon])}></div>
            <div className='text-sm'>{name}</div>
          </div>
          <div className='my-3 flex items-center'>
            <div className='h-9 flex flex-1 items-center gap-2'>
              <div className='text-3xl font-bold'>
                {!info ? (
                  <Skeleton className='w-15' theme='text'>
                    {' '}
                  </Skeleton>
                ) : (
                  info?.lastValue
                )}
              </div>
              {info && (
                <>
                  {info?.rateStatus == 'equal' && (
                    <div className='i-tabler:minus h-6 w-6 text-warning'></div>
                  )}
                  {info?.rateStatus == 'increase' && (
                    <div className='i-tabler:trending-up h-6 w-6 text-success'></div>
                  )}
                  {info?.rateStatus == 'decrease' && (
                    <div className='i-tabler:trending-down h-6 w-6 text-error'></div>
                  )}
                </>
              )}
            </div>
            <div className='h-10 w-30 flex-none'>{children}</div>
          </div>
          <div className='flex gap-2'>
            {(info?.rateStatus == 'equal' || !info) && <div className='text-warning'>0%</div>}
            {info?.rateStatus == 'increase' && <div className='text-success'>{info?.rate}%</div>}
            {info?.rateStatus == 'decrease' && <div className='text-error'>{info?.rate}%</div>}
            <div className='text-placeholder'>from last month</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

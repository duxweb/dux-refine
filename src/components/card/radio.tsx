import { useControllableValue } from 'ahooks'
import clsx from 'clsx'

export interface CardRadioOption {
  title?: string
  desc?: string
  value?: any
}

export interface CardRadioProps {
  width?: string | number
  options: CardRadioOption[]
  value?: any
  defaultValue?: any
  onChange?: (value: any) => void
}

export const CardRadio = ({ width = '200px', options, ...props }: CardRadioProps) => {
  const [value, setValue] = useControllableValue<any>(props)
  return (
    <div className='flex flex-row gap-4 flex-warp'>
      {options?.map((item, key) => (
        <div
          key={key}
          className={clsx([
            'overflow w-full lg:w-50  flex-wrap flex flex-col gap-1 border rounded px-4 py-4 text-center relative cursor-default',
            item?.value === value ? 'border-brand' : 'border-component',
          ])}
          style={{
            width: width,
          }}
          tabIndex={0}
          role='radio'
          aria-checked={value === item?.value}
          onClick={() => {
            setValue(() => {
              return item.value as any
            })
          }}
        >
          <div className='text-sm'>{item?.title}</div>
          <div className='text-xs text-secondary'>{item?.desc}</div>
          {item?.value === value ? (
            <>
              <div className='absolute right-0 top-0 border-l-24 border-t-24 border-l-transparent border-t-brand'></div>
              <div className='i-tabler:check absolute right-0 top-0 text-sm text-white'></div>
            </>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  )
}

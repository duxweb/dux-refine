import { useControllableValue } from 'ahooks'
import clsx from 'clsx'

export interface CardCheckboxOption {
  title?: string
  desc?: string
  value?: any
}

export interface CardCheckboxProps {
  width?: string | number
  options: CardCheckboxOption[]
  value?: any[]
  defaultValue?: any[]
  onChange?: (value: any[]) => void
}

export const CardCheckbox = ({ width = '170px', options, ...props }: CardCheckboxProps) => {
  const [value, setValue] = useControllableValue<any[]>(props)
  return (
    <div className='flex flex-row gap-4 flex-warp'>
      {options?.map((item, key) => (
        <div
          key={key}
          className={clsx([
            'overflow w-full flex flex-wrap flex-col gap-1 border rounded px-4 py-4 text-center relative cursor-default',
            value?.includes?.(item?.value) ? 'border-brand' : 'border-component',
          ])}
          style={{
            width: width,
          }}
          tabIndex={0}
          role='checkbox'
          aria-checked={value?.includes?.(item?.value)}
          onClick={() => {
            setValue((v) => {
              if (!v) {
                return [item.value]
              }
              if (v?.includes?.(item.value)) {
                return v.filter((n) => n !== item.value)
              } else {
                return [...v, item.value]
              }
            })
          }}
        >
          <div className='text-sm'>{item?.title}</div>
          <div className='text-xs text-secondary'>{item?.desc}</div>
          {value?.includes?.(item.value) ? (
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

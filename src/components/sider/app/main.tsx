import clsx from 'clsx'
import { Tooltip } from 'tdesign-react/esm'
import { useGo, useLogout, useTranslate } from '@refinedev/core'
import { DuxLogo } from '../../logo'
import { useSiderContext } from '../app'

export const Main = () => {
  return (
    <div className='h-screen w-18 flex flex-col border-r bg-container border-component'>
      <SiderLogo />
      <SiderMenu />
      <SiderFooter />
    </div>
  )
}

const SiderFooter = () => {
  const { mutate: logout } = useLogout()
  const translate = useTranslate()
  return (
    <ul className='mb-2  flex-none flex flex-1 flex-col items-center gap-3 p-2 text-secondary'>
      <SiderMenuItem
        name={translate(`common.logout`)}
        icon='i-tabler:logout-2'
        onClick={() => {
          logout()
        }}
      />
    </ul>
  )
}

const SiderLogo = () => {
  return (
    <div className='h-16 flex items-center justify-center gap-2'>
      <DuxLogo className='w-12' />
    </div>
  )
}

const SiderMenu = () => {
  const { active, setActive, setCollapse, menuData } = useSiderContext()
  const go = useGo()
  const translate = useTranslate()

  return (
    <ul className='mt-6 flex flex-1 h-1 overflow-auto flex-col items-center gap-3 p-2 text-secondary'>
      {menuData?.map((item) => {
        return (
          <SiderMenuItem
            key={item.name}
            name={translate(`${item.label}.name`) || item?.label}
            icon={item.icon}
            active={active[active.length - 1] == item.key}
            onClick={() => {
              if (active[active.length - 1] !== item.key) {
                setActive([item.key])
                setCollapse(true)
              } else {
                setCollapse((status: boolean) => !status)
              }
              if (item.route) {
                go({
                  to: item.route,
                })
              }
            }}
          />
        )
      })}
    </ul>
  )
}

interface MenuAppProps {
  name: string
  icon: string
  active?: boolean
  onClick?: () => void
}
const SiderMenuItem = ({ name, icon, active, onClick }: MenuAppProps) => {
  return (
    <li>
      <Tooltip
        content={name}
        destroyOnClose
        duration={0}
        placement='right'
        showArrow
        theme='default'
      >
        <div
          className={clsx([
            'flex items-center justify-center rounded px-2.5 py-1.5 hover:bg-brand-1 cursor-pointer',
            active ? 'bg-brand text-white hover:bg-brand hover:text-white' : '',
          ])}
          onClick={onClick}
        >
          <div className={clsx(['h-5 w-5', icon])}></div>
        </div>
      </Tooltip>
    </li>
  )
}

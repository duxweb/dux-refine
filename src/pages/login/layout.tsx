import { useTranslate } from '@refinedev/core'
import { useAppStore } from '../../stores/app'
import { DuxLogo } from '../../components/logo'
import banner from '../../../assets/loginBanner.svg'
import { useModuleContext } from '../../core/module'

interface LoginLayoutProps {
  title?: string
  children?: React.ReactNode
}

export const LoginLayout = ({ title, children }: LoginLayoutProps) => {
  const switchDark = useAppStore((state) => state.switchDark)
  const { name, config } = useModuleContext()
  const translate = useTranslate()

  return (
    <div className='h-screen w-screen flex items-start justify-center text-secondary md:items-center'>
      <div className='relative m-4 max-w-180 w-full flex flex-row gap-12 overflow-hidden rounded-lg p-8 shadow bg-container'>
        <div
          className='tex absolute h-30 w-30 flex rotate-45 cursor-pointer items-end justify-center p-3 text-white bg-brand -right-15 -top-15 hover:bg-brand-hover'
          onClick={() => {
            switchDark()
          }}
        >
          <div className='i-tabler:sun h-5 w-5'></div>
        </div>
        <div className='hidden flex-1 md:block'>
          <img src={config?.loginBanner || banner} className='h-full w-full' />
        </div>
        <div className='flex flex-1 flex-col'>
          <div className='mt-4 flex flex-col items-center justify-center'>
            {config?.appLogo ? (
              <img src={config.appDarkLogo || config.appLogo} className='w-30 text-white' />
            ) : (
              <DuxLogo className='w-30 text-white' />
            )}

            <div className='mt-4 text-lg'>{title || translate(`${name}.title`)}</div>
          </div>
          <div className='my-6'>{children}</div>
          <div className='text-center text-sm text-placeholder'>{translate(`copyright`)}</div>
        </div>
      </div>
    </div>
  )
}

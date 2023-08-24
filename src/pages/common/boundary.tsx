import { useTranslate } from '@refinedev/core'
import { DuxLogo } from '../../components'
import { useTranslation } from 'react-i18next'

export const ErrorBoundary = () => {
  const { t } = useTranslation()
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-page text-primary'>
      <div className='max-w-2xl flex flex-col items-center text-center'>
        <div className='mb-10'>
          <DuxLogo className='w-50' />
        </div>
        <div className='text-3xl mb-4'>{t('pages.boundary.title')}</div>
        <div className='text-secondary'>{t('pages.boundary.desc')}</div>
      </div>
    </div>
  )
}

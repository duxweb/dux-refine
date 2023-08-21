import { useEffect, useState } from 'react'
import { useTranslate, useResource } from '@refinedev/core'
import Result from '../../components/result'
import show from '../../../assets/notFound.svg'
import { useTranslation } from 'react-i18next'

export const Error = () => {
  const [errorMessage, setErrorMessage] = useState<string>()
  const translate = useTranslate()

  const { t } = useTranslation()

  const { resource, action } = useResource()

  useEffect(() => {
    if (resource && action) {
      setErrorMessage(
        t('pages.error.info', {
          action: action,
          resource: resource.name,
        })
      )
    } else {
      setErrorMessage(t('pages.error.404Desc'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, action])

  return (
    <>
      <Result
        show={<img src={show} alt='404' className='h-50' />}
        type='custom'
        title={t('pages.error.404')}
        desc={errorMessage}
      />
    </>
  )
}

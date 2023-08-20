import React, { useEffect, useState } from 'react'
import { useNavigation, useTranslate, useResource, useGo, useRouterType } from '@refinedev/core'
import Result from '../../components/result'
import { Button } from 'tdesign-react/esm'
import show from '../../../assets/notFound.svg'

export const Error = () => {
  const [errorMessage, setErrorMessage] = useState<string>()
  const translate = useTranslate()
  const { push } = useNavigation()
  const go = useGo()
  const routerType = useRouterType()

  const { resource, action } = useResource()

  useEffect(() => {
    if (resource && action) {
      setErrorMessage(
        translate('pages.error.info', {
          action: action,
          resource: resource.name,
        })
      )
    } else {
      setErrorMessage(translate('pages.error.404Desc'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, action])

  return (
    <>
      <Result
        show={<img src={show} alt='404' className='h-50' />}
        type='custom'
        title={translate('pages.error.404')}
        desc={errorMessage}
      />
    </>
  )
}

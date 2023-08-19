import React, { useEffect, useState } from 'react'
import { useNavigation, useTranslate, useResource, useGo, useRouterType } from '@refinedev/core'
import Result from '../result'
import { Button } from 'tdesign-react/esm'

export const ErrorComponent = () => {
  const [errorMessage, setErrorMessage] = useState<string>()
  const translate = useTranslate()
  const { push } = useNavigation()
  const go = useGo()
  const routerType = useRouterType()

  const { resource, action } = useResource()

  useEffect(() => {
    if (resource && action) {
      setErrorMessage(
        translate(
          'pages.error.info',
          {
            action: action,
            resource: resource.name,
          },
          `You may have forgotten to add the "${action}" component to "${resource.name}" resource.`
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, action])

  return (
    <>
      <Result
        state='404'
        type='text'
        title={translate(
          'pages.error.404',
          undefined,
          'Sorry, the page you visited does not exist.'
        )}
        desc={errorMessage}
        footer={
          <Button
            onClick={() => {
              if (routerType === 'legacy') {
                push('/')
              } else {
                go({ to: '/' })
              }
            }}
          >
            {translate('pages.error.backHome', undefined, 'Back Home')}
          </Button>
        }
      />
    </>
  )
}

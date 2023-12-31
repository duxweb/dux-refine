import { useState } from 'react'
import { useGo, useLogin, useTranslate } from '@refinedev/core'
import { Form, Input, Button, SubmitContext, Link } from 'tdesign-react/esm'
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react'
import { useModuleContext } from '../../core/module'
import { LoginLayout } from './layout'
import { moduleApp } from '../../core/config'

const { FormItem } = Form

type LoginVariables = {
  username: string
  password: string
}

export const Login = () => {
  const { mutate: login } = useLogin<LoginVariables>({})
  const [loading, setLoading] = useState<boolean>()
  const go = useGo()

  const { name, config } = useModuleContext()
  const moduleApp = (name ? config?.moduleApp?.[name] : {}) as moduleApp

  const translate = useTranslate()

  const onSubmit = (context: SubmitContext) => {
    if (context.validateResult === false) {
      // error
    }
    setLoading(true)
    login(context.fields, {
      onSuccess: () => {
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      },
    })
  }

  return (
    <LoginLayout>
      <Form statusIcon={true} onSubmit={onSubmit} colon={true} labelWidth={0} disabled={loading}>
        <FormItem name='username'>
          <Input
            size='large'
            clearable={true}
            prefixIcon={<DesktopIcon />}
            placeholder={translate(`pages.login.fields.username`)}
          />
        </FormItem>
        <FormItem name='password'>
          <Input
            size='large'
            type='password'
            prefixIcon={<LockOnIcon />}
            clearable={true}
            placeholder={translate(`pages.login.fields.password`)}
            autocomplete='new-password'
          />
        </FormItem>
        <div className='mb-2'>
          <Button theme='primary' type='submit' block size='large' loading={loading}>
            {translate(`pages.login.buttons.submit`)}
          </Button>
        </div>
        {(moduleApp?.register || moduleApp?.forgotPassword) && (
          <div className='flex justify-between'>
            {moduleApp?.register && (
              <Link
                onClick={() => {
                  go({
                    to: `/${name}/register`,
                  })
                }}
              >
                {translate(`pages.login.buttons.noAccount`)}
              </Link>
            )}
            {moduleApp?.forgotPassword && (
              <Link
                onClick={() => {
                  go({
                    to: `/${name}/forgot-password`,
                  })
                }}
              >
                {translate(`pages.login.buttons.forgotPassword`)}
              </Link>
            )}
          </div>
        )}
      </Form>
    </LoginLayout>
  )
}

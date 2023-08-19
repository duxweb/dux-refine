import { useState } from 'react'
import { useGo, useLogin, useParsed, useTranslate } from '@refinedev/core'
import { Form, Input, Button, SubmitContext, Link } from 'tdesign-react/esm'
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react'
import { useAppContext } from '../../core'
import { LoginLayout } from './layout'

const { FormItem } = Form

type LoginVariables = {
  username: string
  password: string
}

export const Login = () => {
  const { mutate: login } = useLogin<LoginVariables>({})
  const [loading, setLoading] = useState<boolean>()
  const go = useGo()

  const { params } = useParsed<{ app?: string }>()
  const { config } = useAppContext()

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
            placeholder={translate(`common.login.fields.username`)}
          />
        </FormItem>
        <FormItem name='password'>
          <Input
            size='large'
            type='password'
            prefixIcon={<LockOnIcon />}
            clearable={true}
            placeholder={translate(`common.login.fields.password`)}
            autocomplete='new-password'
          />
        </FormItem>
        <FormItem>
          <Button theme='primary' type='submit' block size='large' loading={loading}>
            {translate(`common.login.buttons.submit`)}
          </Button>
        </FormItem>
        {(config?.moduleApp?.register || config?.moduleApp?.forgotPassword) && (
          <FormItem>
            <div className='flex justify-justify-between'>
              {config?.moduleApp?.register && (
                <Link
                  onClick={() => {
                    go({
                      to: `/${params?.app}/register`,
                    })
                  }}
                >
                  {translate(`common.login.buttons.noAccount`)}
                </Link>
              )}
              {config?.moduleApp?.forgotPassword && (
                <Link
                  onClick={() => {
                    go({
                      to: `/${params?.app}/forgot-password`,
                    })
                  }}
                >
                  {translate(`common.login.buttons.forgotPassword`)}
                </Link>
              )}
            </div>
          </FormItem>
        )}
      </Form>
    </LoginLayout>
  )
}

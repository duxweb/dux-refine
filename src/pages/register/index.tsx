import { createRef, useState } from 'react'
import { useGo, useLogin, useParsed, useRegister, useTranslate } from '@refinedev/core'
import { Form, Input, Button, SubmitContext, Link, FormInstanceFunctions } from 'tdesign-react/esm'
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react'
import { useAppContext } from '../../core'
import { LoginLayout } from '../login'

const { FormItem } = Form

type RegisterVariables = {
  username: string
  password: string
  newPassword: string
}

export const Login = () => {
  const { mutate: register } = useRegister<RegisterVariables>({})
  const [loading, setLoading] = useState<boolean>()
  const go = useGo()

  const { params } = useParsed<{ app?: string }>()
  const { config } = useAppContext()
  const form = createRef<FormInstanceFunctions>()

  const translate = useTranslate()

  const onSubmit = (context: SubmitContext) => {
    setLoading(true)
    register(context.fields, {
      onSuccess: () => {
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      },
    })
  }

  const rePassword = (val) => {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(form.current?.getFieldValue('password') === val)
        clearTimeout(timer)
      })
    })
  }

  return (
    <LoginLayout>
      <Form
        ref={form}
        statusIcon={true}
        onSubmit={onSubmit}
        colon={true}
        labelWidth={0}
        disabled={loading}
      >
        <FormItem name='username'>
          <Input
            size='large'
            clearable={true}
            prefixIcon={<DesktopIcon />}
            placeholder={translate(`common.login.fields.username`)}
          />
        </FormItem>
        <FormItem name='password' rules={[{ required: true, message: '密码必填', type: 'error' }]}>
          <Input
            size='large'
            type='password'
            prefixIcon={<LockOnIcon />}
            clearable={true}
            placeholder={translate(`common.login.fields.password`)}
            autocomplete='new-password'
          />
        </FormItem>
        <FormItem
          name='newPassword'
          rules={[
            { required: true, message: '密码必填', type: 'error' },
            { validator: rePassword, message: '两次密码不一致' },
          ]}
        >
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
        <FormItem>
          <div className='flex justify-justify-between'>
            {config?.moduleApp?.register && (
              <Link
                onClick={() => {
                  go({
                    to: `/${params?.app}/login`,
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
      </Form>
    </LoginLayout>
  )
}

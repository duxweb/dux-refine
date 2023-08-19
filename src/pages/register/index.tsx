import { createRef, useState } from 'react'
import { useGo, useParsed, useRegister, useTranslate } from '@refinedev/core'
import { Form, Input, Button, SubmitContext, Link, FormInstanceFunctions } from 'tdesign-react/esm'
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react'
import { LoginLayout } from '../login'

const { FormItem } = Form

type RegisterVariables = {
  username: string
  password: string
}

export const Register = () => {
  const { mutate: register } = useRegister<RegisterVariables>({})
  const [loading, setLoading] = useState<boolean>()
  const go = useGo()

  const { params } = useParsed<{ app?: string }>()
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

  return (
    <LoginLayout title={translate(`pages.register.title`)}>
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
            placeholder={translate(`pages.register.fields.username`)}
          />
        </FormItem>
        <FormItem name='password'>
          <Input
            size='large'
            type='password'
            prefixIcon={<LockOnIcon />}
            clearable={true}
            placeholder={translate(`pages.register.fields.password`)}
            autocomplete='new-password'
          />
        </FormItem>
        <div className='mb-2'>
          <Button theme='primary' type='submit' block size='large' loading={loading}>
            {translate(`pages.register.buttons.submit`)}
          </Button>
        </div>
        <div className='flex justify-between'>
          <Link
            onClick={() => {
              go({
                to: `/${params?.app}/login`,
              })
            }}
          >
            {translate(`pages.register.buttons.haveAccount`)}
          </Link>
        </div>
      </Form>
    </LoginLayout>
  )
}

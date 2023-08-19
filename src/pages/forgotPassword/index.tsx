import { createRef, useState } from 'react'
import { useGo, useParsed, useForgotPassword, useTranslate } from '@refinedev/core'
import { Form, Input, Button, SubmitContext, Link, FormInstanceFunctions } from 'tdesign-react/esm'
import { DesktopIcon, LockOnIcon, SystemCodeIcon } from 'tdesign-icons-react'
import { LoginLayout } from '../login'

const { FormItem } = Form

type forgotPasswordVariables = {
  username: string
  password?: string
  code?: string
}

export const ForgotPassword = () => {
  const { mutate: forgotPassword } = useForgotPassword<forgotPasswordVariables>({})
  const [loading, setLoading] = useState<boolean>()
  const go = useGo()

  const { params } = useParsed<{ app?: string }>()
  const form = createRef<FormInstanceFunctions>()
  const [update, setUpdate] = useState(false)

  const translate = useTranslate()

  const onSubmit = (context: SubmitContext) => {
    setLoading(true)
    forgotPassword(context.fields, {
      onSuccess: (data) => {
        setLoading(false)
        if (!data.success) {
          return
        }
        if (update) {
          go({
            to: `/${params?.app}/login`,
          })
        } else {
          setUpdate(true)
        }
      },
      onError: () => {
        setLoading(false)
      },
    })
  }

  return (
    <LoginLayout title={translate(`pages.forgotPassword.title`)}>
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
            readonly={update}
            size='large'
            prefixIcon={<DesktopIcon />}
            placeholder={translate(`pages.forgotPassword.fields.username`)}
          />
        </FormItem>
        {update && (
          <>
            <FormItem name='password'>
              <Input
                size='large'
                type='password'
                prefixIcon={<LockOnIcon />}
                placeholder={translate(`pages.forgotPassword.fields.password`)}
                autocomplete='new-password'
              />
            </FormItem>
            <FormItem name='code'>
              <Input
                size='large'
                prefixIcon={<SystemCodeIcon />}
                placeholder={translate(`pages.forgotPassword.fields.code`)}
              />
            </FormItem>
          </>
        )}
        <div className='mb-2'>
          <Button theme='primary' type='submit' block size='large' loading={loading}>
            {update
              ? translate(`pages.forgotPassword.buttons.rest`)
              : translate(`pages.forgotPassword.buttons.send`)}
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
            {translate(`pages.forgotPassword.buttons.back`)}
          </Link>
          {update ? (
            <Link
              onClick={() => {
                setUpdate(false)
              }}
            >
              {translate(`pages.forgotPassword.buttons.send`)}
            </Link>
          ) : (
            <Link
              onClick={() => {
                setUpdate(true)
              }}
            >
              {translate(`pages.forgotPassword.buttons.code`)}
            </Link>
          )}
        </div>
      </Form>
    </LoginLayout>
  )
}

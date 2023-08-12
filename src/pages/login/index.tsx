import { useLogin, useParsed, useTranslate } from '@refinedev/core'
import { Form, Input, Button, SubmitContext } from 'tdesign-react/esm'
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react'
import { useAppStore } from '../../stores/app'
import { useState } from 'react'
import { DuxLogo } from '@/components/logo'

const { FormItem } = Form

type LoginVariables = {
  username: string
  password: string
}

export const Login = () => {
  const { mutate: login } = useLogin<LoginVariables>({})
  const [loading, setLoading] = useState<boolean>()
  const switchDark = useAppStore((state) => state.switchDark)

  const { params } = useParsed<{ app?: string }>()

  const translate = useTranslate()

  const onSubmit = (context: SubmitContext) => {
    if (context.validateResult === false) {
      // error
    }
    setLoading(true)
    login(
      {
        ...context.fields,
        app: 'admin',
      },
      {
        onSuccess: () => {
          setLoading(false)
        },
        onError: () => {
          setLoading(false)
        },
      }
    )
  }

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
          <img src='/public/images/login/banner.svg' className='h-full w-full' />
        </div>
        <div className='flex flex-1 flex-col'>
          <div className='mt-4 flex flex-col items-center justify-center'>
            <DuxLogo className='w-30 text-white' />
            <div className='mt-4 text-lg'>{translate(`${params?.app}.title`)}</div>
          </div>
          <Form
            statusIcon={true}
            onSubmit={onSubmit}
            colon={true}
            labelWidth={0}
            className='my-6'
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
          </Form>
          <div className='text-center text-sm text-placeholder'>{translate(`admin.copyright`)}</div>
        </div>
      </div>
    </div>
  )
}

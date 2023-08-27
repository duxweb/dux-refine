import React, { useRef } from 'react'
import { useTranslate, useBack } from '@refinedev/core'
import { SubmitContext, Card, FormItemProps, Form as TdForm, Button } from 'tdesign-react/esm'
import { Form, FormProps, FormFef } from './form'
import { Main, MainHeader } from '../main'

export interface FormPageProps extends FormProps {
  title?: React.ReactNode
  desc?: React.ReactNode
  headerRender?: React.ReactNode
  back?: boolean
  rest?: boolean
}
export const FormPage = ({
  title,
  desc,
  headerRender,
  children,
  onSubmit,
  back,
  rest,
  ...props
}: FormPageProps) => {
  const formRef = useRef<FormFef>(null)
  const backFn = useBack()
  const t = useTranslate()

  const onSubmitFun = async (e: SubmitContext) => {
    await onSubmit?.(e)
  }
  return (
    <Main>
      <MainHeader>
        {headerRender}
        {back && (
          <Button
            onClick={() => {
              backFn()
            }}
            variant='outline'
          >
            {t('buttons.back')}
          </Button>
        )}
        {rest && (
          <Button
            onClick={() => {
              formRef.current?.form.reset()
            }}
            variant='outline'
          >
            {t('buttons.rest')}
          </Button>
        )}
        <Button
          onClick={() => {
            formRef.current?.form.submit()
          }}
        >
          {t('buttons.save')}
        </Button>
      </MainHeader>
      <Card title={title} description={desc} headerBordered className='px-4'>
        <Form
          ref={formRef}
          onSubmit={onSubmitFun}
          formProps={{
            labelAlign: 'left',
            className: 'divide-y divide-gray-2 dark:divide-gray-10',
          }}
          {...props}
        >
          {children}
        </Form>
      </Card>
    </Main>
  )
}

export const FormPageItem = ({ label, help, requiredMark, ...props }: FormItemProps) => {
  return (
    <div className='grid grid-cols-1 mb-4 gap-4 pt-4 md:grid-cols-3'>
      <div className='col-span-1'>
        <div className='relative'>
          {requiredMark && <span className='absolute text-error -left-3'>*</span>}
          {label}
        </div>
        <div className='mt-1 text-sm text-placeholder'>{help}</div>
      </div>
      <div className='col-span-2'>
        <TdForm.FormItem {...props} />
      </div>
    </div>
  )
}

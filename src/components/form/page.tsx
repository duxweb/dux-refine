import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useTranslate, useBack, useResource } from '@refinedev/core'
import {
  SubmitContext,
  Card,
  FormItemProps,
  Form as TdForm,
  Button,
  Drawer,
} from 'tdesign-react/esm'
import { ChevronLeftIcon, LoadIcon, SaveIcon, SettingIcon } from 'tdesign-icons-react'
import { Form, FormProps, FormRef } from './form'
import { Main } from '../main'
import clsx from 'clsx'

export interface FormPageProps extends FormProps {
  title?: React.ReactNode
  headerRender?: React.ReactNode
  actionRender?: React.ReactNode
  settingRender?: React.ReactNode
  back?: boolean
  rest?: boolean
}
export const FormPage = forwardRef(
  (
    {
      title,
      children,
      onSubmit,
      back,
      rest,
      headerRender,
      actionRender,
      settingRender,
      formProps,
      ...props
    }: FormPageProps,
    ref: React.ForwardedRef<FormRef>
  ) => {
    const formRef = useRef<FormRef>(null)
    const backFn = useBack()
    const t = useTranslate()

    const onSubmitFun = async (e: SubmitContext) => {
      await onSubmit?.(e)
    }

    const { resource } = useResource()
    const translate = useTranslate()
    const [visibleDrawer, setVisibleDrawer] = useState(false)

    useImperativeHandle(ref, () => {
      return {
        form: formRef.current?.form,
      }
    })

    return (
      <Main
        title={title || translate(`${resource?.meta?.label}.name`)}
        header={headerRender}
        icon={resource?.meta?.icon}
        actions={
          <>
            {back && (
              <Button
                onClick={() => {
                  backFn()
                }}
                variant='outline'
                icon={<ChevronLeftIcon />}
              >
                {t('buttons.back')}
              </Button>
            )}
            {rest && (
              <Button
                onClick={() => {
                  formRef.current?.form?.reset()
                }}
                variant='outline'
                icon={<LoadIcon />}
              >
                {t('buttons.rest')}
              </Button>
            )}
            {actionRender}
            {settingRender && (
              <Button
                variant='outline'
                theme='primary'
                icon={<SettingIcon />}
                onClick={() => setVisibleDrawer(true)}
              >
                {t('buttons.setting')}
              </Button>
            )}
            <Button
              onClick={() => {
                formRef.current?.form?.submit()
              }}
              icon={<SaveIcon />}
            >
              {t('buttons.save')}
            </Button>
          </>
        }
      >
        <Card>
          <Form
            ref={formRef}
            onSubmit={onSubmitFun}
            formProps={{
              labelAlign: 'left',
              className: 'divide-y divide-gray-2 dark:divide-gray-10 py-2',
              ...formProps,
            }}
            {...props}
          >
            {children}
            {settingRender && (
              <Drawer
                confirmBtn={t('buttons.save')}
                onConfirm={() => formRef.current?.form?.submit()}
                header={t('buttons.setting')}
                visible={visibleDrawer}
                onClose={() => setVisibleDrawer(false)}
              >
                {settingRender}
              </Drawer>
            )}
          </Form>
        </Card>
      </Main>
    )
  }
)
FormPage.displayName = 'FormPage'

export const FormPageItem = ({ label, help, requiredMark, ...props }: FormItemProps) => {
  return (
    <div className='grid grid-cols-1 mb-4 gap-4 pt-4 md:grid-cols-5'>
      {label && (
        <div className='col-span-2 xl:col-span-1'>
          <div className='relative'>
            {requiredMark && <span className='absolute text-error -left-3'>*</span>}
            {label}
          </div>
          <div className='mt-1 text-sm text-placeholder'>{help}</div>
        </div>
      )}
      <div className={clsx([label ? 'flex items-center col-span-3 xl:col-span-4' : 'col-span-5'])}>
        <TdForm.FormItem {...props} className='w-full' />
      </div>
    </div>
  )
}

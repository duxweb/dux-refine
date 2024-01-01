import React, { useState } from 'react'
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
import { Form, FormProps, FormResult } from './form'
import { Main } from '../main'
import clsx from 'clsx'
import { appHook } from '../../utils/hook'
import { useModuleContext } from '../../core'

export interface FormPageProps extends FormProps {
  className?: string
  title?: React.ReactNode
  headerRender?: React.ReactNode
  actionRender?: React.ReactNode
  settingRender?: React.ReactNode
  back?: boolean
  rest?: boolean
}
export const FormPage = ({
  className,
  title,
  children,
  onSubmit,
  onResult,
  back,
  rest,
  headerRender,
  actionRender,
  settingRender,
  formProps,
  form: tdForm,
  ...props
}: FormPageProps) => {
  const [result, setResult] = useState<FormResult>()
  const backFn = useBack()
  const t = useTranslate()

  const { resource } = useResource()
  const { name: moduleName } = useModuleContext()
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [form] = TdForm.useForm(tdForm)

  return (
    <Main
      title={title}
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
                form.reset()
              }}
              variant='outline'
              icon={<LoadIcon />}
              loading={!!result?.formLoading}
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
              form.submit()
            }}
            loading={!!result?.formLoading}
            icon={<SaveIcon />}
          >
            {t('buttons.save')}
          </Button>
        </>
      }
    >
      <Card className={className}>
        <Form
          form={form}
          onResult={(data: FormResult) => {
            onResult?.(data)
            setResult(data)
          }}
          onSubmit={async (e: SubmitContext) => {
            await onSubmit?.(e)
          }}
          formProps={{
            labelAlign: 'left',
            className: 'divide-y divide-gray-2 dark:divide-gray-10 py-2',
            ...formProps,
          }}
          {...props}
        >
          {children}

          <appHook.Render mark={[moduleName, resource?.name as string, 'form']} />

          {settingRender && (
            <Drawer
              sizeDraggable
              size='450px'
              confirmBtn={t('buttons.save')}
              onConfirm={() => {
                setVisibleDrawer(false)
                form.submit()
              }}
              header={t('buttons.setting')}
              visible={visibleDrawer}
              onClose={() => setVisibleDrawer(false)}
            >
              {settingRender}
              <appHook.Render mark={[moduleName, resource?.name as string, 'form', 'setting']} />
            </Drawer>
          )}
        </Form>
      </Card>
    </Main>
  )
}

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

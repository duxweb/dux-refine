import { useSelect, useTranslate } from '@refinedev/core'
import { ButtonModal, DeleteButton } from '../action'
import { ComponentType, useEffect, useState } from 'react'
import { Form, Select } from 'tdesign-react/esm'
import { InternalFormInstance } from 'tdesign-react/esm/form/hooks/interface'

interface FilterEditProps {
  form: InternalFormInstance
  title: string
  field: string
  resource: string
  component: () => Promise<{
    default: ComponentType<any>
  }>
  optionLabel?: any
  optionValue?: any
  defaultSelect?: boolean
}
export const FilterEdit = ({
  form,
  field,
  title,
  resource,
  component,
  optionLabel,
  optionValue,
  defaultSelect,
}: FilterEditProps) => {
  const translate = useTranslate()
  const [init, setInit] = useState(false)
  const { options, onSearch, queryResult } = useSelect({
    resource: resource,
    optionLabel: optionLabel || 'name',
    optionValue: optionValue || 'id',
  })

  useEffect(() => {
    if (!defaultSelect || !options.length || init) {
      return
    }
    setInit(() => true)

    form?.setFieldsValue({
      [field]: options[0]?.value,
    })
    console.log(form?.getFieldValue(field))
  }, [defaultSelect, field, form, init, options])

  const id = Form.useWatch(field, form)

  return (
    <>
      <div>
        <ButtonModal
          resource={resource}
          action='create'
          variant='outline'
          theme='default'
          title={translate('buttons.create')}
          icon={<div className='i-tabler:plus' />}
          component={component}
        >
          <></>
        </ButtonModal>
      </div>
      <Form.FormItem name={field}>
        <Select
          clearable
          onSearch={onSearch}
          options={options}
          placeholder={title}
          loading={queryResult.isLoading}
        />
      </Form.FormItem>

      {id && (
        <div className='flex gap-2'>
          <ButtonModal
            resource={resource}
            action='edit'
            variant='outline'
            theme='default'
            title={translate('tools.magic.fields.editGroup')}
            icon={<div className='i-tabler:edit' />}
            component={component}
            rowId={id}
          >
            <></>
          </ButtonModal>
          <DeleteButton
            resource={resource}
            variant='outline'
            theme='default'
            icon={<div className='i-tabler:trash' />}
            rowId={id}
            onConfirm={() => {
              setTimeout(() => {
                if (form.getFieldValue(field)) {
                  form?.setFieldsValue({
                    [field]: options[0]?.value,
                  })
                }
              }, 0)
              setInit(false)
            }}
          >
            <></>
          </DeleteButton>
        </div>
      )}
    </>
  )
}

import {
  useTranslate,
  useNavigation,
  useResource,
  CanAccess,
  BaseKey,
  useDelete,
  useDeleteMany,
} from '@refinedev/core'
import { ComponentType } from 'react'
import {
  ButtonProps as TdButtonProps,
  LinkProps as TdLinkProps,
  Popconfirm,
} from 'tdesign-react/esm'
import { Modal, ModalProps } from '../modal'

type Extends = TdButtonProps | TdLinkProps

interface ExtendedActionProps {
  title?: string
  resource?: string
  action?: string
  Cp?: ComponentType<any>
}

export type ActionProps<T> = ExtendedActionProps & T

export const Action = <T extends Extends>({
  title,
  resource = '',
  action,
  Cp,
  ...props
}: ActionProps<T>) => {
  const { resource: res } = useResource()
  return (
    <CanAccess resource={resource || res?.name} action={action || ''}>
      {Cp && (
        <Cp theme='primary' {...props}>
          {props?.children || title}
        </Cp>
      )}
    </CanAccess>
  )
}

export const CreateAction = <T extends Extends>({
  resource,
  action = 'create',
  ...props
}: ActionProps<T>) => {
  const translate = useTranslate()
  const { create } = useNavigation()

  return (
    <Action
      action={action}
      onClick={() => {
        create(resource || '')
      }}
      title={translate('buttons.create')}
      {...props}
    />
  )
}

export type ActionIDProps<T> = ActionProps<T> & { rowId: string }

export const ShowAction = <T extends Extends>({
  resource,
  action = 'show',
  rowId,
  ...props
}: ActionIDProps<T>) => {
  const translate = useTranslate()
  const { show } = useNavigation()
  return (
    <Action
      resource={resource}
      action={action}
      onClick={() => {
        show(resource || '', rowId)
      }}
      title={translate('buttons.show')}
      {...props}
    />
  )
}

export const EditAction = <T extends Extends>({
  resource,
  action = 'edit',
  rowId,
  ...props
}: ActionIDProps<T>) => {
  const translate = useTranslate()
  const { edit } = useNavigation()

  return (
    <Action
      resource={resource}
      action={action}
      onClick={() => {
        edit(resource || '', rowId)
      }}
      title={translate('buttons.edit')}
      {...props}
    />
  )
}

export type ConfirmActionProps<T> = ActionProps<T> & { onConfirm?: () => void }

export const ConfirmAction = <T extends Extends>({
  title,
  resource,
  action = '',
  onConfirm,
  Cp,
  ...props
}: ConfirmActionProps<T>) => {
  const translate = useTranslate()
  const { resource: res } = useResource()
  return (
    <CanAccess resource={resource || res?.name} action={action}>
      <Popconfirm
        content={translate('buttons.confirm')}
        destroyOnClose
        placement='top'
        showArrow
        theme='default'
        onConfirm={onConfirm}
      >
        {Cp && (
          <Cp theme='primary' {...props}>
            {props?.children || title}
          </Cp>
        )}
      </Popconfirm>
    </CanAccess>
  )
}

export type ConfirmActionIdProps<T> = ConfirmActionProps<T> & {
  rowId: BaseKey
  params?: Record<string, any>
}

export const DeleteAction = <T extends Extends>({
  resource,
  action = 'delete',
  rowId,
  params,
  onConfirm,
  ...props
}: ConfirmActionIdProps<T>) => {
  const translate = useTranslate()
  const { mutate } = useDelete()
  const { resource: res } = useResource()
  return (
    <ConfirmAction
      title={translate('buttons.delete')}
      resource={resource}
      action={action}
      theme='danger'
      onConfirm={() => {
        mutate({
          resource: resource || res?.name || '',
          id: rowId,
          meta: {
            params: params,
          },
        })
        onConfirm?.()
      }}
      {...props}
    />
  )
}

export type ConfirmActionIdsProps<T> = ConfirmActionProps<T> & {
  rowIds: BaseKey[]
  params?: Record<string, any>
}

export const DeleteManyAction = <T extends Extends>({
  resource,
  action = 'delete',
  rowIds,
  params,
  onConfirm,
  ...props
}: ConfirmActionIdsProps<T>) => {
  const translate = useTranslate()
  const { mutate } = useDeleteMany()
  const { resource: res } = useResource()
  return (
    <ConfirmAction
      title={translate('buttons.delete')}
      resource={resource}
      action={action}
      theme='danger'
      onConfirm={() => {
        mutate({
          resource: resource || res?.name || '',
          ids: rowIds,
          meta: {
            params: params,
          },
        })
        onConfirm?.()
      }}
      {...props}
    />
  )
}

export type ModalActionProps<T> = ActionProps<T> & {
  modal?: ModalProps
  rowId?: BaseKey
  component?: () => Promise<{
    default: ComponentType<any>
  }>
  componentProps?: Record<string, any>
}

export const ActionModal = <T extends Extends>({
  resource,
  action = '',
  rowId = 0,
  component,
  componentProps,
  modal,
  title,
  Cp,
  ...props
}: ModalActionProps<T>) => {
  const { resource: res } = useResource()
  return (
    <CanAccess resource={resource || res?.name} action={action}>
      <Modal
        title={title}
        trigger={
          Cp && (
            <Cp theme='primary' {...props}>
              {props?.children || title}
            </Cp>
          )
        }
        component={component}
        componentProps={{ id: rowId, ...componentProps }}
        {...modal}
      />
    </CanAccess>
  )
}

export const CreateActionModal = <T extends Extends>({
  action = 'create',
  title,
  ...props
}: ModalActionProps<T>) => {
  const translate = useTranslate()
  return <ActionModal title={title || translate('buttons.create')} action={action} {...props} />
}

export const ShowActionModal = <T extends Extends>({
  action = 'show',
  title,
  ...props
}: ModalActionProps<T>) => {
  const translate = useTranslate()
  return <ActionModal title={title || translate('buttons.show')} action={action} {...props} />
}

export const EditActionModal = <T extends Extends>({
  action = 'edit',
  title,
  ...props
}: ModalActionProps<T>) => {
  const translate = useTranslate()
  return <ActionModal title={title || translate('buttons.edit')} action={action} {...props} />
}

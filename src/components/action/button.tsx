import { Button as TdButton, ButtonProps as TdButtonProps } from 'tdesign-react/esm'
import {
  Action,
  ActionIDProps,
  ActionModal,
  ActionProps,
  ConfirmAction,
  ConfirmActionIdProps,
  ConfirmActionIdsProps,
  ConfirmActionProps,
  CreateAction,
  CreateActionModal,
  DeleteAction,
  DeleteManyAction,
  EditAction,
  EditActionModal,
  ExportAction,
  ExportActionProps,
  ModalActionProps,
  ShowAction,
  ShowActionModal,
} from './action'

type ButtonProps = ActionProps<TdButtonProps>

export const Button = ({ ...props }: ButtonProps) => {
  return <Action<TdButtonProps> Cp={TdButton} {...props} />
}

export const CreateButton = ({ ...props }: ButtonProps) => {
  return (
    <CreateAction<TdButtonProps>
      Cp={TdButton}
      icon={<div className='t-icon i-tabler:plus'></div>}
      {...props}
    />
  )
}

type ButtonIDProps = ActionIDProps<TdButtonProps>

export const ShowButton = ({ ...props }: ButtonIDProps) => {
  return <ShowAction<TdButtonProps> Cp={TdButton} {...props} />
}

export const EditButton = ({ ...props }: ButtonIDProps) => {
  return <EditAction<TdButtonProps> Cp={TdButton} {...props} />
}

type ConfirmButtonProps = ConfirmActionProps<TdButtonProps>

export const ConfirmButton = ({ ...props }: ConfirmButtonProps) => {
  return <ConfirmAction<TdButtonProps> Cp={TdButton} {...props} />
}

type ConfirmButtonIdProps = ConfirmActionIdProps<TdButtonProps>

export const DeleteButton = ({ ...props }: ConfirmButtonIdProps) => {
  return <DeleteAction<TdButtonProps> Cp={TdButton} {...props} />
}

type ConfirmButtonIdsProps = ConfirmActionIdsProps<TdButtonProps>

export const DeleteManyButton = ({ ...props }: ConfirmButtonIdsProps) => {
  return <DeleteManyAction<TdButtonProps> Cp={TdButton} {...props} />
}

type ModalButtonProps = ModalActionProps<TdButtonProps>

export const ButtonModal = ({ ...props }: ModalButtonProps) => {
  return <ActionModal<TdButtonProps> Cp={TdButton} {...props} />
}

export const CreateButtonModal = ({ ...props }: ModalButtonProps) => {
  return (
    <CreateActionModal<TdButtonProps>
      Cp={TdButton}
      icon={<div className='t-icon i-tabler:plus'></div>}
      {...props}
    />
  )
}

export const ShowButtonModal = ({ ...props }: ModalButtonProps) => {
  return <ShowActionModal<TdButtonProps> Cp={TdButton} {...props} />
}

export const EditButtonModal = ({ ...props }: ModalButtonProps) => {
  return <EditActionModal<TdButtonProps> Cp={TdButton} {...props} />
}

type ExportButtonProps = ExportActionProps<TdButtonProps>
export const ExportButton = ({ ...props }: ExportButtonProps) => {
  return (
    <ExportAction<TdButtonProps>
      Cp={TdButton}
      icon={<div className='t-icon i-tabler:file-export'></div>}
      {...props}
    />
  )
}

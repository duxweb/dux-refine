import { Link as TdLink, LinkProps as TdLinkProps } from 'tdesign-react/esm'
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

type LinkProps = ActionProps<TdLinkProps>

export const Link = ({ ...props }: LinkProps) => {
  return <Action<TdLinkProps> Cp={TdLink} {...props} />
}

export const CreateLink = ({ ...props }: LinkProps) => {
  return <CreateAction<TdLinkProps> Cp={TdLink} {...props} />
}

type LinkIDProps = ActionIDProps<TdLinkProps>

export const ShowLink = ({ ...props }: LinkIDProps) => {
  return <ShowAction<TdLinkProps> Cp={TdLink} {...props} />
}

export const EditLink = ({ ...props }: LinkIDProps) => {
  return <EditAction<TdLinkProps> Cp={TdLink} {...props} />
}

type ConfirmLinkProps = ConfirmActionProps<TdLinkProps>

export const ConfirmLink = ({ ...props }: ConfirmLinkProps) => {
  return <ConfirmAction<TdLinkProps> Cp={TdLink} {...props} />
}

type ConfirmLinkIdProps = ConfirmActionIdProps<TdLinkProps>

export const DeleteLink = ({ ...props }: ConfirmLinkIdProps) => {
  return <DeleteAction<TdLinkProps> Cp={TdLink} {...props} />
}

type ConfirmLinkIdsProps = ConfirmActionIdsProps<TdLinkProps>

export const DeleteManyLink = ({ ...props }: ConfirmLinkIdsProps) => {
  return <DeleteManyAction<TdLinkProps> Cp={TdLink} {...props} />
}

type ModalLinkProps = ModalActionProps<TdLinkProps>

export const LinkModal = ({ ...props }: ModalLinkProps) => {
  return <ActionModal<TdLinkProps> Cp={TdLink} {...props} />
}

export const CreateLinkModal = ({ ...props }: ModalLinkProps) => {
  return <CreateActionModal<TdLinkProps> Cp={TdLink} {...props} />
}

export const ShowLinkModal = ({ ...props }: ModalLinkProps) => {
  return <ShowActionModal<TdLinkProps> Cp={TdLink} {...props} />
}

export const EditLinkModal = ({ ...props }: ModalLinkProps) => {
  return <EditActionModal<TdLinkProps> Cp={TdLink} {...props} />
}

type ExportLinkProps = ExportActionProps<TdLinkProps>
export const ExportLink = ({ ...props }: ExportLinkProps) => {
  return <ExportAction<TdLinkProps> Cp={TdLink} {...props} />
}

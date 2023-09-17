import clsx from 'clsx'
import { Button, Dropdown, DropdownOption, Popup, Tooltip } from 'tdesign-react/esm'
import { ReactNode, useCallback, useState } from 'react'
import { Icon } from 'tdesign-icons-react'

export const UIMenuBar = ({ children }: React.PropsWithChildren) => {
  return <div className='tiptap-menu'>{children}</div>
}

export interface UIMenuItemProps extends UIMenuBtnProps {
  label?: string
  type?: 'button' | 'menu' | 'popup'
  popupRender?: (close: () => void) => ReactNode
  menuOptions?: DropdownOption[]
  onMenuSelect?: (item: DropdownOption) => void
  children?: ReactNode
}

export const UIMenuItem = ({
  label,
  type = 'button',
  menuOptions,
  onMenuSelect,
  popupRender,
  children,
  ...props
}: UIMenuItemProps) => {
  const [open, setOpen] = useState(false)
  const [tooltip, setTooltip] = useState(false)

  const close = useCallback(async () => {
    await setTooltip(false)
    await setTimeout(() => {
      setOpen(false)
    }, 200)
  }, [setOpen])

  return (
    <>
      {type == 'button' && (
        <Tooltip content={label} visible={tooltip} onVisibleChange={setTooltip}>
          <div>
            <UIMenuBtn content={children} {...props} />
          </div>
        </Tooltip>
      )}
      {type == 'menu' && (
        <Dropdown
          trigger='click'
          hideAfterItemClick
          minColumnWidth='80px'
          options={menuOptions}
          onClick={(item) => {
            onMenuSelect?.(item)
          }}
        >
          <div>
            <Tooltip content={label} visible={tooltip} onVisibleChange={setTooltip}>
              <div>
                <UIMenuBtn content={children} {...props} />
              </div>
            </Tooltip>
          </div>
        </Dropdown>
      )}
      {type == 'popup' && (
        <Popup
          trigger='click'
          visible={open}
          onVisibleChange={setOpen}
          content={popupRender?.(close)}
          showArrow
        >
          <div>
            <Tooltip content={label} visible={tooltip} onVisibleChange={setTooltip}>
              <div>
                <UIMenuBtn content={children} {...props} />
              </div>
            </Tooltip>
          </div>
        </Popup>
      )}
    </>
  )
}

export interface UIMenuBtnProps {
  icon?: string
  content?: ReactNode
  disabled?: boolean
  onClick?: () => void
  active?: boolean
  arrow?: boolean
}

const UIMenuBtn = ({ content, icon, disabled, onClick, active, arrow }: UIMenuBtnProps) => {
  return (
    <Button
      className='tiptap-btn'
      variant='text'
      disabled={disabled}
      onClick={onClick}
      theme={active ? 'primary' : 'default'}
      suffix={arrow ? <Icon name='chevron-down' size='14' /> : undefined}
    >
      {content || <div className={clsx(['tiptap-menu-icon', icon])}></div>}
    </Button>
  )
}

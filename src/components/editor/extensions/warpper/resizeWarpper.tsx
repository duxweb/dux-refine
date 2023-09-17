import { ReactElement, useEffect, useState } from 'react'
import { NodeViewProps } from '@tiptap/react'
import { Resizable } from 're-resizable'
import clsx from 'clsx'

interface ResizeWrapperProps {
  nodeView: NodeViewProps
  children?: ReactElement
  onResize?: (width: string | number, height: string | number) => void
  className?: string
  ratio?: boolean
}

export const ResizeWrapper = ({
  nodeView,
  onResize,
  ratio,
  className,
  children,
}: ResizeWrapperProps) => {
  const [isDrag, setIsDrag] = useState(false)
  const [isResize, setIsResize] = useState(false)
  const isActive = nodeView.selected

  useEffect(() => {
    setIsDrag(isResize)
    if (!isResize) {
      setIsDrag(isActive)
    }
  }, [isActive, isResize])

  return (
    <Resizable
      size={{
        width: nodeView.node.attrs.width,
        height: ratio ? 'auto' : nodeView.node.attrs.height,
      }}
      onResize={(e, direction, ref) => {
        setIsResize(true)
        nodeView.updateAttributes({
          width: ref.style.width,
          height: ratio ? 'auto' : ref.style.height,
        })
        onResize?.(ref.style.width, ref.style.height)
      }}
      onResizeStop={() => {
        setIsResize(false)
      }}
      className={clsx(['resizer inline-block', isDrag ? 'resizer-active' : '', className])}
      lockAspectRatio={ratio}
    >
      <div className='resizer-control pointer-events-none'>
        <span className='resizer-trigger cursor-nw-resize -left-2 -top-2'></span>
        <span className='resizer-trigger cursor-ne-resize -right-2 -top-2'></span>
        <span className='resizer-trigger cursor-sw-resize -bottom-2 -left-2'></span>
        <span className='resizer-trigger cursor-se-resize -bottom-2 -right-2'></span>
      </div>
      {children}
    </Resizable>
  )
}

import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { ResizeWrapper } from './resizeWarpper'
import clsx from 'clsx'
import { useMemo } from 'react'
export const VideoWrapper = (props: NodeViewProps) => {
  const alignClass = useMemo(() => {
    switch (props.node.attrs.align) {
      case 'right':
        return 'text-right'
      case 'center':
        return 'text-center'
      default:
        return 'text-left'
    }
  }, [props.node.attrs.align])

  const { ratio, align, height, width, ...attrs } = props.node.attrs

  return (
    <NodeViewWrapper className={clsx(['no-prose', alignClass])}>
      <ResizeWrapper nodeView={{ ...props }} ratio={props.node.attrs.ratio}>
        <video {...attrs} className='h-full w-full bg-black' />
      </ResizeWrapper>
    </NodeViewWrapper>
  )
}

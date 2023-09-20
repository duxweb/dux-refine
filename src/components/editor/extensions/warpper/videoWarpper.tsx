import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { ResizeWrapper } from './resizeWarpper'
import clsx from 'clsx'
export const VideoWrapper = (props: NodeViewProps) => {
  const { ratio, align, height, width, ...attrs } = props.node.attrs
  return (
    <NodeViewWrapper className={clsx(['no-prose'])}>
      <ResizeWrapper nodeView={{ ...props }} ratio={props.node.attrs.ratio}>
        <video {...attrs} className='h-full w-full bg-black' data-drag-handle />
      </ResizeWrapper>
    </NodeViewWrapper>
  )
}

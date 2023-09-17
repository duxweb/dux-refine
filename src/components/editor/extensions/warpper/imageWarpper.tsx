import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { ResizeWrapper } from './resizeWarpper'
import clsx from 'clsx'
export const ImageWrapper = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper className={clsx(['no-prose'])}>
      <ResizeWrapper nodeView={props} ratio={props.node.attrs.ratio}>
        <img src={props.node.attrs.src} className='h-full w-full' data-drag-handle />
      </ResizeWrapper>
    </NodeViewWrapper>
  )
}

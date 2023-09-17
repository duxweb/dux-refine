// src/Tiptap.jsx
import { EditorProvider, BubbleMenu, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'

import { LineHeight } from './extensions/lineHeight'
import { FontSize } from './extensions/fontSize'
import { Video } from './extensions/video'
import { MenuBar } from './menu'

import { ImageResize } from './extensions/image'
import { ImageBubble } from './bubble/imageBubble'
import { TableBubble } from './bubble/tableBubble'
import { VideoBubble } from './bubble/videoBubble'

import './styles/main.css'

const extensions = [
  Highlight.configure({ multicolor: true }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'no-prose',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  ImageResize.configure({
    inline: true,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),

  LineHeight,
  FontSize,
  TextStyle,
  Video,
]

interface EditorProps {
  value?: Content
  onChange?: (value?: string) => void
  toolsBar?: string[]
  className?: string
}

export const Editor = ({ toolsBar, className, value, onChange }: EditorProps) => {
  return (
    <div className='app-editor'>
      <EditorProvider
        slotBefore={<MenuBar toolsBar={toolsBar} />}
        extensions={extensions}
        content={value}
        onUpdate={({ editor }) => {
          onChange?.(editor.getHTML())
        }}
        editorProps={{
          attributes: {
            class: `app-editor-content prose w-full max-w-full ${className}`,
          },
        }}
      >
        <BubbleMenu
          className='tiptap-bubble'
          tippyOptions={{
            placement: 'bottom-start',
          }}
          shouldShow={({ editor }) => {
            return editor.isActive('table')
          }}
        >
          <TableBubble />
        </BubbleMenu>
        <BubbleMenu
          className='tiptap-bubble'
          tippyOptions={{
            placement: 'bottom',
          }}
          shouldShow={({ editor }) => {
            return editor.isActive('imageResize')
          }}
        >
          <ImageBubble />
        </BubbleMenu>
        <BubbleMenu
          className='tiptap-bubble'
          tippyOptions={{
            placement: 'bottom',
          }}
          shouldShow={({ editor }) => {
            return editor.isActive('video')
          }}
        >
          <VideoBubble />
        </BubbleMenu>
      </EditorProvider>
    </div>
  )
}

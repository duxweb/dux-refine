// src/Tiptap.jsx
import {
  BubbleMenu,
  Editor as TiptapEditor,
  useEditor,
  EditorContent,
  Content,
} from '@tiptap/react'
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
import Link from '@tiptap/extension-link'

import { LineHeight } from './extensions/lineHeight'
import { FontSize } from './extensions/fontSize'
import { Video } from './extensions/video'
import { MenuBar } from './menu'

import { ImageResize } from './extensions/image'
import { ImageBubble } from './bubble/imageBubble'
import { TableBubble } from './bubble/tableBubble'
import { VideoBubble } from './bubble/videoBubble'

import './styles/main.css'
import { createContext, useContext, useEffect, useState } from 'react'
import clsx from 'clsx'

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
  Link.configure({
    openOnClick: false,
  }),

  LineHeight,
  FontSize,
  TextStyle,
  Video,
]

export type editorPageType = 'mobile' | 'docs' | 'web'
interface EditorContext {
  editor: TiptapEditor | null
  pageType?: editorPageType
  setPageType?: (type: editorPageType) => void
}

const context = createContext<EditorContext>({
  editor: null,
})

export const useEditorContext = () => {
  return useContext(context)
}

export const EditorConsumer = context.Consumer

interface EditorProps {
  defaultValue?: string
  value?: Content
  onChange?: (value?: string) => void
  toolsBar?: string[]
  className?: string
}

export const Editor = ({ toolsBar, className, defaultValue, value, onChange }: EditorProps) => {
  const [pageType, setPageType] = useState<editorPageType>('web')

  const setPage = (type: editorPageType) => {
    setPageType(type)
  }

  const editor = useEditor({
    extensions: extensions,
    content: value || defaultValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `app-editor-content prose max-w-full ${className || ''}`,
      },
    },
  })

  useEffect(() => {
    setTimeout(() => {
      editor?.commands.setContent(value || '')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!editor) {
    return null
  }

  return (
    <div className={clsx(['app-editor', `app-editor-${pageType}`])}>
      <context.Provider
        value={{
          editor,
          setPageType: setPage,
          pageType: pageType,
        }}
      >
        <MenuBar toolsBar={toolsBar} />
        <EditorConsumer>
          {({ editor: currentEditor }) => (
            <EditorContent className='app-editor-content-warp' editor={currentEditor} />
          )}
        </EditorConsumer>

        <BubbleMenu
          editor={editor}
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
          editor={editor}
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
          editor={editor}
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
      </context.Provider>
    </div>
  )
}

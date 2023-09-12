import { CKEditor } from '@ckeditor/ckeditor5-react'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'

import { Alignment } from '@ckeditor/ckeditor5-alignment'

import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from '@ckeditor/ckeditor5-basic-styles'
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import { CodeBlock } from '@ckeditor/ckeditor5-code-block'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { FontBackgroundColor, FontColor, FontSize } from '@ckeditor/ckeditor5-font'

import { Heading } from '@ckeditor/ckeditor5-heading'
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line'
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed'
import { DataSchema, GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support'
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResizeEditing,
} from '@ckeditor/ckeditor5-image'
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent'
import { AutoLink, Link, LinkImage } from '@ckeditor/ckeditor5-link'
import { List, ListProperties } from '@ckeditor/ckeditor5-list'
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office'
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format'
import {
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
} from '@ckeditor/ckeditor5-special-characters'
import {
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
} from '@ckeditor/ckeditor5-table'
import { TextTransformation } from '@ckeditor/ckeditor5-typing'
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload'

import { useApiUrl, useGetIdentity, useGetLocale } from '@refinedev/core'
import { useAppContext } from '../../core'

import './zh.js'
import './style.css'

interface EditorProps {
  editor?: CKEditor<any>['props']
  value?: string | null
  onChange?: (value: string) => void
}

export const Editor = ({ editor, value, onChange }: EditorProps) => {
  const plugins = [
    Alignment,
    AutoImage,
    AutoLink,
    Autoformat,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    DataSchema,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    HorizontalLine,
    HtmlEmbed,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    ImageResizeEditing,
    SimpleUploadAdapter,
  ]

  const toolsbar = {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'superscript',
      'subscript',
      'removeFormat',
      '-',
      'alignment',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
      '|',
      'horizontalLine',
      'blockQuote',
      'link',
      'specialCharacters',
      '|',
      'code',
      'codeBlock',
      'htmlEmbed',
      '|',
      'insertTable',
      'imageInsert',
      'mediaEmbed',
    ],
    shouldNotGroupWhenFull: true,
  }

  const apiUrl = useApiUrl()
  const { config } = useAppContext()
  const locale = useGetLocale()
  const currentLocale = locale()
  const { data } = useGetIdentity<{
    token?: string
  }>()

  console.log('lang', currentLocale)

  return (
    <div className='w-full'>
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: plugins,
          toolbar: toolsbar,
          fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21],
          },

          image: {
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              'resizeImage',
              'linkImage',
            ],
            resizeOptions: [
              {
                name: 'resizeImage:original',
                value: null,
                label: '自动',
              },
              {
                name: 'resizeImage:40',
                value: '40',
                label: '40%',
              },
              {
                name: 'resizeImage:60',
                value: '60',
                label: '60%',
              },
            ],
          },
          language: currentLocale,
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableCellProperties',
              'tableProperties',
            ],
          },
          simpleUpload: {
            uploadUrl: `${apiUrl}/${config.apiPath.upload}`,
            headers: {
              Accept: 'application/json',
              Authorization: data?.token || '',
            },
          },
        }}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange?.(data)
        }}
        {...editor}
      />
    </div>
  )
}

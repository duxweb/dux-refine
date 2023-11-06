import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Editor, IAllProps } from '@tinymce/tinymce-react'

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import 'tinymce/tinymce'
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver'
// Toolbar icons
import 'tinymce/icons/default'
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css'

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis'

import { useGetLocale } from '@refinedev/core'
import { useAppStore } from '../../stores'

// Content styles, including inline UI like fake cursors
import contentCss from 'tinymce/skins/content/default/content.min.css?raw'
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?raw'

import './langs/zh-Hans'
import './langs/zh-Hant'
import './langs/ko_KR'
import './langs/ru'
import './langs/ja'

const BaseEditor = ({ init, ...rest }: IAllProps) => {
  const locale = useGetLocale()
  const lang = useMemo(() => {
    const langMaps: Record<string, string> = {
      'zh-CN': 'zh-Hans',
      'zh-TW': 'zh-Hant',
      'ja-JP': 'ja',
      'ko-KR': 'ko_KR',
      'ru-RU': 'ru',
      'en-US': 'en',
    }
    return langMaps[locale() || 'en']
  }, [locale])

  return (
    <Editor
      init={{
        ...init,
        language: lang,
        skin: false,
        content_css: false,
        content_style: [contentCss, contentUiCss, init?.content_style || ''].join('\n'),
      }}
      {...rest}
    />
  )
}

const initData: IAllProps['init'] = {
  height: 500,
  plugins: [
    'advlist',
    'anchor',
    'autolink',
    'image',
    'link',
    'lists',
    'searchreplace',
    'table',
    'wordcount',
  ],
  toolbar:
    'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat',
  promotion: false,
  width: '100%',
  min_height: 500,
  font_size_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  convert_urls: false,
  relative_urls: false,
  line_height_formats: '0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5',
  branding: false,
  resize: false,
  elementpath: false,
  content_style: 'img {max-width:100%;}',
  paste_data_images: true,
  toolbar_mode: 'wrap',
}

interface EditorProps {
  config: IAllProps
  value: any
}

export const Tinymce = ({ config, value }: EditorProps) => {
  const dark = useAppStore((state) => state.dark)

  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => setShow(true), 300)
  }, [])

  return (
    <div className='w-full app-tinymce'>
      {show && (
        <BaseEditor
          initialValue={value}
          init={{
            ...initData,
          }}
          {...config}
        />
      )}
    </div>
  )
}

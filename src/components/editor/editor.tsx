import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Editor as Tinymce, IAllProps } from '@tinymce/tinymce-react'
import { useGetLocale } from '@refinedev/core'
import { useAppStore } from '../../stores'

interface EditorProps {
  config: IAllProps
  value: any
}

export const Editor = ({ config, value }: EditorProps) => {
  const locale = useGetLocale()
  const langMaps: Record<string, string> = {
    zh: 'zh-Hans',
    en: 'en',
  }
  const lang = langMaps[locale() || 'en']

  const dark = useAppStore((state) => state.dark)

  return (
    <div className='w-full'>
      <Tinymce
        tinymceScriptSrc='//registry.npmmirror.com/tinymce/6.7.0/files/tinymce.min.js'
        initialValue={value}
        init={{
          height: 500,
          menubar: false,
          language: lang,
          skin: !dark ? 'tinymce-5' : 'tinymce-5-dark',
          content_css: !dark
            ? '//registry.npmmirror.com/tinymce/6.7.0/files/skins/content/default/content.min.css'
            : '//registry.npmmirror.com/tinymce/6.7.0/files/skins/content/dark/content.min.css',
          language_url: `//registry.npmmirror.com/tinymce-i18n/23.9.11/files/langs6/${lang}.js`,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
        {...config}
      />
    </div>
  )
}

import { useMemo } from 'react'
import { Editor as TinyMce, IAllProps } from '@tinymce/tinymce-react'

import 'tinymce/tinymce'
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver'
// Toolbar icons
import 'tinymce/icons/default'

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

import './plugins/paste'
import './plugins/word'
import './plugins/uploads'

import { useGetIdentity, useGetLocale, useApiUrl } from '@refinedev/core'

// Content styles, including inline UI like fake cursors
import contentCss from './skins/content/default/content.min.css?raw'
import contentDarkCss from './skins/content/dark/content.min.css?raw'
import contentUiCss from './skins/ui/default/content.min.css?raw'
import contentUiDarkCss from './skins/ui/dark/content.min.css?raw'

// Editor styles
import uiCss from './skins/ui/default/skin.min.css?raw'
import uiDarkCss from './skins/ui/dark/skin.min.css?raw'

import './langs/zh-Hans'
import './langs/zh-Hant'
import './langs/ko_KR'
import './langs/ru'
import './langs/ja'
import { useAppStore } from '../../stores'
import { useModuleContext } from '../../core'
import { uploadFile } from './plugins/handler'

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
  const dark = useAppStore((state) => state.dark)

  return (
    <>
      <TinyMce
        init={{
          ...init,
          language: lang,
          skin: false,
          content_css: false,
          content_style: [
            dark ? contentDarkCss : contentCss,
            dark ? contentUiDarkCss : contentUiCss,
            init?.content_style || '',
          ].join('\n'),
        }}
        {...rest}
      />
      <style>{dark ? uiDarkCss : uiCss}</style>
    </>
  )
}

interface EditorProps {
  config?: IAllProps
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (value: unknown) => void
}

export const Editor = ({ config, value, onChange, defaultValue, disabled }: EditorProps) => {
  const { name, config: moduleConfig } = useModuleContext()
  const { data } = useGetIdentity<{
    token?: string
  }>()
  const apiUrl = useApiUrl()

  const uploadConfig = {
    remoteUrl: `${apiUrl}/${name}/${moduleConfig.apiPath.upload}/remote`,
    url: `${apiUrl}/${name}/${moduleConfig.apiPath.upload}`,
    token: data?.token,
  }

  const initData: IAllProps['init'] = {
    height: 500,
    plugins: [
      'advlist',
      'anchor',
      'autolink',
      'media',
      'image',
      'link',
      'lists',
      'searchreplace',
      'table',
      'wordcount',
      'customPaste',
      'customWord',
      'customImages',
    ],
    toolbar:
      'code preview | blocks fontsize lineheight | forecolor backcolor bold italic underline strikethrough  subscript superscript  removeformat | \
      alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | pagebreak link table  |  image media customWord customImages',

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
    text_patterns: [
      { start: '#', format: 'h1' },
      { start: '##', format: 'h2' },
      { start: '###', format: 'h3' },
      { start: '####', format: 'h4' },
      { start: '#####', format: 'h5' },
      { start: '######', format: 'h6' },
      { start: '* ', cmd: 'InsertUnorderedList' },
      { start: '- ', cmd: 'InsertUnorderedList' },
      { start: '1. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'decimal' } },
      { start: '1) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'decimal' } },
      { start: 'a. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-alpha' } },
      { start: 'a) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-alpha' } },
      { start: 'i. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-roman' } },
      { start: 'i) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-roman' } },
    ],
    images_upload_handler: (blobInfo, progress) => {
      return uploadFile(blobInfo, uploadConfig, progress).then((res) => res?.url)
    },
    upload_manage: uploadConfig,
  }

  return (
    <div className='app-tinymce w-full'>
      <BaseEditor
        init={{
          ...initData,
        }}
        disabled={disabled}
        value={value}
        onEditorChange={(value) => {
          setTimeout(() => {
            onChange?.(value)
          })
        }}
        {...config}
      />
    </div>
  )
}

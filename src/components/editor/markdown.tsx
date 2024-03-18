import React, { forwardRef, useCallback } from 'react'
import { config, MdEditor, EditorProps, zh_CN, en_US, UploadImgEvent } from 'md-editor-rt'
import { useGetLocale, useGetIdentity } from '@refinedev/core'
import 'md-editor-rt/lib/style.css'
import './markdown/style.css'
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW'
import jp_JP from '@vavt/cm-extension/dist/locale/jp-JP'
import ru_RU from '@vavt/cm-extension/dist/locale/ru'
import { useAppStore } from '../../stores/app'
import { useClient } from '../../provider'
import { useModuleContext } from '../../core/module'

import screenfull from 'screenfull'

import katex from 'katex'
import 'katex/dist/katex.min.css'

import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

import mermaid from 'mermaid'

import highlight from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import * as prettier from 'prettier'
import parserMarkdown from 'prettier/plugins/markdown'

export interface MarkdownEditor extends Omit<EditorProps, 'modelValue'> {
  value?: string
}

export const MarkdownEditor: React.ForwardRefExoticComponent<
  MarkdownEditor & React.RefAttributes<unknown>
> = forwardRef(({ value = '', ...props }, ref) => {
  const locale = useGetLocale()
  const dark = useAppStore((state) => state.dark)
  const { request } = useClient()
  const { config: moduleConfig } = useModuleContext()
  const { data: identity } = useGetIdentity<{
    token: string
  }>()

  config({
    editorConfig: {
      languageUserDefined: {
        'en-US': en_US,
        'zh-CN': zh_CN,
        'zh-TW': ZH_TW,
        'ja-JP': jp_JP,
        'ru-RU': ru_RU,
        'ko-KR': en_US,
      },
    },
    editorExtensions: {
      prettier: {
        prettierInstance: prettier,
        parserMarkdownInstance: parserMarkdown,
      },
      highlight: {
        instance: highlight,
      },
      screenfull: {
        instance: screenfull,
      },
      katex: {
        instance: katex,
      },
      cropper: {
        instance: Cropper,
      },
      mermaid: {
        instance: mermaid,
      },
    },
  })

  const onUploadImg: UploadImgEvent = useCallback(
    (files, callback) => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('file', file)
      })
      request(`${moduleConfig.apiPath.upload}`, 'post', {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: identity?.token,
        },
        data: formData,
      }).then((res) => {
        callback(res.data?.map((item: Record<string, any>) => item.url))
      })
    },
    [identity?.token, moduleConfig.apiPath.upload, request]
  )

  return (
    <MdEditor
      ref={ref}
      language={locale() || 'en-US'}
      theme={dark ? 'dark' : 'light'}
      onUploadImg={onUploadImg}
      {...props}
      modelValue={value}
    />
  )
})

MarkdownEditor.displayName = 'MarkdownEditor'

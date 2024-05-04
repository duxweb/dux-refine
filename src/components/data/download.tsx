import { useCallback } from 'react'
import { useClient } from '../../provider'
import { AxiosRequestConfig } from 'axios'
import { MessagePlugin } from 'tdesign-react/esm'
import dayjs from 'dayjs'
import mime from 'mime'

interface UseDownloadHook {
  download: (
    url: string,
    filename?: string,
    config?: AxiosRequestConfig,
    contentType?: string
  ) => void
  isLoading: boolean
}

export const useDownload = (): UseDownloadHook => {
  const { request, isLoading } = useClient()

  const download = useCallback(
    (url: string, filename?: string, config?: AxiosRequestConfig, contentType?: string) => {
      request(
        url,
        'post',
        {
          responseType: 'blob',
          ...config,
        },
        true
      ).then((res: Record<string, any>) => {
        if (res.code !== 200) {
          MessagePlugin.error(res.message)
          return
        }
        const type = contentType || res.headers['content-type']
        const name = filename || dayjs().format('YYYYMMDD_HHmmss') + '.' + mime.getExtension(type)
        downloadFile(res.data, type, name)
      })
    },
    [request]
  )

  return {
    download,
    isLoading,
  }
}

export const downloadFile = (res: BlobPart, type: string, filename: string) => {
  // 创建blob对象，解析流数据
  const blob = new Blob([res], {
    type: type,
  })
  const a = document.createElement('a')
  const URL = window.URL || window.webkitURL
  const herf = URL.createObjectURL(blob)
  a.href = herf
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(herf)
}

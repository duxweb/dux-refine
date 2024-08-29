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
    contentType?: string,
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
        true,
      ).then(({ response, ...res }) => {
        if (res?.data) {
          const type = contentType || res.headers['content-type']
          const contentDisposition = res.headers['content-disposition']

          if (contentDisposition) {
            const matches = /filename="([^"]+)"/.exec(contentDisposition)
            if (matches && matches?.length > 1) {
              filename = matches[1]
              // urldecode
              filename = decodeURIComponent(filename)
            }
          }

          const name = filename || dayjs().format('YYYYMMDD_HHmmss') + '.' + mime.getExtension(type)
          downloadFile(res.data, type, name)
        } else {
          const reader = new FileReader()
          reader.onload = function () {
            const message = JSON.parse(reader.result as string)?.data[0]?.message
            MessagePlugin.error(message || 'download error')
          }
          reader.readAsText(response.data)
        }
      })
    },
    [request],
  )

  return {
    download,
    isLoading,
  }
}

export const downloadFile = (res: BlobPart, type: string, filename: string) => {
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

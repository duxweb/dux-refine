import { useApiUrl, useGetIdentity } from '@refinedev/core'
import { TdUploadProps, UploadFile } from 'tdesign-react/esm'
import { useModuleContext } from '../../core'

export const useUpload = (): TdUploadProps => {
  const { name, config } = useModuleContext()
  const { data } = useGetIdentity<{
    token?: string
  }>()
  const apiUrl = useApiUrl()

  return {
    action: `${apiUrl}/${name}/${config.apiPath.upload}`,
    headers: {
      Accept: 'application/json',
      Authorization: data?.token || '',
    },
    formatResponse: (res) => {
      const requrst: XMLHttpRequest = res.XMLHttpRequest
      if (requrst.status != 200) {
        let result: Record<string, any> = {}
        try {
          result = JSON.parse(requrst.response)
        } catch {
          /* empty */
        }
        res.error = result?.message || res.statusText
      } else {
        res.url = res?.data?.[0]?.url
        res.name = res?.data?.[0]?.name
        res.size = res?.data?.[0]?.size
      }
      return res
    },
  }
}

export const formatUploadSingle = (file: any): UploadFile[] => {
  if (!file) {
    return []
  }
  if (typeof file == 'string') {
    return [
      {
        url: file,
      },
    ]
  }
  return file
}

export const getUploadSingle = (data?: any): unknown => {
  return data?.[0]?.url
}

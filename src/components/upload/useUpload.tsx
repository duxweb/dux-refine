import { useAppContext } from '../../core/app'
import { useApiUrl, useGetIdentity } from '@refinedev/core'
import { TdUploadProps, UploadFile } from 'tdesign-react/esm'

export const useUpload = (): TdUploadProps => {
  const { config } = useAppContext()
  const { data } = useGetIdentity<{
    token?: string
  }>()
  const apiUrl = useApiUrl()

  return {
    action: `${apiUrl}/${config.apiPath.upload}`,
    headers: {
      Accept: 'application/json',
      Authorization: data?.token || '',
    },
    formatResponse: (res) => {
      if (res?.code != 200) {
        res.error = res?.message || res.error
      } else {
        res.url = res?.data?.list?.[0]?.url
        res.name = res?.data?.list?.[0]?.name
      }
      return res
    },
  }
}

export const formatUploadSingle = (file: any): UploadFile => {
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

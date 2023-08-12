import config from '@/config'
import { useApiUrl, useGetIdentity } from '@refinedev/core'
import { TdUploadProps, UploadFile } from 'tdesign-react/esm'

export const useUpload = (): TdUploadProps => {
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

export const formatUploadFile = (file: string | Array<string>): UploadFile => {
  if (Array.isArray(file)) {
    return file.map((item) => {
      return {
        url: item,
      }
    })
  }
  return [
    {
      url: file,
    },
  ]
}

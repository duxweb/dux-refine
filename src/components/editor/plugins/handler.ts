import { client } from '../../../provider'

export const uploadFile = (
  blobInfo: { blob: () => Blob },
  config: Record<string, any>,
  progress: (value: any) => void
) => {
  const formdata = new FormData()
  formdata.append('file', blobInfo.blob())

  return client
    .post(config?.url, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: config?.token,
      },
      onDownloadProgress(ProgressEvent) {
        const percent = ProgressEvent?.total
          ? Math.floor((ProgressEvent.loaded / ProgressEvent.total) * 100)
          : 0
        progress?.(percent)
      },
    })
    .then(function (res) {
      return res.data?.data[0]
    })
}

export const formatHtml = (info: Record<string, any>) => {
  let node
  if (info.mime.startsWith('image/')) {
    node = `<div><img src='${info.url}' alt='${info.name}' /></div>`
  } else if (info.mime.startsWith('video/')) {
    node = `<div><video controls src='${info.url}'></video></div>`
  } else if (info.mime.startsWith('audio/')) {
    node = `<div><audio controls src='${info.url}'></audio></div>`
  } else {
    node = `<div><a href='${info.url}' target='_blank'>${info.name}</a></div>`
  }
  return node
}

import { formatHtml, uploadFile } from './handler'

tinymce.PluginManager.add('customImages', function (editor) {
  editor.ui.registry.addIcon(
    'images',
    '<svg t="1699341340301" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4021" width="20" height="20"><path d="M416 266.538667m-96 0a96 96 0 1 0 192 0 96 96 0 1 0-192 0Z" p-id="4022"></path><path d="M721.749333 371.626667A43.818667 43.818667 0 0 0 682.666667 348.074667a42.965333 42.965333 0 0 0-38.058667 25.002666l-66.474667 146.517334a10.624 10.624 0 0 1-18.005333 2.261333l-34.986667-43.690667a42.666667 42.666667 0 0 0-34.688-16.042666 42.965333 42.965333 0 0 0-33.578666 18.176L323.84 670.293333a21.333333 21.333333 0 0 0 17.493333 33.706667h512a21.333333 21.333333 0 0 0 18.133334-10.112 21.333333 21.333333 0 0 0 0.938666-20.736z" p-id="4023"></path><path d="M938.666667 0H234.666667a85.333333 85.333333 0 0 0-85.333334 85.333333v704a85.333333 85.333333 0 0 0 85.333334 85.333334H938.666667a85.333333 85.333333 0 0 0 85.333333-85.333334V85.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z m-6.186667 783.104a21.333333 21.333333 0 0 1-15.104 6.229333H256a21.333333 21.333333 0 0 1-21.333333-21.333333V106.666667A21.333333 21.333333 0 0 1 256 85.333333h661.333333a21.333333 21.333333 0 0 1 21.333334 21.333334V768a21.333333 21.333333 0 0 1-6.186667 14.976z" p-id="4024"></path><path d="M832 938.666667h-725.333333a21.333333 21.333333 0 0 1-21.333334-21.333334v-725.333333a42.666667 42.666667 0 0 0-85.333333 0V938.666667a85.333333 85.333333 0 0 0 85.333333 85.333333h746.666667a42.666667 42.666667 0 0 0 0-85.333333z" p-id="4025"></path></svg>'
  )

  editor.ui.registry.addButton('customImages', {
    tooltip: editor.translate('customImages'),
    icon: 'images',
    onAction: () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      // 执行上传文件操作
      input.addEventListener('change', () => {
        const files = input.files
        const config = editor.getParam('upload_manage')
        for (let i = 0; i < files.length; i++) {
          ;(function (file) {
            const reader = new FileReader()
            reader.onload = function () {
              const id = 'blobid' + new Date().getTime()
              const blobCache = tinymce.activeEditor.editorUpload.blobCache
              const base64 = reader.result.split(',')[1]
              const blobInfo = blobCache.create(id, file, base64)
              blobCache.add(blobInfo)
              uploadFile(blobInfo, config)
                .then((res) => {
                  editor.insertContent(formatHtml(res))
                })
                .catch(function (error) {
                  editor.notificationManager.open({
                    text: error.message || 'Request failed',
                    type: 'error',
                  })
                })
            }
            reader.readAsDataURL(file)
          })(files[i])
        }
      })
      input.click()
    },
  })

  return {
    name: 'customImages',
    url: 'https://www.dux.cn',
  }
})

tinymce.addI18n('zh-Hans', {
  customImages: '批量上传图片',
})

tinymce.addI18n('zh-Hant', {
  customImages: '批量上傳圖片',
})

tinymce.addI18n('ja', {
  customImages: '画像の一括アップロード',
})

tinymce.addI18n('ko_KR', {
  customImages: '이미지 일괄 업로드',
})

tinymce.addI18n('ru', {
  customImages: 'Массовая загрузка изображений',
})

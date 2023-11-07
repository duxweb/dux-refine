import { client } from '@duxweb/dux-refine'

tinymce.addI18n('zh-Hans', {
  customPaste: '图片保存',
  customPasteContent: '发现 {0} 张图片是否需要转存？',
})

tinymce.PluginManager.add('customPaste', function (editor) {
  editor.on('paste', function (e) {
    var imgUrls = extractImageUrls(e)

    if (imgUrls.length <= 0) {
      return
    }

    editor.windowManager.open({
      title: editor.translate('customPaste'),
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: '<p>' + editor.translate(['customPasteContent', imgUrls.length]) + '</p>',
          },
        ],
      },
      buttons: [
        {
          type: 'cancel',
          name: 'closeButton',
          text: editor.translate('Cancel'),
        },
        {
          type: 'submit',
          name: 'submitButton',
          text: editor.translate('Ok'),
          buttonType: 'primary',
        },
      ],
      onSubmit: (api) => {
        const config = editor.getParam('upload_manage')

        imgUrls.forEach(function (imgUrl) {
          client
            .post(
              config?.remoteUrl,
              {
                url: imgUrl,
              },
              {
                headers: {
                  Accept: 'application/json',
                  Authorization: config?.token,
                },
              }
            )
            .then(function (res) {
              let content = editor.getContent()
              Object.keys(res?.data?.data)?.forEach(function (key) {
                content = content.replace(key, res?.data?.data[key])
              })
              editor.setContent(content)
              api.close()
            })
            .catch(function (error) {
              console.error('Image fetching/uploading failed', error)
            })
        })
      },
    })
  })
  return {
    name: 'customPaste',
    url: 'https://mydocs.com/myplugin',
  }
})

function extractImageUrls(e) {
  let htmlString = (e.clipboardData || e.originalEvent.clipboardData).getData('text/html')

  const urls = []
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  let match
  while ((match = imgRegex.exec(htmlString))) {
    if (/^https?:\/\//.test(match[1])) {
      urls.push(match[1])
    }
  }

  const bgRegex = /background-image\s*:\s*url\((['"]?)(.*?)\1\)/g
  while ((match = bgRegex.exec(htmlString))) {
    if (/^https?:\/\//.test(match[2])) {
      urls.push(match[2])
    }
  }

  return urls
}

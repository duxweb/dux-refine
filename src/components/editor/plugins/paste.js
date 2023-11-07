import { client } from '@duxweb/dux-refine'

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
        api.close()
        editor.notificationManager.open({
          text: editor.translate('customPasteUploading'),
          type: 'info',
        })
        let promises = imgUrls.map(function (imgUrl) {
          return client.post(
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
        })

        Promise.all(promises)
          .then(function (responses) {
            let content = editor.getContent()
            responses.forEach(function (res) {
              Object.keys(res?.data?.data)?.forEach(function (key) {
                content = content.replace(key, res?.data?.data[key])
              })
            })
            editor.setContent(content)
            editor.notificationManager.open({
              text: editor.translate('customPasteSuccess'),
              type: 'success',
            })
          })
          .catch(function (error) {
            editor.notificationManager.open({
              text: error.message || editor.translate('customPasteError'),
              type: 'error',
            })
          })
      },
    })
  })
  return {
    name: 'customPaste',
    url: 'https://www.dux.plus',
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

tinymce.addI18n('en', {
  customPaste: 'Image Save',
  customPasteContent: 'Found {0} Does the image need to be dumped?',
  customPasteSuccess: 'Picture saved successfully',
  customPasteUploading: 'Pictures are being saved. Please wait.',
})

tinymce.addI18n('zh-Hans', {
  customPaste: '图片保存',
  customPasteContent: '发现 {0} 张图片是否需要转存？',
  customPasteSuccess: '图片保存成功',
  customPasteUploading: '图片保存中，请稍等',
  customPasteError: '图片上传失败',
})

tinymce.addI18n('zh-Hant', {
  customPaste: '圖片保存',
  customPasteContent: '發現 {0} 張圖片是否需要轉存？',
  customPasteSuccess: '圖片保存成功',
  customPasteUploading: '圖片保存中，請稍等',
  customPasteError: '圖片上傳失敗',
})

tinymce.addI18n('ja', {
  customPaste: '画像保存',
  customPasteContent: '見つかった {0} 枚の画像を保存しますか？',
  customPasteSuccess: '画像が正常に保存されました',
  customPasteUploading: '画像を保存しています。お待ちください。',
  customPasteError: '画像のアップロードに失敗しました',
})

tinymce.addI18n('ko_KR', {
  customPaste: '이미지 저장',
  customPasteContent: '발견된 {0} 개의 이미지를 저장하시겠습니까?',
  customPasteSuccess: '이미지가 성공적으로 저장되었습니다',
  customPasteUploading: '이미지를 저장 중입니다. 잠시 기다려 주세요.',
  customPasteError: '이미지 업로드에 실패했습니다',
})

tinymce.addI18n('ru', {
  customPaste: 'Сохранение изображения',
  customPasteContent: 'Найдено {0} изображений. Сохранить их?',
  customPasteSuccess: 'Изображение успешно сохранено',
  customPasteUploading: 'Идет сохранение изображений. Пожалуйста, подождите.',
  customPasteError: 'Ошибка загрузки изображения',
})

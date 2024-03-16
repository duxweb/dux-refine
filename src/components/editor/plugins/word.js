import mammoth from 'mammoth/mammoth.browser'

tinymce.PluginManager.add('customWord', function (editor) {
  function handleFileSelect(event) {
    var file = event.target.files[0]
    var extension = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
    if (extension !== 'docx') {
      editor.notificationManager.open({
        text: editor.translate('wordExtension'),
        type: 'warning',
      })
    }
    readFileInputEventAsArrayBuffer(event, function (arrayBuffer) {
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(displayResult, function (error) {
        console.error(error)
        editor.notificationManager.open({
          text: error,
          type: 'error',
        })
      })
    })
  }

  function displayResult(result) {
    tinymce.activeEditor.setContent(result.value)
  }

  function readFileInputEventAsArrayBuffer(event, callback) {
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function (loadEvent) {
      var arrayBuffer = loadEvent.target.result
      callback(arrayBuffer)
    }
    reader.readAsArrayBuffer(file)
  }

  editor.ui.registry.addIcon(
    'word',
    '<svg t="1699339342711" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10950" width="22" height="22"><path d="M864.9 601.6c-17.2-41.9-54.4-71-97.5-71-59.5 0-107.7 55.3-107.7 123.4 0 68.2 48.2 123.4 107.7 123.4 44.9 0 83.4-31.5 99.6-76.2L817.3 684c-8.3 29.7-28.5 50.8-52.1 50.8-31 0-56.1-36.2-56.1-80.8 0-44.6 25.1-80.8 56.1-80.8 20.6 0 38.5 15.9 48.3 39.7l51.4-11.3z m5.7-131.6h89.8v381.5h-89.8v110h-298 61.1-366.6c-61.7 0-112.1-48.8-114.6-110H62.7V470h89.8V63.8h426.4c12.4 0 22.4 10 22.4 22.4 0 12.4-10.1 22.4-22.4 22.4H197.3V470h628.4V290.5H646.2V86.3h0.4c0.5-4.7 2.5-9 5.6-12.5 8.3-9.2 22.5-10 31.7-1.7L864 234.3c6.4 5.7 8.9 14.6 6.5 22.8V470zM198 851.5c4.8 36.7 36.2 65.1 74.2 65.1h239.4v44.9h61.1-61.1v-44.9h314.2v-65.1H198z m611.5-605.9L691.1 138.9v106.7h118.4zM257.9 784.5c17 0 30 1.5 42.6-2.3 57.5-17.1 94.3-63 94.3-126 0-62.5-34.1-111.7-90-125-13.2-3.1-32.6-2.2-46.9-2.2H204v255.5h53.9z m19.2-36.2H249V564.7h28.2c7.5 0 16 0.6 22.9 2.8 29.2 9.3 49.9 30.1 49.9 88.8 0 58.7-19.8 77.1-49.9 89-6.6 2.6-15.7 3-23 3z m254.6 29.2c54.5 0 98.7-55.3 98.7-123.4 0-68.2-44.2-123.4-98.7-123.4S433 586 433 654.1c0 68.1 44.2 123.4 98.7 123.4z m0-44.9c-31 0-56.1-35.2-56.1-78.5s25.1-78.5 56.1-78.5 56.1 35.2 56.1 78.5-25.1 78.5-56.1 78.5z m0 0" p-id="10951"></path></svg>'
  )

  editor.ui.registry.addButton('customWord', {
    tooltip: editor.translate('word'),
    icon: 'word',
    onAction: () => {
      var input = document.createElement('input')
      input.type = 'file'
      input.accept = '.docx'
      // 执行上传文件操作
      input.addEventListener('change', handleFileSelect, false)
      input.click()
    },
  })

  return {
    name: 'customWord',
    url: 'https://www.dux.plus',
  }
})

tinymce.addI18n('zh-Hans', {
  word: 'word 上传',
  wordExtension: '仅支持 docx 格式文件',
})

tinymce.addI18n('zh-Hant', {
  word: 'word 上傳',
  wordExtension: '僅支持 docx 格式文件',
})

tinymce.addI18n('ja', {
  word: 'word アップロード',
  wordExtension: 'docx 形式のファイルのみサポートしています',
})

tinymce.addI18n('ko_KR', {
  word: 'word 업로드',
  wordExtension: 'docx 형식 파일만 지원합니다',
})

tinymce.addI18n('ru', {
  word: 'загрузка word',
  wordExtension: 'поддерживаются только файлы формата docx',
})

import { createRef, useCallback, useState } from 'react'
import {
  Button,
  Progress,
  ProgressContext,
  SuccessContext,
  Upload,
  UploadFailContext,
  UploadFile,
  message,
} from 'tdesign-react/esm'
import { UploadRef } from 'tdesign-react/esm/upload/interface'
import { useTranslate } from '@refinedev/core'
import { useUpload } from '../../../../upload'

interface UploadAreaProps {
  accept: string
  close: () => void
  onConfirm: (files: Array<string>) => void
}

export const UploadPopup = ({ accept, close, onConfirm }: UploadAreaProps) => {
  const [files, setFiles] = useState<Array<UploadFile>>([])
  const uploadDom = createRef<UploadRef>()
  const uploadParams = useUpload()
  const [uploadStatus, setUploadStatus] = useState(1)
  const [progress, setProgress] = useState(0)
  const [successFiles, setSuccessFiles] = useState<Array<string>>([])
  const t = useTranslate()

  const handleFail = useCallback((options: UploadFailContext) => {
    setUploadStatus(0)
    message.error(options.response?.error)
  }, [])

  const handleSuccess = useCallback(() => {
    setUploadStatus(3)
  }, [])

  const handleOneSuccess = useCallback(({ file }: SuccessContext) => {
    if (!file?.url) {
      return
    }
    setSuccessFiles((values) => {
      return [...values, file.url as string]
    })
  }, [])

  const handleProgress = useCallback((val: ProgressContext) => {
    setProgress(val.percent)
  }, [])

  const handleSelectChange = useCallback(() => {
    setProgress(0)
    setUploadStatus(2)
  }, [])

  const handleChange = useCallback((files: UploadFile[]) => {
    setFiles(files.slice(-1))
  }, [])

  return (
    <div className='p-2 pt-4'>
      <Upload
        ref={uploadDom}
        draggable
        theme='custom'
        accept={accept}
        multiple
        max={8}
        files={files}
        autoUpload={true}
        onProgress={handleProgress}
        onOneFileFail={handleFail}
        onOneFileSuccess={handleOneSuccess}
        onSuccess={handleSuccess}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        dragContent={
          <>
            {uploadStatus == 0 && (
              <span className='text-error'>{t('common.upload.error', { ns: 'editor' })}</span>
            )}
            {uploadStatus == 1 && (
              <div>
                <span className='t-upload--highlight'>
                  {t('common.upload.tip', { ns: 'editor' })}
                </span>
                <span> / {t('common.upload.drag', { ns: 'editor' })}</span>
              </div>
            )}
            {uploadStatus == 2 && (
              <div className='flex flex-col items-center gap-4'>
                <Progress theme={'circle'} size={'small'} percentage={progress} />
                <div>
                  {successFiles.length}/{files.length}
                </div>
              </div>
            )}
            {uploadStatus == 3 && (
              <div className='flex flex-col items-center gap-4'>
                <div className='i-tabler:circle-check-filled h-14 w-14 text-success'></div>
                <div>{t('common.upload.complete', { ns: 'editor' })}</div>
              </div>
            )}
          </>
        }
        {...uploadParams}
      />
      <div className='mt-4 flex justify-end gap-2'>
        <Button theme='default' onClick={() => close()}>
          {t('common.cancel', { ns: 'editor' })}
        </Button>
        <Button
          onClick={() => {
            close()
            onConfirm?.(successFiles)
          }}
          disabled={uploadStatus != 3}
        >
          {t('common.insert', { ns: 'editor' })}
        </Button>
      </div>
    </div>
  )
}

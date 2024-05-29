import { Link, Progress, MessagePlugin } from 'tdesign-react/esm'
import { useImport, useInvalidate, useTranslate } from '@refinedev/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mkConfig, generateCsv, download } from 'export-to-csv'

export type ImportExample = Record<string, any>[] | string
export interface ImportCsvProps {
  resource?: string
  size?: number
  example?: ImportExample
  onFinish?: () => void
  refresh?: string
}

export const ImportCsv = ({
  resource,
  example,
  size = 1000,
  onFinish,
  refresh,
}: ImportCsvProps) => {
  const translate = useTranslate()
  const invalidate = useInvalidate()

  const [importProgress, setImportProgress] = useState({
    processed: 0,
    total: 0,
  })

  const [status, setStatus] = useState(0)

  const { inputProps, isLoading } = useImport({
    resource: resource,
    onFinish: (results) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (results.errored?.length > 0) {
        MessagePlugin.error(results.errored[0].response[0].message || '导入失败')
        setStatus(0)
        return
      }
      setStatus(2)
      if (refresh) {
        invalidate({
          resource: refresh,
          invalidates: ['list'],
        })
      }
      onFinish?.()
    },
    onProgress: (progress) => {
      setImportProgress({
        processed: progress.processedAmount,
        total: progress.totalAmount,
      })
    },
    batchSize: size,
  })

  const cardDownload = useCallback((data: ImportExample) => {
    if (data instanceof String) {
      window.open(data as string, '_blank')
      return
    }
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'example' })
    const csv = generateCsv(csvConfig)(data as Record<string, any>[])
    download(csvConfig)(csv)
  }, [])

  useEffect(() => {
    if (isLoading) {
      setStatus(1)
    }
  }, [isLoading])

  const progress = useMemo(() => {
    return importProgress.total
      ? Math.round((importProgress.processed / importProgress.total) * 100)
      : 0
  }, [importProgress])

  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='h-40 flex items-center border rounded border-dashed p-4 border-component hover:border-brand'>
      <div className='mx-10 w-full flex flex-col items-center gap-4'>
        <div>
          <Progress
            theme={'circle'}
            size={'small'}
            percentage={progress || 0}
            status={status == 2 ? 'success' : 'active'}
            label={
              status == 2 ? (
                true
              ) : (
                <>
                  {status == 0 && (
                    <div className='flex items-center justify-center'>
                      <svg
                        className='icon'
                        viewBox='0 0 1024 1024'
                        version='1.1'
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                      >
                        <path
                          d='M960 0H64A64.188504 64.188504 0 0 0 0 64V960a64.188504 64.188504 0 0 0 64 64H960a64.188504 64.188504 0 0 0 64-64V64A64.188504 64.188504 0 0 0 960 0zM212.800571 672c-75.200571 0-104.000571-57.6-72.000571-160s94.400571-160 169.603427-160c64 0 97.600571 52.799429 73.6 129.600571H315.201714c9.596573-35.2-1.599429-59.200571-27.200572-59.200571-28.8 0-57.6 33.600571-75.200571 88.000571-17.600571 56.000571-7.997144 89.6 20.800571 89.6 24.000571 0 49.600571-22.4 62.400572-59.200571h68.799428c-22.401142 78.400571-86.401142 131.2-152.000571 131.2z m409.6-222.400571h-65.600571c4.798286-19.2-6.397715-30.399429-25.6-30.399429s-33.599429 9.596573-38.4 25.6c-4.798286 14.394859 3.198858 22.4 25.6 27.200571l32 7.997144c44.8 11.196001 57.6 38.4 43.200571 89.6-19.2 64-73.6 104.000571-139.200571 104.000571s-94.400571-35.2-75.200571-96h68.800571c-3.198858 17.599429 9.596573 28.8 28.8 28.8 20.800571 0 38.4-11.196001 43.200571-25.6s-3.198858-20.799429-27.200571-27.200571l-30.399429-7.997144c-41.6-9.596573-56.000571-43.200571-41.6-91.200571 19.2-62.400571 73.6-102.4 131.2-102.4 62.400571 0 88.000571 38.4 70.4 97.600571z m121.6 217.601142H651.196001l19.2-308.803998h83.2l-28.8 222.400571h1.599429l105.6-224h80z'
                          fill='#0972FE'
                        ></path>
                      </svg>
                    </div>
                  )}
                  {status == 1 && `${progress}%`}
                </>
              )
            }
          ></Progress>
        </div>
        {status == 0 && (
          <div className='flex flex-row gap-6'>
            <Link className='relative cursor-pointer'>
              {translate('select', {
                ns: 'import',
              })}
              <input {...inputProps} ref={fileInputRef} className='absolute inset-0 opacity-0' />
            </Link>
            {example && (
              <>
                <Link
                  className='cursor-pointer'
                  onClick={() => {
                    cardDownload(example)
                  }}
                >
                  {translate('example', {
                    ns: 'import',
                  })}
                </Link>
              </>
            )}
          </div>
        )}
        {status == 1 && (
          <div>
            {translate('loading', {
              ns: 'import',
            })}
          </div>
        )}
        {status == 2 && (
          <div>
            {translate('complete', {
              ns: 'import',
            })}
          </div>
        )}
      </div>
    </div>
  )
}

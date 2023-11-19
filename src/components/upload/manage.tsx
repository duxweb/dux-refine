import clsx from 'clsx'
import { useState } from 'react'
import { useCustom, useCustomMutation, useTranslate } from '@refinedev/core'
import {
  Button,
  Image,
  Pagination,
  Skeleton,
  Popup,
  Input,
  Popconfirm,
  Upload,
} from 'tdesign-react/esm'
import { Icon } from 'tdesign-icons-react'
import { useUpload } from './useUpload'
import { useModuleContext } from '../../core'

interface PageProps {
  mode?: 'single' | 'multi'
  onChange?: (data: Record<string, any>[]) => void
  onClose?: () => void
}

const FileManage = ({ mode = 'single', onChange, onClose }: PageProps) => {
  const [select, setSelect] = useState<unknown[]>([])
  const [folder, setFolder] = useState(0)
  const [page, setPage] = useState(1)
  const [create, setCreate] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const uploadParams = useUpload()
  const { config } = useModuleContext()
  const t = useTranslate()

  const {
    data,
    isLoading,
    refetch: fileRefetch,
  } = useCustom({
    method: 'get',
    url: config.apiPath.uploadManage || 'upload/manage',
    meta: {
      params: {
        type: 'files',
        id: folder,
        page: page,
      },
    },
  })
  const result = data as Record<string, any>

  const { data: dirData, refetch: dirRefetch } = useCustom({
    method: 'get',
    url: config.apiPath.uploadManage || 'upload/manage',
    meta: {
      params: {
        type: 'folder',
      },
    },
  })

  const { mutate: mutateCustom } = useCustomMutation()

  return (
    <div className='app-file-manage h-580px flex'>
      <div className='w-45 flex flex-none flex-col border-r border-component'>
        <div className='flex-none p-3'>
          <Upload
            {...uploadParams}
            theme='file'
            fileListDisplay={<></>}
            trigger={
              <Button block loading={uploadLoading}>
                {t('fields.upload', {
                  ns: 'file',
                })}
              </Button>
            }
            beforeAllFilesUpload={() => {
              setUploadLoading(true)
              return true
            }}
            onSuccess={() => {
              setUploadLoading(false)
              fileRefetch()
            }}
            formatRequest={(requestData) => {
              requestData.dir_id = folder
              return requestData
            }}
          />
        </div>
        <div className='flex-1 overflow-auto border-t border-component'>
          <ul className='flex flex-col gap-2 p-2'>
            <li
              className={clsx([
                'block cursor-pointer rounded px-2 py-1.2 hover:bg-component',
                !folder ? 'text-brand' : '',
              ])}
              onClick={() => {
                setFolder(0)
                setSelect([])
              }}
            >
              {t('fields.all', {
                ns: 'file',
              })}
            </li>
            {dirData?.data?.map((item: Record<string, any>, key: number) => (
              <li
                key={key}
                className={clsx([
                  'block cursor-pointer rounded px-2 py-1.2 hover:bg-component flex group',
                  folder == item.id ? 'text-brand' : '',
                ])}
              >
                <div
                  className='w-0 flex-1'
                  onClick={() => {
                    setFolder(item.id)
                    setSelect([])
                  }}
                >
                  {item.name}
                </div>
                <div className='invisible flex flex-none items-center text-primary group-hover:visible hover:text-error'>
                  <Popconfirm
                    content={'确认删除目录吗？'}
                    onConfirm={() => {
                      mutateCustom(
                        {
                          method: 'delete',
                          url: config.apiPath.uploadManage || 'upload/manage',
                          values: {},
                          meta: {
                            params: {
                              id: item.id,
                              type: 'folder-delete',
                            },
                          },
                        },
                        {
                          onSuccess() {
                            if (folder == item.id) {
                              setFolder(0)
                            }
                            dirRefetch()
                          },
                        }
                      )
                    }}
                  >
                    <Icon name='close' />
                  </Popconfirm>
                </div>
              </li>
            ))}

            <li>
              <Popup
                showArrow
                trigger='click'
                destroyOnClose
                visible={create}
                content={
                  <div className='flex gap-2 px-1 py-2'>
                    <div className='flex-1'>
                      <Input
                        placeholder={t('placeholder.dirName', {
                          ns: 'file',
                        })}
                        value={folderName}
                        onChange={(v) => setFolderName(v)}
                      />
                    </div>
                    <div className='flex-none'>
                      <Button
                        theme='default'
                        shape='square'
                        variant='base'
                        onClick={() => {
                          setCreate(false)
                          mutateCustom(
                            {
                              method: 'post',
                              url: config.apiPath.uploadManage || 'upload/manage',
                              values: {
                                name: folderName,
                              },
                              meta: {
                                params: {
                                  type: 'folder-create',
                                },
                              },
                            },
                            {
                              onSuccess() {
                                setSelect([])
                                setFolderName('')
                                dirRefetch()
                              },
                            }
                          )
                        }}
                      >
                        <Icon name='check' />
                      </Button>
                    </div>
                    <div className='flex-none'>
                      <Button
                        theme='danger'
                        shape='square'
                        variant='base'
                        onClick={() => {
                          setCreate(false)
                          setFolderName('')
                        }}
                      >
                        <Icon name='close' />
                      </Button>
                    </div>
                  </div>
                }
              >
                <Button
                  theme='default'
                  variant='dashed'
                  className='w-full'
                  onClick={() => {
                    setCreate(true)
                  }}
                >
                  {t('fields.create', {
                    ns: 'file',
                  })}
                </Button>
              </Popup>
            </li>
          </ul>
        </div>
      </div>
      <div className='w-0 flex flex-1 flex-col'>
        <div className='flex-1 overflow-auto p-3'>
          {isLoading ? (
            <div className='h-450px'>
              <div className='grid grid-cols-4 gap-3'>
                {[1, 2, 3, 4].map((item, key) => (
                  <LoadingItem key={key} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {result?.data?.length > 0 ? (
                <>
                  <div className='h-450px'>
                    <div className='grid grid-cols-4 gap-3'>
                      {result?.data?.map((item: Record<string, any>, key: number) => (
                        <FileItem
                          key={key}
                          active={select.includes(item.id)}
                          title={item.name}
                          url={item.url}
                          size={item.size}
                          mime={item.mime}
                          onClick={() => {
                            setSelect((old) => {
                              if (old.includes(item.id)) {
                                return old.filter((v) => v != item.id)
                              } else {
                                if (mode == 'single') {
                                  return [item.id]
                                } else {
                                  return [...old, item.id]
                                }
                              }
                            })
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='mt-4'>
                    <Pagination
                      total={result?.meta?.total || 0}
                      pageSizeOptions={[]}
                      pageSize={12}
                      current={page}
                      onChange={(v) => {
                        setPage(v.current)
                        setSelect([])
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className='h-450px flex items-center justify-center'>
                  <div className='flex flex-col items-center gap-2'>
                    <div>
                      <Icon name='application' size={80} />
                    </div>
                    <div className='mt-4 text-base text-primary'>
                      {t('placeholder.noData', {
                        ns: 'file',
                      })}
                    </div>
                    <div className='text-sm'>
                      {t('placeholder.noDataDesc', {
                        ns: 'file',
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className='flex justify-between border-t p-3 border-component'>
          <div>
            {select.length > 0 && (
              <Popconfirm
                content={t('placeholder.delete', {
                  ns: 'file',
                })}
                onConfirm={() => {
                  mutateCustom(
                    {
                      method: 'delete',
                      url: config.apiPath.uploadManage || 'upload/manage',
                      values: {},
                      meta: {
                        params: {
                          id: select.join(','),
                          type: 'files-delete',
                        },
                      },
                    },
                    {
                      onSuccess() {
                        setSelect([])
                        fileRefetch()
                      },
                    }
                  )
                }}
              >
                <Button
                  shape='circle'
                  theme='danger'
                  variant='outline'
                  icon={<Icon name='delete' />}
                />
              </Popconfirm>
            )}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={onClose}>
              {t('fields.cancel', {
                ns: 'file',
              })}
            </Button>
            <Button
              disabled={select.length <= 0}
              onClick={() => {
                const data = (result?.data as Record<string, any>[])?.filter((item) => {
                  return select.includes(item.id)
                })
                onChange?.(data)
                onClose?.()
              }}
            >
              {t('fields.confirm', {
                ns: 'file',
              })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingItem = () => {
  return (
    <div
      className={clsx([
        'cursor-pointer overflow-hidden border rounded p-2 hover:border-brand border-component',
      ])}
    >
      <div className='relative h-20'>
        <Skeleton animation='flashed' className='h-full w-full'>
          {' '}
        </Skeleton>
      </div>
      <div className='mt-1 flex flex-col gap-0.5 px-1'>
        <div className='truncate text-sm text-primary'>
          <Skeleton animation='flashed'> </Skeleton>
        </div>
        <div className='text-xs text-secondary'>
          <Skeleton animation='flashed'> </Skeleton>
        </div>
      </div>
    </div>
  )
}

interface FileItemProps {
  url?: string
  mime?: string
  title?: string
  size?: string
  active?: boolean
  onClick?: () => void
}

const FileItem = ({ title, size, url, mime, active, onClick }: FileItemProps) => {
  return (
    <div
      className={clsx([
        'cursor-pointer overflow-hidden border rounded p-2 hover:border-brand',
        active ? 'border-brand' : 'border-component',
      ])}
      onClick={onClick}
    >
      <div className='relative h-20'>
        <FileTopic mime={mime} url={url} />
        {active && (
          <div className='absolute z-1 h-10 w-10 flex rotate-45 items-end justify-center bg-brand -right-7 -top-7'>
            <div className='i-tabler:check text-white -rotate-45'></div>
          </div>
        )}
      </div>
      <div className='mt-1 flex flex-col gap-0.5 px-1'>
        <div className='truncate text-sm text-primary' title={title}>
          {title}
        </div>
        <div className='text-xs text-secondary'>{size}</div>
      </div>
    </div>
  )
}

interface FileIconProps {
  mime?: string
  url?: string
}
const FileTopic = ({ mime = '', url }: FileIconProps) => {
  switch (true) {
    case /^image\//.test(mime):
      return <Image className='bg-component' src={url} fit='contain' style={{ height: '100%' }} />
    case /^video\//.test(mime):
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-success'>
          <div className='i-tabler:video h-6 w-6'></div>
        </div>
      )
    case /^music\//.test(mime):
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-warning'>
          <div className='i-tabler:audio h-6 w-6'></div>
        </div>
      )
    case /^application\/pdf$/.test(mime):
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-error'>
          <div className='i-tabler:pdf h-6 w-6'></div>
        </div>
      )
    case /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/.test(mime):
    case /^application\/msword$/.test(mime):
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-type-doc h-6 w-6'></div>
        </div>
      )
    case /^application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet$/.test(mime):
    case /^application\/vnd\.ms-excel$/.test(mime):
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-type-xls h-6 w-6'></div>
        </div>
      )
    case /^application\/zip$/.test(mime):
    case /^application\/x-rar-compressed$/.test(mime):
    case /^application\/x-7z-compressed$/.test(mime):
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-zip h-6 w-6'></div>
        </div>
      )
    default:
      return (
        <div className='h-full w-full flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-unknown h-6 w-6'></div>
        </div>
      )
  }
}

export default FileManage

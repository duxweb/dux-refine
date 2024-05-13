export interface FileIconProps {
  mime: string
}

export const FileIcon = ({ mime }: FileIconProps) => {
  switch (true) {
    case /^image\//.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:photo h-6 w-6'></div>
        </div>
      )
    case /^video\//.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-success'>
          <div className='i-tabler:video h-6 w-6'></div>
        </div>
      )
    case /^audio\//.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-warning'>
          <div className='i-tabler:audio h-6 w-6'></div>
        </div>
      )
    case /^application\/pdf$/.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-error'>
          <div className='i-tabler:file-pdf h-6 w-6'></div>
        </div>
      )
    case /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/.test(mime):
    case /^application\/msword$/.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-word h-6 w-6'></div>
        </div>
      )
    case /^application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet$/.test(mime):
    case /^application\/vnd\.ms-excel$/.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-excel h-6 w-6'></div>
        </div>
      )
    case /^application\/zip$/.test(mime):
    case /^application\/x-rar-compressed$/.test(mime):
    case /^application\/x-7z-compressed$/.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-zip h-6 w-6'></div>
        </div>
      )
    case /^text\//.test(mime):
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-text h-6 w-6'></div>
        </div>
      )
    default:
      return (
        <div className='h-10 w-10 flex items-center justify-center rounded p-2 text-white bg-brand'>
          <div className='i-tabler:file-unknown h-6 w-6'></div>
        </div>
      )
  }
}

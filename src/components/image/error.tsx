export interface ImageErrorProps {
  size?: string | number
}

export const ImageError = ({ size = 16 }: ImageErrorProps) => {
  return (
    <div className='flex items-center justify-center'>
      <div
        className='i-tabler:photo-x'
        style={{
          width: size,
          height: size,
        }}
      ></div>
    </div>
  )
}

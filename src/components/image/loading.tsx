export interface ImageLoadingProps {
  size?: string | number
}

export const ImageLoading = ({ size = 16 }: ImageLoadingProps) => {
  return (
    <div className='flex items-center justify-center'>
      <div
        className='i-tabler:loader-2 animate-spin'
        style={{
          width: size,
          height: size,
        }}
      ></div>
    </div>
  )
}

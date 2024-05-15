import { ImageViewer, Image } from 'tdesign-react/esm'
import { ImageLoading } from './loading'

export interface ImagesProps {
  images?: string[]
  size?: string | number
}

export const Images = ({ images, size = 60 }: ImagesProps) => {
  return (
    <div className='flex flex-wrap gap-1'>
      {images?.map((url: string, index: number) => (
        <ImageViewer
          trigger={({ open }) => (
            <Image
              src={url}
              style={{ width: size, height: size }}
              onClick={open}
              loading={<ImageLoading size={size} />}
            />
          )}
          images={images}
          key={index}
        />
      ))}
    </div>
  )
}

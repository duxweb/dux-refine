import { clsx } from 'clsx'
import React, { forwardRef, ReactNode } from 'react'
import { Avatar, AvatarProps, Image, ImageProps } from 'tdesign-react/esm'
import './style.css'
import { ImageError } from '../image'
import { ImageLoading } from '../image/loading'
export interface MediaTextProps {
  children?: ReactNode
  size?: 'default' | 'small'
}

const MediaTextComp = (
  { size = 'default', children }: MediaTextProps,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div className={clsx(['app-media-text', size == 'small' ? 'app-media-text-sm' : ''])} ref={ref}>
      {React.Children.map(
        children,
        (child) =>
          React.isValidElement(child) &&
          ((child.type as React.FunctionComponent).displayName === 'MediaText.Image' ||
            (child.type as React.FunctionComponent).displayName === 'MediaText.Avatar') &&
          child
      )}
      <div className='app-media-text-content'>
        {React.Children.map(
          children,
          (child) =>
            React.isValidElement(child) &&
            (child.type as React.FunctionComponent).displayName === 'MediaText.Title' &&
            child
        )}
        <div className='empty:hidden'>
          {React.Children.map(
            children,
            (child) =>
              React.isValidElement(child) &&
              (child.type as React.FunctionComponent).displayName === 'MediaText.Desc' &&
              child
          )}
        </div>
      </div>
    </div>
  )
}

const MediaTextAvatar = (props: AvatarProps) => {
  return <Avatar {...props} />
}
MediaTextAvatar.displayName = 'MediaText.Avatar'

interface MediaTextImageProps extends ImageProps {
  width?: string | number
  height?: string | number
  statsSize?: string | number
}

const MediaTextImage = (props: MediaTextImageProps) => {
  const { width = 45, height = 45, shape = 'round', statsSize = 18 } = props
  return (
    <Image
      error={<ImageError size={statsSize} />}
      shape={shape}
      style={{ width: width, height: height }}
      loading={<ImageLoading size={statsSize} />}
      {...props}
    />
  )
}
MediaTextImage.displayName = 'MediaText.Image'

interface MediaTextTitleProps {
  children?: ReactNode
}
const MediaTextTitle = ({ children }: MediaTextTitleProps) => {
  return (
    <div className={clsx(['app-media-text-title'])} data-highlight>
      <div className='inline-block'>{children}</div>
    </div>
  )
}
MediaTextTitle.displayName = 'MediaText.Title'

const MediaTextDesc = ({ children }: { children?: ReactNode }) => {
  return <div className={clsx(['app-media-text-desc'])}>{children}</div>
}
MediaTextDesc.displayName = 'MediaText.Desc'

export const MediaText = forwardRef(MediaTextComp) as React.ForwardRefExoticComponent<
  MediaTextProps & React.RefAttributes<HTMLDivElement>
> & {
  Avatar: typeof MediaTextAvatar
  Image: typeof MediaTextImage
  Title: typeof MediaTextTitle
  Desc: typeof MediaTextDesc
}

MediaText.Image = MediaTextImage
MediaText.Title = MediaTextTitle
MediaText.Desc = MediaTextDesc
MediaText.Avatar = MediaTextAvatar

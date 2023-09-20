import { ReactNodeViewRenderer, mergeAttributes, nodeInputRule } from '@tiptap/react'
import Image, { ImageOptions } from '@tiptap/extension-image'
import { ImageWrapper } from './warpper/imageWarpper'

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: {
        src: string
        width?: string | number
        height?: string | number
      }) => ReturnType
    }
  }
}
export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/
export const ImageResize = Image.extend<ImageOptions>({
  name: 'imageResize',
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '300',
      },
      height: {
        default: 'auto',
      },
      ratio: {
        default: true,
        renderHTML: () => {
          return {}
        },
      },
    }
  },

  addNodeView() {
    return (props) => {
      return ReactNodeViewRenderer(ImageWrapper, {
        className: 'inline-block',
      })(props)
    }
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title, height, width, ratio] = match
          return { src, alt, title, height, width, ratio }
        },
      }),
    ]
  },
})

import { Component, FC, ReactElement, useEffect } from 'react'
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
      inline: {
        default: true,
        renderHTML: () => {
          return {}
        },
      },
      align: {
        default: '',
        renderHTML: () => {
          return {}
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes.inline) {
      let style = ''
      switch (HTMLAttributes.align) {
        case 'left':
          style = `float: left`
          break
        case 'right':
          style = `float: right`
          break
      }
      return ['img', mergeAttributes(this.options.HTMLAttributes, { style: style }, HTMLAttributes)]
    }
    let style = ''
    switch (HTMLAttributes.align) {
      case 'right':
        style = `text-align: right`
        break
      case 'center':
        style = `text-align: center`
        break
      default:
        style = `text-align: left`
    }
    return [
      'div',
      { style: style },
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ]
  },

  addNodeView() {
    return (props) => {
      const { node } = props

      // const alignClass = () => {
      //   if (node.attrs.inline) {
      //     switch (node.attrs.align) {
      //       case 'left':
      //         return 'float-left'
      //       case 'right':
      //         return 'float-right'
      //     }
      //   }
      //   switch (node.attrs.align) {
      //     case 'left':
      //       return 'text-left'
      //     case 'right':
      //       return 'text-right'
      //     case 'center':
      //       return 'text-center'
      //   }
      // }

      console.log(node.attrs.inline)

      return ReactNodeViewRenderer(ImageWrapper, {
        className: 'inline-block',
        // titap bug not working
        //className: [node.attrs.inline ? 'inline-block' : 'block', alignClass()].join(' '),
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

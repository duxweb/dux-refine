import { nodeInputRule, Node, mergeAttributes } from '@tiptap/react'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { VideoWrapper } from './warpper/videoWarpper'

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: {
        src: string
        width?: string | number
        height?: string | number
      }) => ReturnType
    }
  }
}

export interface VideoOptions {
  HTMLAttributes: Record<string, any>
}

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const Video = Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  draggable: true,
  selectable: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '500px',
      },
      height: {
        default: 'auto',
      },
      autoPlay: {
        default: false,
      },
      controls: {
        default: true,
      },
      poster: {
        default: null,
      },
      ratio: {
        default: true,
        renderHTML: () => {
          return {}
        },
      },
      align: {
        default: 'center',
        renderHTML: () => {
          return {}
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const textAlign = HTMLAttributes.align ? `text-align: ${HTMLAttributes.align};` : ''
    return [
      'div',
      ['video', mergeAttributes(this.options.HTMLAttributes, { style: textAlign }, HTMLAttributes)],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoWrapper)
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title, height, width, autoplay, controls, poster, ratio, align] =
            match
          return { src, alt, title, height, width, autoplay, controls, poster, ratio, align }
        },
      }),
    ]
  },
})

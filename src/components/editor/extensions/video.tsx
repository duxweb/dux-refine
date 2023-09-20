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
  inline: true,
  group: 'inline',
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
    return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoWrapper, {
      className: 'inline-block',
    })
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
          const [, , alt, src, title, height, width, autoplay, controls, poster, ratio] = match
          return { src, alt, title, height, width, autoplay, controls, poster, ratio }
        },
      }),
    ]
  },
})

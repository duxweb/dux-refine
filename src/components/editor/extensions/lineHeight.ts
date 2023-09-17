/**
 * import https://github.com/fantasticit/think
 */

import { Extension } from '@tiptap/react'

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (val: number) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => {
              return element.style.lineHeight.replace(/['"]+/g, '')
            },
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ commands }) => {
          return this.options.types.every((type: any) =>
            commands.updateAttributes(type, { lineHeight })
          )
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: any) =>
            commands.resetAttributes(type, 'lineHeight')
          )
        },
    }
  },
})

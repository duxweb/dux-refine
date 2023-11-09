import { Fragment, cloneElement, isValidElement, useMemo } from 'react'

interface RenderProps {
  mark: string | string[]
  option?: Record<string, any[]>
}

class AppHook {
  elements: Record<string, any> = {}

  add = (mark: string | string[], ...element: any) => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    if (!this.elements[name]) {
      this.elements[name] = []
    }
    this.elements[name].push(...element)
  }

  useMark = (mark: string | string[]): any[] => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    const res = useMemo(() => {
      return this.elements[name] || []
    }, [name])
    return res
  }

  Render = ({ mark, option }: RenderProps) => {
    const name = useMemo(() => {
      if (Array.isArray(mark)) {
        return mark.join('.')
      }
      return mark
    }, [mark])

    const element: any[] = this.elements[name]
    if (!element?.length) {
      return null
    }
    return element.map((item, index) => {
      if (item instanceof Array && !isValidElement(item[0])) {
        const [Item, props] = item
        return <Item key={index} {...props} {...option} />
      } else {
        return <Fragment key={index}>{cloneElement(item)}</Fragment>
      }
    })
  }
}

export const appHook = new AppHook()

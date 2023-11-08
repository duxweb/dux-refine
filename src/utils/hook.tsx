import { Fragment, cloneElement, isValidElement, useMemo } from 'react'

interface RenderProps {
  mark: string
  option?: Record<string, any[]>
}

class AppHook {
  elements: Record<string, any> = {}

  add = (mark: string, ...element: any) => {
    if (!this.elements[mark]) {
      this.elements[mark] = []
    }
    this.elements[mark].push(...element)
  }

  useMark = (mark: string) => {
    const res = useMemo(() => this.elements[mark] || [], [mark])

    return res
  }

  Render = ({ mark, option }: RenderProps) => {
    const element: any[] = this.elements[mark]
    if (!element?.length) {
      return null
    }
    return element.map((item, index) => {
      if (item instanceof Array && !isValidElement(item[0])) {
        const [Item, props] = item
        return <Item key={index} {...props} {...option} />
      } else {
        console.log(item)
        return <Fragment key={index}>{cloneElement(item)}</Fragment>
      }
    })
  }
}

export const appHook = new AppHook()

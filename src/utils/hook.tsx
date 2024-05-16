import React, { ReactNode, useMemo } from 'react'

interface RenderProps {
  mark: string | string[]
  option?: Record<string, any>
  children?: any
  max?: number
}

interface ElementsProps {
  self: Record<string, any[]>[]
  before: Record<string, any[]>[]
  after: Record<string, any[]>[]
  container: Record<string, any[]>[]
}

type Mark = string | string[]

export class RenderHook {
  elements: Record<string, ElementsProps> = {}

  _initItem = (mark: string) => {
    if (!this.elements[mark]) {
      this.elements[mark] = {
        self: [],
        before: [],
        after: [],
        container: [],
      }
    }
  }

  /** 添加到标记 如果标记有子元素 子元素将被替换 */
  add = (mark: Mark, ...element: any) => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    this._initItem(name)
    this.elements[name].self.push(...element)
  }

  /** 给标记添加前缀 */
  addBefore = (mark: Mark, ...element: any) => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    this._initItem(name)
    this.elements[name].before.push(...element)
  }

  /** 给标记添加后缀 */
  addAfter = (mark: Mark, ...element: any) => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    this._initItem(name)
    this.elements[name].after.push(...element)
  }

  /** 给标记添加容器，这些容器是一个组件，可以套在此标记的外层，并控制这个标记的子元素 */
  addContainer = (mark: Mark, ...container: any) => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    this._initItem(name)
    this.elements[name].container.push(...container)
  }

  useMark = (mark: Mark): any[] => {
    const name = Array.isArray(mark) ? mark.join('.') : mark
    return this.elements[name]?.self || []
  }

  Render = ({ mark, children, option, max }: RenderProps) => {
    const [element, markItem] = useMemo(() => {
      const name = Array.isArray(mark) ? mark.join('.') : mark
      const _markItem = this.elements[name] || {}
      const _element = _markItem.self?.length
        ? max
          ? _markItem.self.slice(_markItem.self.length - max)
          : _markItem.self
        : typeof children !== 'undefined'
          ? [children]
          : []

      if (_markItem.before?.length) {
        _element.unshift(..._markItem.before)
      }
      if (_markItem.after?.length) {
        _element.push(..._markItem.after)
      }
      return [
        _element.map((item, index) => {
          if (typeof item === 'function') {
            const Item = item
            return <Item key={index} {...option} />
          } else if (item instanceof Array && typeof item[0] === 'function') {
            const [Item, props] = item
            return <Item key={index} {...props} {...option} />
          } else {
            return item
          }
        }),
        _markItem,
      ]
    }, [children, mark, max, option])

    if (!markItem.container?.length) {
      return element
    }

    return (
      <Container containers={markItem.container} option={option}>
        {element}
      </Container>
    )
  }
}

interface ContainerProps {
  containers: any[]
  option?: Record<string, any>
  index?: number
  children?: ReactNode
}

const Container = ({ containers, option, index = 0, children }: ContainerProps) => {
  if (index === containers.length) {
    return children
  }

  const Item = containers[index]

  return (
    <Item {...option}>
      <Container index={index + 1} containers={containers} option={option}>
        {children}
      </Container>
    </Item>
  )
}

export const appHook = new RenderHook()

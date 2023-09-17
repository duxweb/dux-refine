import { Divider } from 'tdesign-react/esm'
import { UIMenuBar } from './ui/menu'
import { UndoItem } from './menus/action/undo'
import { RedoItem } from './menus/action/redo'
import { TitleItem } from './menus/typography/title'
import { FontSizeItem } from './menus/typography/fontSize'
import { LineHeightItem } from './menus/typography/lineHeight'
import { AlignItem } from './menus/typography/align'
import { BoldItem } from './menus/typography/bold'
import { ItalicItem } from './menus/typography/italic'
import { StrikeItem } from './menus/typography/strike'
import { CodeItem } from './menus/typography/code'
import { ClearItem } from './menus/typography/clear'
import { FontColorItem } from './menus/color/fontColor'
import { BgColorItem } from './menus/color/bgColor'
import { BulletListItem } from './menus/list/bulletList'
import { OrderedListItem } from './menus/list/orderedList'
import { TableItem } from './menus/table'
import { ImageItem } from './menus/media/image'
import { VideoItem } from './menus/media/video'
import { useMemo } from 'react'
import { TypeItem } from './menus/typography/type'
import { useEditorContext } from './editor'
import { LinkItem } from './menus/media/link'

interface MenuProps {
  toolsBar?: string[]
}
export const MenuBar = ({
  toolsBar = [
    'undo',
    'redo',
    '|',
    'type',
    '|',
    'title',
    'fontSize',
    'lineHeight',
    'align',
    '|',
    'bold',
    'italic',
    'strike',
    'code',
    'clear',
    '|',
    'fontColor',
    'bgColor',
    '|',
    'bulletList',
    'orderedList',
    '|',
    'link',
    'table',
    'image',
    'video',
  ],
}: MenuProps) => {
  const { editor } = useEditorContext()

  const toolsBarPlugin = useMemo<Record<string, any>>(() => {
    return {
      undo: UndoItem,
      redo: RedoItem,
      type: TypeItem,
      title: TitleItem,
      fontSize: FontSizeItem,
      lineHeight: LineHeightItem,
      align: AlignItem,
      bold: BoldItem,
      italic: ItalicItem,
      strike: StrikeItem,
      code: CodeItem,
      clear: ClearItem,
      fontColor: FontColorItem,
      bgColor: BgColorItem,
      bulletList: BulletListItem,
      orderedList: OrderedListItem,
      link: LinkItem,
      table: TableItem,
      image: ImageItem,
      video: VideoItem,
    }
  }, [])

  if (!editor) {
    return null
  }

  return (
    <UIMenuBar>
      {toolsBar.map((name, key) => {
        if (name === '|') {
          return <Divider key={key} layout='vertical'></Divider>
        }
        const ToolBarItem = toolsBarPlugin[name]
        if (!ToolBarItem) {
          return null // 未找到对应的工具项
        }
        return <ToolBarItem key={key} />
      })}
    </UIMenuBar>
  )
}

import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/mode-latte'
import 'ace-builds/src-noconflict/theme-tomorrow_night'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'
import { useAppStore } from '../../stores'
import clsx from 'clsx'

export interface CodeEditorProps {
  onChange?: (value: string) => void
  defaultValue?: string
  value?: string
  type?: string
  className?: string
  [key: string]: any
}

export const CodeEditor = ({
  onChange,
  value,
  defaultValue,
  type = 'json',
  className,
  ...props
}: CodeEditorProps) => {
  const dark = useAppStore((state) => state.dark)
  return (
    <div className={clsx(['border border-component w-full rounded-sm', className])}>
      <AceEditor
        defaultValue={defaultValue}
        value={value || ''}
        width='100%'
        fontSize='14px'
        theme={dark ? 'tomorrow_night' : 'tomorrow'}
        mode={type}
        onChange={(code) => onChange?.(code)}
        className='rounded-sm'
        {...props}
      />
    </div>
  )
}

import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-bash'
import { useAppStore } from '../../stores'
import clsx from 'clsx'
import './prism.scss'
import './prism-dark.scss'

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
    <div
      className={clsx([
        'border border-component p-2 w-full rounded-sm',
        className,
        dark ? 'app-code-dark' : 'app-code-light',
      ])}
    >
      <Editor
        defaultValue={defaultValue}
        value={value || ''}
        onValueChange={(code) => onChange?.(code)}
        highlight={(code) => highlight(code, languages.js, type)}
        {...props}
      />
    </div>
  )
}

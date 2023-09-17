import { useEffect } from 'react'
import { useCurrentEditor } from '@tiptap/react'
import { Button, Input, Checkbox, Form } from 'tdesign-react/esm'
import { useTranslate } from '@refinedev/core'
import { UIMenuItem } from '../ui/menu'

export const VideoBubble = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <>
      <UIMenuItem
        onClick={() => editor.chain().focus().updateAttributes('video', { width: '30%' }).run()}
        active={editor?.getAttributes('video').width == '30%'}
      >
        30%
      </UIMenuItem>

      <UIMenuItem
        onClick={() => editor.chain().focus().updateAttributes('video', { width: '50%' }).run()}
        active={editor?.getAttributes('video').width == '50%'}
      >
        50%
      </UIMenuItem>

      <UIMenuItem
        onClick={() => editor.chain().focus().updateAttributes('video', { width: '100%' }).run()}
        active={editor?.getAttributes('video').width == '100%'}
      >
        100%
      </UIMenuItem>

      <UIMenuItem
        label={t('video.bubble.control', { ns: 'editor' })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .updateAttributes('video', { controls: !editor?.getAttributes('video').controls })
            .run()
        }}
        icon='i-tabler:adjustments'
        active={editor?.getAttributes('video').controls}
      ></UIMenuItem>

      <UIMenuItem
        type='menu'
        label={t('video.bubble.align', { ns: 'editor' })}
        menuOptions={[
          {
            content: t('video.bubble.left', { ns: 'editor' }),
            value: 'left',
            prefixIcon: <div className='tiptap-menu-icon i-tabler:align-left'></div>,
          },
          {
            content: t('video.bubble.center', { ns: 'editor' }),
            value: 'center',
            prefixIcon: <div className='tiptap-menu-icon i-tabler:align-center'></div>,
          },
          {
            content: t('video.bubble.right', { ns: 'editor' }),
            value: 'right',
            prefixIcon: <div className='tiptap-menu-icon i-tabler:align-right'></div>,
          },
        ]}
        onMenuSelect={(item) => {
          editor.chain().focus().updateAttributes('video', { align: item.value }).run()
        }}
        icon='i-tabler:align-center'
      />

      <UIMenuItem
        type='popup'
        label={t('video.bubble.size', { ns: 'editor' })}
        popupRender={(close) => <Config close={close} />}
        icon='i-tabler:ruler'
      />
    </>
  )
}

interface ConfigProps {
  close: () => void
}

const Config = ({ close }: ConfigProps) => {
  const { editor } = useCurrentEditor()
  const [form] = Form.useForm()
  const isRatio = Form.useWatch('ratio', form)
  const t = useTranslate()

  useEffect(() => {
    if (isRatio) {
      form.setFieldsValue({
        height: 'auto',
      })
    }
  }, [form, isRatio])

  return (
    <div className='tiptap-popup'>
      <Form
        form={form}
        initialData={{
          width: editor?.getAttributes('video').width,
          height: editor?.getAttributes('video').height,
          ratio: editor?.getAttributes('video').ratio,
        }}
        onSubmit={(context) => {
          close()
          setTimeout(() => {
            editor
              ?.chain()
              .focus()
              .updateAttributes('video', {
                width: context.fields.width,
                height: context.fields.ratio ? 'auto' : context.fields.height,
                ratio: context.fields.ratio,
              })
              .run()
          }, 150)
        }}
      >
        <Form.FormItem className='tiptap-popup-space' name='width'>
          <Input align='right' label={t('video.bubble.width', { ns: 'editor' })} />
        </Form.FormItem>
        <Form.FormItem className='tiptap-popup-space' name='height'>
          <Input
            align='right'
            label={t('video.bubble.height', { ns: 'editor' })}
            disabled={isRatio}
          />
        </Form.FormItem>
        <Form.FormItem className='tiptap-popup-space' name='ratio'>
          <Checkbox>{t('video.bubble.ratio', { ns: 'editor' })}</Checkbox>
        </Form.FormItem>
        <div>
          <Button shape='rectangle' size='medium' type='submit' variant='base' block>
            {t('common.confirm', { ns: 'editor' })}
          </Button>
        </div>
      </Form>
    </div>
  )
}

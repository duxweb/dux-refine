import { useEffect } from 'react'
import { Button, Input, Checkbox, Form } from 'tdesign-react/esm'
import { UIMenuItem } from '../ui/menu'
import { useTranslate } from '@refinedev/core'
import { useEditorContext } from '../editor'

export const ImageBubble = () => {
  const { editor } = useEditorContext()

  if (!editor) {
    return null
  }

  return (
    <>
      <UIMenuItem
        onClick={() =>
          editor.chain().focus().updateAttributes('imageResize', { width: '30%' }).run()
        }
        active={editor?.getAttributes('imageResize').width == '30%'}
      >
        30%
      </UIMenuItem>

      <UIMenuItem
        onClick={() =>
          editor.chain().focus().updateAttributes('imageResize', { width: '50%' }).run()
        }
        active={editor?.getAttributes('imageResize').width == '50%'}
      >
        50%
      </UIMenuItem>

      <UIMenuItem
        onClick={() =>
          editor.chain().focus().updateAttributes('imageResize', { width: '100%' }).run()
        }
        active={editor?.getAttributes('imageResize').width == '100%'}
      >
        100%
      </UIMenuItem>

      <UIMenuItem
        type='popup'
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
  const { editor } = useEditorContext()
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
          width: editor?.getAttributes('imageResize').width,
          height: editor?.getAttributes('imageResize').height,
          ratio: editor?.getAttributes('imageResize').ratio,
        }}
        onSubmit={(context) => {
          console.log(context.fields.ratio)
          close()
          setTimeout(() => {
            editor
              ?.chain()
              .focus()
              .updateAttributes('imageResize', {
                width: context.fields.width,
                height: context.fields.ratio ? 'auto' : context.fields.height,
                ratio: context.fields.ratio,
              })
              .run()
          }, 150)
        }}
      >
        <Form.FormItem className='tiptap-popup-space' name='width'>
          <Input align='right' label={t('image.width', { ns: 'editor' })} />
        </Form.FormItem>
        <Form.FormItem className='tiptap-popup-space' name='height'>
          <Input align='right' label={t('image.height', { ns: 'editor' })} disabled={isRatio} />
        </Form.FormItem>
        <Form.FormItem className='tiptap-popup-space' name='ratio'>
          <Checkbox>{t('image.ratio', { ns: 'editor' })}</Checkbox>
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

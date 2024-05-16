import { useTranslate } from '@refinedev/core'
import { Result } from '../../components/result'
import show from '../../../assets/unauthorized.svg'

export const Unauthorized = () => {
  const translate = useTranslate()

  return (
    <>
      <Result
        show={<img src={show} alt='unauthorized' className='h-50' />}
        type='custom'
        title={translate('pages.unauthorized.title')}
        desc={translate('pages.unauthorized.desc')}
      />
    </>
  )
}

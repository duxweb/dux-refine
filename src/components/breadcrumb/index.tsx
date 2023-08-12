import { useBreadcrumb } from '@refinedev/core'
import { Link } from 'react-router-dom'
import { Breadcrumb as TdBreadcrumb } from 'tdesign-react/esm'

const { BreadcrumbItem } = TdBreadcrumb

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb()

  return (
    <TdBreadcrumb maxItemWidth='200px' separator={<div className='i-tabler:chevron-right'></div>}>
      <BreadcrumbItem>
        <Link to='/admin'>
          <div className='i-tabler:home h-4 w-4'></div>
        </Link>
      </BreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <BreadcrumbItem key={index}>
            {breadcrumb.href ? (
              <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
            ) : (
              breadcrumb.label
            )}
          </BreadcrumbItem>
        )
      })}
    </TdBreadcrumb>
  )
}

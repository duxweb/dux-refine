import React, { forwardRef } from 'react'
import { Main, MainHeader } from '../main'
import { CardTable, CardTableProps, CardTableRef } from './table'

export interface PageTableProps extends CardTableProps {
  headerRender?: () => React.ReactNode
}

export const PageTable = forwardRef(
  ({ headerRender, ...props }: PageTableProps, ref: React.ForwardedRef<CardTableRef>) => {
    return (
      <Main>
        <MainHeader>{headerRender?.()}</MainHeader>
        <CardTable ref={ref} {...props} />
      </Main>
    )
  }
)

PageTable.displayName = 'PageTable'

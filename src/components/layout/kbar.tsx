import { useTranslate } from '@refinedev/core'
import clsx from 'clsx'
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  ActionImpl,
  ActionId,
} from 'kbar'
import React from 'react'

export const Kbar = () => {
  const t = useTranslate()
  return (
    <KBarPortal>
      <KBarPositioner className='backdrop-blur bg-container/20 z-9999'>
        <KBarAnimator className='max-w-100 w-full bg-container rounded-lg shadow-lg overflow-hidden text-primary'>
          <KBarSearch
            defaultPlaceholder={t('common.search')}
            className='p-4 text-base w-full box-border bg-container text-primary outline-none border-none'
          />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

function RenderResults() {
  const { results, rootActionId } = useMatches()

  return (
    <div className='border-t border-component'>
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === 'string' ? (
            <div className='px-4 py-3 text-sm opacity-50'>{item}</div>
          ) : (
            <ResultItem action={item} active={active} currentRootActionId={rootActionId || ''} />
          )
        }
      />
    </div>
  )
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl
      active: boolean
      currentRootActionId: ActionId
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors
      const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId)
      return action.ancestors.slice(index + 1)
    }, [action.ancestors, currentRootActionId])

    return (
      <div
        ref={ref}
        className={clsx([
          'py-3 p-4 border-l-2 flex items-center justify-between cursor-pointer',
          active ? 'bg-component border-brand' : 'bg-transparent border-transparent',
        ])}
      >
        <div className='flex gap-4 items-center text-sm'>
          {action.icon && action.icon}
          <div className='flex flex-col'>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className='opacity-50 mr-3'>{ancestor.name}</span>
                    <span className='mr-3'>&rsaquo;</span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && <span className='text-xs'>{action.subtitle}</span>}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div aria-hidden className='grid grid-flow-col gap-2'>
            {action.shortcut.map((sc) => (
              <kbd key={sc} className='px-2 bg-black/10 rounded text-sm'>
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
)

ResultItem.displayName = 'ResultItem'

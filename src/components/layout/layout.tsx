import React, { ReactNode, Suspense, useCallback, useMemo, useState } from 'react'
import { SiderCollapse, SiderApp } from '../sider'
import { siderType } from '../../core/config'
import { KBarProvider, Action } from 'kbar'
import { Kbar } from './kbar'
import { useMenu } from '../sider/menu'
import { useGo, useLogout, useTranslate, useParsed, CanAccess } from '@refinedev/core'
import { Icon } from 'tdesign-icons-react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useAppStore } from '../../stores/app'
import { useNProgress } from '@tanem/react-nprogress'
import { Loading } from 'tdesign-react/esm'
import { useOutlet } from 'react-router-dom'
import { Unauthorized } from '../../pages/common/unauthorized'

export interface LayoutProps {
  siderType?: siderType
  children?: React.ReactNode
}

export const Layout = ({ children, siderType = 'collapse' }: LayoutProps) => {
  const { defaultOpenKeys, menuData } = useMenu()
  const t = useTranslate()
  const go = useGo()
  const setLight = useAppStore((state) => state.setLight)
  const setDark = useAppStore((state) => state.setDark)
  const { mutate: logout } = useLogout()
  const { pathname } = useParsed()

  const flattenData = useCallback((data: Record<string, any>[], parent = null) => {
    let result: Action[] = []
    data.forEach((item) => {
      const newItem: Action = {
        id: item.name,
        name: t(`${item.label}.name`, item?.label),
        section: t('common.menu'),
        icon: <Icon name={item?.route ? 'link' : 'folder-open'} />,
      }
      if (parent) {
        newItem.parent = parent
      }

      if (item?.route) {
        newItem.perform = () => {
          go({
            to: item.route,
          })
        }
      }
      result.push(newItem)
      if (item.children && item.children.length > 0) {
        result = result.concat(flattenData(item.children, item.name))
      }
    })
    return result
  }, [])

  const actions = useMemo(() => {
    const data = flattenData(menuData, null)

    data.push({
      id: 'light',
      name: t('common.light'),
      section: t('common.more'),
      keywords: 'light',
      icon: <Icon name={'sunny'} />,
      perform: () => {
        setLight()
      },
    })

    data.push({
      id: 'dark',
      name: t('common.dark'),
      section: t('common.more'),
      keywords: 'dark',
      icon: <Icon name={'moon'} />,
      perform: () => {
        setDark()
      },
    })

    data.push({
      id: 'logout',
      name: t('common.logout'),
      section: t('common.more'),
      keywords: 'logout',
      icon: <Icon name={'logout'} />,
      perform: () => {
        logout()
      },
    })
    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flattenData, menuData])

  const [isLoading, setIsLoading] = useState(false)

  const outlet = useOutlet()
  return (
    <KBarProvider actions={actions}>
      <Progress isAnimating={isLoading} key={pathname} />
      <div className='inset-0 h-screen w-screen flex flex-row overflow-hidden'>
        <div className='app-sider-collapse hidden md:block'>
          {(siderType === 'collapse' || siderType === 'level') && (
            <SiderCollapse
              type={siderType}
              col={true}
              defaultOpenKeys={defaultOpenKeys}
              menuData={menuData}
            />
          )}
          {siderType === 'app' && (
            <SiderApp defaultOpenKeys={defaultOpenKeys} menuData={menuData} />
          )}
        </div>

        <SwitchTransition mode='out-in'>
          <CSSTransition
            key={pathname}
            timeout={300}
            appear={true}
            classNames='page'
            nodeRef={null}
            onEnter={() => {
              setIsLoading(true)
            }}
            onEntered={() => {
              setIsLoading(false)
            }}
          >
            <div className='w-1 flex flex-1 flex-col'>
              <CanAccess fallback={<Unauthorized />}>{outlet}</CanAccess>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Kbar />
    </KBarProvider>
  )
}

const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      {/*
      This example doesn't use a spinner component so the UI stays
      tidy. You're free to render whatever is appropriate for your
      use-case.
      */}
    </Container>
  )
}

const Container: React.FC<{
  animationDuration: number
  isFinished: boolean
  children: ReactNode
}> = ({ animationDuration, children, isFinished }) => (
  <div
    style={{
      opacity: isFinished ? 0 : 1,
      pointerEvents: 'none',
      transition: `opacity ${animationDuration}ms linear`,
    }}
  >
    {children}
  </div>
)

const Bar: React.FC<{
  animationDuration: number
  progress: number
}> = ({ animationDuration, progress }) => (
  <div
    style={{
      background: '#29d',
      height: 2,
      left: 0,
      marginLeft: `${(-1 + progress) * 100}%`,
      position: 'fixed',
      top: 0,
      transition: `margin-left ${animationDuration}ms linear`,
      width: '100%',
      zIndex: 1031,
    }}
  >
    <div
      style={{
        boxShadow: '0 0 10px #29d, 0 0 5px #29d',
        display: 'block',
        height: '100%',
        opacity: 1,
        position: 'absolute',
        right: 0,
        transform: 'rotate(3deg) translate(0px, -4px)',
        width: 100,
      }}
    />
  </div>
)

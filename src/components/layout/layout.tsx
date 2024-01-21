import React, { useCallback, useMemo } from 'react'
import { SiderCollapse, SiderApp } from '../sider'
import { siderType } from '../../core/config'
import { KBarProvider, Action } from 'kbar'
import { Kbar } from './kbar'
import { useMenu } from '../sider/menu'
import { useGo, useLogout, useTranslate } from '@refinedev/core'
import { Icon } from 'tdesign-icons-react'
import { useAppStore } from '../../stores/app'

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

  return (
    <KBarProvider actions={actions}>
      <div className='inset-0 h-screen w-screen flex flex-row overflow-hidden'>
        <div className='app-sider-collapse   hidden md:block'>
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
        <div className='w-1 flex flex-1 flex-col'>{children}</div>
      </div>
      <Kbar />
    </KBarProvider>
  )
}

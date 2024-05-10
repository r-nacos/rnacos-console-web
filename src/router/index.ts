import { createRouter, createWebHistory } from 'vue-router'
import { useTitle } from '@vueuse/core'
import type { RouteRecordRaw } from 'vue-router'
import { firstWordCase } from 'encjs/core/strings'
import { isMobile } from 'encjs/core/device'
import Nprogress from 'nprogress'
import type { App } from 'vue'

interface AnyObject {
  [k: string]: any
}

interface AnyRouteRecordRaw {
  [k: string]: RouteRecordRaw
}
/**
 * 创建布局文件关联关系
 *
 * @returns 返回布局文件对象
 */
const createLayoutComponentsRelation = (): AnyObject => {
  const layouts = import.meta.glob('@/layouts/*.vue') as any
  const comps: AnyObject = {}
  Object.keys(layouts).forEach(key => {
    const routerPath = key.replace(/.vue|\/src\/pages/g, '')
    const pathArr = routerPath.split('/').filter(path => path !== '')
    comps[pathArr[pathArr.length - 1]] = layouts[key]
  })
  return comps
}

const getCompInfo = (): any => {
  const pages = import.meta.glob('@/pages/**') as any
  const fns = new Array<any>()
  const keys = new Array<string>()
  const comps = new Array<any>()
  Object.keys(pages).forEach(key => {
    const comp = pages[key]
    keys.push(key.replace(/.vue|\/src\/pages/g, ''))
    comps.push(comp)
    if (typeof comp === 'function') {
      fns.push(comp())
    }
  })
  return new Promise((resolve, reject) => {
    Promise.all(fns).then(resArr => {
      const arr = new Array<any>()
      if (Array.isArray(resArr)) {
        resArr.forEach((item, index) => {
          arr.push({
            layout: item['default']['layout'] || '',
            comp: comps[index],
            key: keys[index],
            title: item['default']['title'] || '',
          })
        })
      }
      resolve(arr)
    })
  })
}

/**
 * 创建组件与布局文件的对应关系
 *
 * @returns 组件列表
 */
const createViewsComponentsRelation = async () => {
  const pages = await getCompInfo()
  return new Promise((resolve, reject) => {
    const routeArr = new Array<RouteRecordRaw>()
    pages.forEach((item: any) => {
      const routerPath = item.key as string
      const meta: any = {
        isAuth: routerPath.includes('login') ? false : true,
      }
      Object.keys(item).forEach(k => {
        meta[k] = item[k] || ''
      })
      const routerItem: RouteRecordRaw = {
        name: routerPath
          .replace('_', '')
          .split('/')
          .filter(s => s)
          .map(s => firstWordCase(s))
          .join(''),
        path: routerPath.replace('_id', ':id'),
        component: item.comp,
        meta: meta,
      }
      routeArr.push(routerItem)
    })
    resolve(routeArr)
  })
}

/**
 * 初始化路由
 * @returns 返回路由对象
 */
const initRoutes = async () => {
  const layouts = createLayoutComponentsRelation()
  const routes = (await createViewsComponentsRelation()) as any
  if (routes && routes.length > 0) {
    return routes.map((route: any) => {
      if (route.path.lastIndexOf('/index') > 0) {
        route.path = route.path.substring(0, route.path.lastIndexOf('/index'))
      } else if (route.path === '/index' || route.path === 'index') {
        route.path = ''
      }
      if (!route.meta.title) {
        route.meta.title = route.name
      }
      if (!route.meta.layout) {
        return route
      } else {
        return {
          path: route.path,
          meta: route.meta,
          name: `Parent${route.name}`,
          component: layouts[route.meta?.layout || 'default'],
          children: route.path === '/' ? [route] : [{ ...route, path: '' }],
        }
      }
    })
  }
  return routes
}

const init = async (app: App<Element>) => {
  const routes = await initRoutes()
  // 匹配不到的路由跳转到404
  routes.push({
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  })
  const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_WEB_ROOT_PATH),
    routes: routes,
  })

  // 初始化全局路由
  window.navList = routes

  /**
   * 路由前置守卫
   */
  router.beforeEach((to, form, next) => {
    Nprogress.configure({ showSpinner: false })
    Nprogress.start()
    if (isMobile() && to.query.vconsole) {
      Logger.log('动态开启vconsole')
    }
    if (to.meta.isAuth) {
      /* if (to.meta.isAuth) {
        const token = sessionStorage.getItem('token')
        if (token) {
          next()
        } else {
          next('/login')
        }
      } else {
        next()
      } */
      next()
    } else {
      next()
    }
  })

  /**
   * 路由后置守卫
   */
  router.afterEach(to => {
    Nprogress.done()
    const meta: AnyObject = to.meta || {}
    const { title, pv } = meta
    useTitle(title || '')
  })

  app.use(router)
  app.mount('#app')
}

export default init

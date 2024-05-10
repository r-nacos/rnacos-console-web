import type { WebResource } from '@/types/base'
// import { sideAllMenu } from '@/route/routes';
import { defineStore } from 'pinia'
import { ServerOutline, CubeOutline, AppsSharp } from '@vicons/ionicons5'
const VERSION = import.meta.env.VITE_APP_VERSION

export const sideAllMenu = [
  {
    name: '配置管理',
    icon: markRaw(CubeOutline),
    children: [
      {
        name: '配置列表',
        path: '/manage/configs',
      },
      /*
      {
          name:"配置",
          path:"/manage/config"
      },
      */
    ],
  },
  {
    name: '服务管理',
    icon: markRaw(ServerOutline),
    children: [
      {
        name: '服务列表',
        path: '/manage/service',
      },
    ],
  },
  {
    name: '系统管理',
    icon: markRaw(AppsSharp),
    children: [
      {
        name: '用户管理',
        path: '/manage/user',
      },
      {
        name: '命名空间',
        path: '/manage/namespace',
      },
      {
        name: '集群信息',
        path: '/manage/cluster',
      },
      {
        name: '关于',
        path: '/manage/about',
      },
    ],
  },
]

function sideMenu(resource: Set<string>, isOldConsole: boolean) {
  const items = [] as any
  for (const item of sideAllMenu) {
    const subItems = []
    for (const subItem of item.children || []) {
      if (resource.has(subItem.path)) {
        subItems.push(subItem)
      } else if (isOldConsole && subItem.path != '/manage/user') {
        subItems.push(subItem)
      }
    }
    if (subItems.length == 0) {
      continue
    }
    const newItem = { ...item }
    newItem.children = subItems
    items.push(newItem)
  }
  return items
}

export const useWebResources = defineStore('webResources', {
  state: () => ({
    resource: new Set(),
    isOldConsole: true,
    fromRequest: false,
    username: '',
    version: '',
    canUpdateConfig: true,
    canUpdateService: true,
    canUpdateNamespace: true,
    sideMenu: sideMenu(new Set(), true) as any,
  }),
  getters: {},
  actions: {
    update(webResource: WebResource) {
      const resource = new Set(webResource.resources)
      this.resource = resource
      this.isOldConsole = webResource.from === 'OLD_CONSOLE'
      this.fromRequest = true
      this.canUpdateConfig = this.resource.has('CONFIG_UPDATE')
      this.canUpdateService = this.resource.has('SERVICE_UPDATE')
      this.canUpdateNamespace = this.resource.has('NAMESPACE_UPDATE')
      this.version = 'v' + webResource.version
      this.username = webResource.username || ''
      this.sideMenu = sideMenu(resource, this.isOldConsole)
      return this.sideMenu
    },
    clear() {
      this.resource = new Set()
      this.isOldConsole = true
      this.fromRequest = false
      this.canUpdateConfig = true
      this.canUpdateService = true
      this.canUpdateNamespace = true
      this.username = ''
      this.version = ''
    },
  },
})

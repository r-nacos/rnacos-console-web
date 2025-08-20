//import Boo from '@/components/Boo.jsx';

import MainLayout from '@/layout/index.vue';
import NamespacePage from '@/pages/NamespacePage.vue';
import ServiceListPage from '@/pages/ServiceListPage.vue';
import SubscriberListPage from '@/pages/SubscriberListPage.vue';
import ServiceInstanceListPage from '@/pages/ServiceInstanceListPage.vue';
import NotFound from '@/pages/NotFound.vue';
import ClusterPageVue from '@/pages/ClusterPage.vue';
//import Tmp from '@/pages/Tmp.vue';
//import DiffDemo from '@/pages/DiffDemo.vue';
//import ChartDemo from '@/pages/ChartDemo.vue';
import Login from '@/pages/Login.vue';
import UserListPage from '@/pages/UserListPage.vue';
import NoPermission from '@/pages/NoPermission.vue';
import About from '@/pages/About.vue';
import Transfer from '@/pages/Transfer.vue';
import { ServerOutline, CubeOutline, AppsSharp } from '@vicons/ionicons5';
import { getMessage as t } from '@/i18n';
import { renderIcon } from '@/utils/index';

export const routes = [
  {
    path: '/',
    redirect: '/manage/about'
    /*
        name: 'index',
        meta: {'title':'index title'},
        component: Boo,
        */
  },
  {
    path: '/404',
    name: 'not found',
    meta: { title: '404' },
    component: NotFound
  },
  {
    path: '/nopermission',
    name: 'no permission',
    meta: { title: 'no permission' },
    component: NoPermission
  },
  {
    path: '/p/login',
    name: 'login',
    meta: { title: 'login' },
    component: Login
  },
  {
    path: '/manage',
    name: 'configs',
    meta: { title: 'config title' },
    component: MainLayout,
    children: [
      {
        path: 'configs',
        name: 'config',
        meta: { title: t('menu.config_list') },
        component: () => import('@/pages/ConfigListPage.vue')
      },
      {
        path: '/manage/config/history',
        name: 'config-history',
        meta: { title: t('menu.config_history') },
        component: () => import('@/pages/ConfigHistoryListPage.vue')
      }
    ]
  },
  /*
            {
                path: '/manage/config',
                name: 'manange config',
                meta: {'title':'config title'},
                component: Config,
            },
      {
        path: '/manage/tmp',
        name: 'manange tmp',
        meta: { title: 'tmp' },
        component: () => import('@/pages/ChartDemo.vue')
      },
      */
  {
    path: '/manage',
    name: 'services',
    meta: { title: 'service title' },
    component: MainLayout,
    children: [
      {
        path: '/manage/service',
        name: 'service',
        meta: { title: t('menu.service_list') },
        component: ServiceListPage
      },
      {
        path: '/manage/subscriber',
        name: 'subscriber',
        meta: { title: t('menu.subscriber_list') },
        component: SubscriberListPage
      }
    ]
  },
  {
    path: '/manage',
    name: 'mcp',
    meta: { title: 'mcp title' },
    component: MainLayout,
    children: [
      {
        path: '/manage/toolspec',
        name: 'toolspec',
        meta: { title: t('toolspec.toolspec_list') },
        component: () => import('@/pages/McpToolSpecListPage.vue')
      },
      {
        path: '/manage/toolspec/detail',
        name: 'toolspec-detail',
        meta: { title: t('toolspec.toolspec_detail') },
        component: () => import('@/pages/McpToolSpecDetail.vue')
      },
      {
        path: '/manage/mcpserver',
        name: 'mcpserver',
        meta: { title: t('mcpserver.mcpserver_list') },
        component: () => import('@/pages/McpServerListPage.vue')
      },
      {
        path: '/manage/mcpserver/detail',
        name: 'mcpserver-detail',
        meta: { title: t('mcpserver.mcpserver_detail') },
        component: () => import('@/pages/McpServerDetail.vue')
      }
    ]
  },
  {
    path: '/manage',
    name: 'app',
    meta: { title: 'config title' },
    component: MainLayout,
    children: [
      {
        path: '/manage/service/instance',
        name: 'manange instance',
        meta: { title: t('menu.service_instance_list') },
        component: ServiceInstanceListPage
      },
      {
        path: '/manage/namespace',
        name: 'namespace',
        meta: { title: t('menu.namespace') },
        component: NamespacePage
      },
      {
        path: '/manage/transfer',
        name: 'transfer',
        meta: { title: t('menu.data_transfer') },
        component: Transfer
      },
      {
        path: '/manage/user',
        name: 'user',
        meta: { title: t('menu.user_management') },
        component: UserListPage
      },
      {
        path: '/manage/cluster',
        name: 'cluster',
        meta: { title: t('menu.cluster_info') },
        component: ClusterPageVue
      },
      {
        path: '/manage/about',
        name: 'about',
        meta: { title: t('menu.about') },
        component: About
      },
      {
        path: '/manage/appmonitor',
        name: 'monitor',
        meta: { title: t('menu.system_monitor') },
        component: () => import('@/pages/AppMonitor.vue')
      }
    ]
  }
];

export const sideAllMenu = [
  {
    label: t('menu.config_management'),
    key: 'configs',
    icon: renderIcon(CubeOutline),
    children: [
      {
        label: t('menu.config_list'),
        path: '/manage/configs',
        key: 'config'
      }
      /*
      {
          name:"配置",
          path:"/manage/config"
      },
      */
    ]
  },
  {
    label: t('menu.service_management'),
    key: 'services',
    icon: renderIcon(ServerOutline),
    children: [
      {
        label: t('menu.service_list'),
        key: 'service',
        path: '/manage/service'
      },
      {
        label: t('menu.subscriber_list'),
        key: 'subscriber',
        path: '/manage/subscriber'
      }
    ]
  },
  {
    label: t('mcpserver.mcpserver_management'),
    key: 'mcpserver-management',
    icon: renderIcon(CubeOutline),
    children: [
      {
        label: t('toolspec.toolspec_list'),
        key: 'toolspec',
        path: '/manage/toolspec'
      },
      {
        label: t('mcpserver.mcpserver_list'),
        key: 'mcpserver',
        path: '/manage/mcpserver'
      }
    ]
  },
  {
    label: t('menu.system_management'),
    key: 'app',
    icon: renderIcon(AppsSharp),
    children: [
      {
        label: t('menu.user_management'),
        key: 'user',
        path: '/manage/user'
      },
      {
        label: t('menu.namespace'),
        key: 'namespace',
        path: '/manage/namespace'
      },
      {
        label: t('menu.data_transfer'),
        key: 'transfer',
        path: '/manage/transfer'
      },
      {
        label: t('menu.cluster_info'),
        key: 'cluster',
        path: '/manage/cluster'
      },
      {
        label: t('menu.system_monitor'),
        key: 'monitor',
        path: '/manage/appmonitor'
      },
      {
        label: t('menu.about'),
        key: 'about',
        path: '/manage/about'
      }
    ]
  }
];

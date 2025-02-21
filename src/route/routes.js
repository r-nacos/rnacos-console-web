//import Boo from '@/components/Boo.jsx';

// import MainLayout from '@/components/layout/MainLayout.vue';
import MainLayout from '@/layout/index.vue';
//import Config from '@/pages/Config';
import NamespacePage from '@/pages/NamespacePage';
//import ConfigListPage from '@/pages/ConfigListPage.vue';
//import ConfigHistoryListPage from '@/pages/ConfigHistoryListPage.vue';
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
        key: 'service'
      },
      {
        label: t('menu.subscriber_list'),
        key: 'subscriber'
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
        key: 'user'
      },
      {
        label: t('menu.namespace'),
        key: 'namespace'
      },
      {
        label: t('menu.data_transfer'),
        key: 'transfer'
      },
      {
        label: t('menu.cluster_info'),
        key: 'cluster'
      },
      {
        label: t('menu.system_monitor'),
        key: 'monitor'
      },
      {
        label: t('menu.about'),
        key: 'about'
      }
    ]
  }
];

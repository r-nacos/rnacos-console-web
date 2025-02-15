//import Boo from '@/components/Boo.jsx';
import MainLayout from '@/components/layout/MainLayout.vue';
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
    name: 'manage',
    meta: { title: 'manage title' },
    component: MainLayout,
    children: [
      {
        path: '/manage/configs',
        name: 'manange configs',
        meta: { title: t('menu.config_list') },
        component: () => import('@/pages/ConfigListPage.vue')
      },
      {
        path: '/manage/config/history',
        name: 'manange configs history',
        meta: { title: t('menu.config_history') },
        component: () => import('@/pages/ConfigHistoryListPage.vue')
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
        path: '/manage/service',
        name: 'manange service',
        meta: { title: t('menu.service_list') },
        component: ServiceListPage
      },
      {
        path: '/manage/subscriber',
        name: 'manange subscriber',
        meta: { title: t('menu.subscriber_list') },
        component: SubscriberListPage
      },
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

function buildManageMenu(routes) {
  var manageMenu = [];
  for (var manage of routes) {
    if (manage.path === '/manage') {
      for (var item of manage.children || []) {
        manageMenu.push({ ...item });
      }
    }
  }
  return manageMenu;
}

//const manageMenu = buildManageMenu(routes)

export const manageMenu = buildManageMenu(routes);

export const sideAllMenu = [
  {
    name: t('menu.config_management'),
    icon: markRaw(CubeOutline),
    children: [
      {
        name: t('menu.config_list'),
        path: '/manage/configs'
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
    name: t('menu.service_management'),
    icon: markRaw(ServerOutline),
    children: [
      {
        name: t('menu.service_list'),
        path: '/manage/service'
      },
      {
        name: t('menu.subscriber_list'),
        path: '/manage/subscriber'
      }
    ]
  },
  {
    name: t('menu.system_management'),
    icon: markRaw(AppsSharp),
    children: [
      {
        name: t('menu.user_management'),
        path: '/manage/user'
      },
      {
        name: t('menu.namespace'),
        path: '/manage/namespace'
      },
      {
        name: t('menu.data_transfer'),
        path: '/manage/transfer'
      },
      {
        name: t('menu.cluster_info'),
        path: '/manage/cluster'
      },
      {
        name: t('menu.system_monitor'),
        path: '/manage/appmonitor'
      },
      {
        name: t('menu.about'),
        path: '/manage/about'
      }
    ]
  }
];

//export default routes ;
/*
    routes,
    manageMenu
};
*/

import Boo from '@/components/Boo.jsx';
import MainLayout from '@/components/layout/MainLayout.vue';
import Config from '@/pages/Config';
import NamespacePage from '@/pages/NamespacePage';
import ConfigListPage from '@/pages/ConfigListPage.vue';
import ConfigHistoryListPage from '@/pages/ConfigHistoryListPage.vue';
import ServiceListPage from '@/pages/ServiceListPage.vue';
import ServiceInstanceListPage from '@/pages/ServiceInstanceListPage.vue';
import NotFound from '@/pages/NotFound.vue';
import ClusterPageVue from '@/pages/ClusterPage.vue';
import Tmp from '@/pages/Tmp.vue';
import DiffDemo from '@/pages/DiffDemo.vue';
import Login from '@/pages/Login.vue';
import UserListPage from '@/pages/UserListPage.vue';
import NoPermission from '@/pages/NoPermission.vue';
import About from '@/pages/About.vue';
import { ServerOutline, CubeOutline, AppsSharp } from '@vicons/ionicons5';

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
        meta: { title: '配置列表' },
        component: ConfigListPage
      },
      {
        path: '/manage/config/history',
        name: 'manange configs history',
        meta: { title: '配置历史记录' },
        component: ConfigHistoryListPage
      },
      /*
            {
                path: '/manage/config',
                name: 'manange config',
                meta: {'title':'config title'},
                component: Config,
            },
            */
      {
        path: '/manage/tmp',
        name: 'manange tmp',
        meta: { title: 'tmp' },
        component: DiffDemo
      },
      {
        path: '/manage/service',
        name: 'manange service',
        meta: { title: '服务列表' },
        component: ServiceListPage
      },
      {
        path: '/manage/service/instance',
        name: 'manange instance',
        meta: { title: '服务实例列表' },
        component: ServiceInstanceListPage
      },
      {
        path: '/manage/namespace',
        name: 'namespace',
        meta: { title: '命名空间管理' },
        component: NamespacePage
      },
      {
        path: '/manage/user',
        name: 'user',
        meta: { title: '用户管理' },
        component: UserListPage
      },
      {
        path: '/manage/cluster',
        name: 'cluster',
        meta: { title: '集群信息' },
        component: ClusterPageVue
      },
      {
        path: '/manage/about',
        name: 'about',
        meta: { title: '关于' },
        component: About
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
    name: '配置管理',
    icon: markRaw(CubeOutline),
    children: [
      {
        name: '配置列表',
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
    name: '服务管理',
    icon: markRaw(ServerOutline),
    children: [
      {
        name: '服务列表',
        path: '/manage/service'
      }
    ]
  },
  {
    name: '系统管理',
    icon: markRaw(AppsSharp),
    children: [
      {
        name: '用户管理',
        path: '/manage/user'
      },
      {
        name: '命名空间',
        path: '/manage/namespace'
      },
      {
        name: '集群信息',
        path: '/manage/cluster'
      },
      {
        name: '关于',
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

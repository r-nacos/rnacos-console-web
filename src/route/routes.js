import Boo from '@/components/Boo.jsx'
import MainLayout from '@/components/layout/MainLayout.vue'
import Config from '@/pages/Config'
import NamespacePage from '@/pages/NamespacePage'
import ConfigListPage from '@/pages/ConfigListPage.vue'
import ServiceListPage from '@/pages/ServiceListPage.vue'
import ServiceInstanceListPage from '@/pages/ServiceInstanceListPage.vue'

export const routes = [
    {
        path: '/',
        name: 'index',
        meta: {'title':'index title'},
        component: Boo,
    },
    {
        path: '/manage',
        name: 'manage',
        meta: {'title':'manage title'},
        component: MainLayout,
        children: [
            {
                path: '/manage/configs',
                name: 'manange configs',
                meta: {'title':'配置列表'},
                component: ConfigListPage,
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
                path: '/manage/service',
                name: 'manange service',
                meta: {'title':'服务列表'},
                component: ServiceListPage,
            },
            {
                path: '/manage/service/instance',
                name: 'manange instance',
                meta: {'title':'服务实例列表'},
                component: ServiceInstanceListPage,
            },
            {
                path: '/manage/namespace',
                name: 'namespace',
                meta: {'title':'命名空间管理'},
                component: NamespacePage,
            },
        ],
    },
]

function buildManageMenu(routes){
    var manageMenu =[];
    for(var manage of routes){
        if(manage.path==='/manage'){
            for(var item of (manage.children || [])){
                manageMenu.push({ ...item })
            }
        }
    }
    return manageMenu;
}

//const manageMenu = buildManageMenu(routes)

export const manageMenu = buildManageMenu(routes);

//export default routes ;
/*
    routes,
    manageMenu
};
*/
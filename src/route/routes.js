import Config from '@/views/config.vue'
import ServicePage from '@/views/ServicePage.vue'
import NamespacePage from '@/views/NamespacePage.vue'
import ConfigListPage from '@/views/ConfigListPage.vue'
import Foo from '@/components/Foo.vue'
import Layout2 from '@/components/layout/Layout2.vue'
import Boo from '@/components/Boo.jsx'
import TableFoo from '@/components/TableFoo.vue'
import MainLayout from '@/components/layout/MainLayout.vue'

export const routes = [
    {
        path: '/',
        name: 'index',
        meta: {'title':'index title'},
        component: Foo,
    },
    {
        path: '/foo',
        name: 'foo',
        meta: {'title':'foo title'},
        component: Layout2,
    },
    {
        path: '/manage',
        name: 'manage',
        meta: {'title':'manage title'},
        component: MainLayout,
        children: [
            {
                path: '/manage/configs',
                name: 'configs',
                meta: {'title':'配置列表'},
                component: ConfigListPage,
            },
            {
                path: '/manage/config',
                name: 'manange config',
                meta: {'title':'config title'},
                component: Config,
            },
            {
                path: '/manage/service',
                name: 'manange service',
                meta: {'title':'service title'},
                component: ServicePage,
            },
            {
                path: '/manage/namespace',
                name: 'namespace',
                meta: {'title':'namespace title'},
                component: NamespacePage,
            },
            {
                path: '/manage/foo',
                name: 'manange foo',
                meta: {'title':'foo title'},
                component: Foo,
            },
            {
                path: '/manage/boo',
                name: 'manange boo',
                meta: {'title':'boo title'},
                component: Boo,
            },
            {
                path: '/manage/table',
                name: 'manange table',
                meta: {'title':'table title'},
                component: TableFoo,
            },
        ]
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
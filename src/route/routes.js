import Config from '@/views/config.vue'
import ServicePage from '@/views/ServicePage.vue'
import Foo from '@/components/Foo.vue'
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
        component: Foo,
    },
    {
        path: '/manage',
        name: 'manage',
        meta: {'title':'manage title'},
        component: MainLayout,
        children: [
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
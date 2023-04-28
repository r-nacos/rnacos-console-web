import Boo from '@/components/Boo.jsx'
import MainLayout from '@/components/layout/MainLayout.vue'
import Config from '@/pages/Config'
import NamespacePage from '@/pages/NamespacePage'

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
                path: '/manage/boo',
                name: 'manange boo',
                meta: {'title':'boo title'},
                component: Boo,
            },
            {
                path: '/manage/config',
                name: 'manange config',
                meta: {'title':'config title'},
                component: Config,
            },
            {
                path: '/manage/namespace',
                name: 'namespace',
                meta: {'title':'namespace title'},
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
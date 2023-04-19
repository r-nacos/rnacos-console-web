import Config from '@/views/config.vue'
import Foo from '@/components/Foo.vue'
import Boo from '@/components/Boo.jsx'
import TableFoo from '@/components/TableFoo.vue'
import MainLayout from '@/components/layout/MainLayout.vue'

import {createRouter,createWebHistory,createWebHashHistory} from 'vue-router'

const getRouteTitle = function(route){
    return route && route.meta && route.meta.title || "";
}

const setRouteTitle = function(route){
    window.document.title = getRouteTitle(route);
}

const routes = [
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

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach((to,from) => {
    setRouteTitle(to)
})

export default router



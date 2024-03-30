import { routes } from './routes';

import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router';

const getRouteTitle = function (route) {
  return (route && route.meta && route.meta.title) || '';
};

const setRouteTitle = function (route) {
  window.document.title = getRouteTitle(route);
};

const router = createRouter({
  history: createWebHistory("/rnacos"),
  routes
});

router.afterEach((to, from) => {
  if (to.name === undefined && to.fullPath !== '/rnacos/404' && to.fullPath !== '/404' ) {
    router.replace('/404?path=' + encodeURIComponent(to.fullPath));
  } else {
    setRouteTitle(to);
  }
});

export default router;

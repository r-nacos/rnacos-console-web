import { routes } from './routes';
import { handleApiResult } from '@/utils/request';
import { userApi } from '@/api/user';

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
  history: createWebHistory('/rnacos'),
  routes
});

router.afterEach((to, from) => {
  if (
    to.name === undefined &&
    to.fullPath !== '/rnacos/404' &&
    to.fullPath !== '/404'
  ) {
    router.replace('/404?path=' + encodeURIComponent(to.fullPath));
  } else {
    setRouteTitle(to);
  }
});

let loginChecked = false;
let isLoggedIn = false;

router.beforeEach(async (to, from, next) => {
  if (to.path.startsWith('/p/login')) {
    if (!loginChecked) {
      try {
        const res = await userApi.getCurrentUser();
        const user = handleApiResult(res);
        if (user) {
          isLoggedIn = true;
        }
      } catch {
        isLoggedIn = false;
      }
      loginChecked = true;
    }

    if (isLoggedIn) {
      const redirectUrl = (to.query.redirect_url || '/manage/about')
        .toString()
        .replace(/^\/rnacos/, '');
      return next(redirectUrl);
    } else {
      return next();
    }
  }

  next();
});
export default router;

import { h } from 'vue';
import { NIcon } from 'naive-ui';
// import { PageEnum } from '@/enums/pageEnum';
/**
 * render 图标
 * */
export function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// /**
//  * 递归组装菜单格式
//  */
// export function generatorMenu(routerMap: Array<any>) {
//   return filterRouter(routerMap).map((item) => {
//     const isRoot = isRootRouter(item);
//     const info = isRoot ? item.children[0] : item;
//     const currentMenu = {
//       ...info,
//       ...info.meta,
//       label: info.meta?.title,
//       key: info.name,
//       icon: isRoot ? item.meta?.icon : info.meta?.icon,
//     };
//     // 是否有子菜单，并递归处理
//     if (info.children && info.children.length > 0) {
//       // Recursion
//       currentMenu.children = generatorMenu(info.children);
//     }
//     return currentMenu;
//   });
// }

// /**
//  * 递归组装子菜单
//  * */
// export function getChildrenRouter(routerMap: Array<any>) {
//   return filterRouter(routerMap).map((item) => {
//     const isRoot = isRootRouter(item);
//     const info = isRoot ? item.children[0] : item;
//     const currentMenu = {
//       ...info,
//       ...info.meta,
//       label: info.meta?.title,
//       key: info.name,
//     };
//     // 是否有子菜单，并递归处理
//     if (info.children && info.children.length > 0) {
//       // Recursion
//       currentMenu.children = getChildrenRouter(info.children);
//     }
//     return currentMenu;
//   });
// }

// /**
//  * 判断根路由 Router
//  * */
// export function isRootRouter(item) {
//   return (
//     item.meta?.alwaysShow != true &&
//     item?.children?.filter((item) => !Boolean(item?.meta?.hidden))?.length === 1
//   );
// }

// /**
//  * 排除Router
//  * */
// export function filterRouter(routerMap: Array<any>) {
//   return routerMap.filter((item) => {
//     return (
//       (item.meta?.hidden || false) != true &&
//       !['/:path(.*)*', '/', PageEnum.REDIRECT, PageEnum.BASE_LOGIN].includes(item.path)
//     );
//   });
// }

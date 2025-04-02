import { defineStore } from 'pinia';
import projectSetting from '@/settings/projectSetting';
import type { IHeaderSetting, IMenuSetting, IMultiTabsSetting, ICrumbsSetting } from '/#/config';

const {
  navMode,
  navTheme,
  isMobile,
  headerSetting,
  showFooter,
  menuSetting,
  multiTabsSetting,
  crumbsSetting,
  // permissionMode,
  // isPageAnimate,
  // pageAnimateType,
} = projectSetting;

interface ProjectSettingState {
  navMode: string; //导航模式
  navTheme: string; //导航风格
  headerSetting: IHeaderSetting; //顶部设置
  showFooter: boolean; //页脚
  menuSetting: IMenuSetting; //多标签
  multiTabsSetting: IMultiTabsSetting; //多标签
  crumbsSetting: ICrumbsSetting; //面包屑
  // permissionMode: string; //权限模式
  // isPageAnimate: boolean; //是否开启路由动画
  // pageAnimateType: string; //路由动画类型
  isMobile: boolean; // 是否处于移动端模式
}

export const useProjectSettingStore = defineStore({
  id: 'app-project-setting',
  state: (): ProjectSettingState => ({
    navMode: navMode,
    navTheme,
    isMobile,
    headerSetting,
    showFooter,
    menuSetting,
    multiTabsSetting,
    crumbsSetting,
    // permissionMode,
    // isPageAnimate,
    // pageAnimateType,
  }),
  getters: {
    getNavMode: (state: ProjectSettingState): string => state.navMode,
    getNavTheme: (state: ProjectSettingState): string => state.navTheme,
    getIsMobile: (state: ProjectSettingState): boolean => state.isMobile,
    getHeaderSetting: (state: ProjectSettingState): object => state.headerSetting,
    getShowFooter: (state: ProjectSettingState): boolean => state.showFooter,
    getMenuSetting: (state: ProjectSettingState): object => state.menuSetting,
    getMultiTabsSetting: (state: ProjectSettingState): object => state.multiTabsSetting,
    getCrumbsSetting: (state: ProjectSettingState): object => state.crumbsSetting,
    // getPermissionMode: (state: ProjectSettingState): string => state.permissionMode,
    // getIsPageAnimate: (state: ProjectSettingState): boolean => state.isPageAnimate,
    // getPageAnimateType: (state: ProjectSettingState): string => state.pageAnimateType,
  },
  actions: {
    setNavTheme(this: ProjectSettingState, value: string): void { 
      this.navTheme = value;
    },
    setIsMobile(this: ProjectSettingState, value: boolean): void {
      this.isMobile = value;
    }
  },
}); 
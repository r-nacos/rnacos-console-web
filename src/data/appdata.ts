import { ISize } from '@/types/base';
import { defineStore } from 'pinia';
import { useProjectSettingStore } from '@/store/modules/projectSetting';
import setting from '@/settings/projectSetting';

interface LayoutSizeState {
  headerHeight: number;
  footerHeight: number;
  siderWidth: number;
  contentHeight: number;
  contentWidth: number;
  windowSize: ISize;
}

export const useLayoutSize = defineStore('layoutSize', {
  state: (): LayoutSizeState => ({
    headerHeight: setting.headerSetting.height,
    footerHeight: 0,
    siderWidth: setting.menuSetting.menuWidth,
    contentHeight: 0,
    contentWidth: 0,
    windowSize: {
      height: 0,
      width: 0
    }
  }),
  getters: {
    getContentWidth(): number {
      const projectSettingStore = useProjectSettingStore();
      const currentWidth = window.innerWidth;
      if (projectSettingStore.getIsMobile) {
        return currentWidth;
      }
      return (
        currentWidth -
        (projectSettingStore.getMenuCollapsed
          ? setting.menuSetting.minMenuWidth
          : setting.menuSetting.menuWidth)
      );
    }
  },
  actions: {
    updateLayoutSize(this: { $state: LayoutSizeState }, windowSize?: ISize) {
      if (windowSize) {
        this.$state.windowSize = windowSize;
      } else {
        this.$state.windowSize = {
          height: window.innerHeight,
          width: window.innerWidth
        };
      }
      this.$state.contentHeight =
        this.$state.windowSize.height -
        this.$state.headerHeight -
        this.$state.footerHeight;
      this.$state.contentWidth = this.getContentWidth;
    }
  }
});

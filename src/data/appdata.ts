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
  actions: {
    updateLayoutSize(
      this: {
        $state: LayoutSizeState;
        $patch: (fn: (state: LayoutSizeState) => void) => void;
      },
      windowSize?: ISize
    ) {
      this.$patch((state) => {
        if (windowSize) {
          state.windowSize = windowSize;
        } else {
          state.windowSize = {
            height: window.innerHeight,
            width: window.innerWidth
          };
        }
        state.contentHeight =
          state.windowSize.height - state.headerHeight - state.footerHeight;
        const projectSettingStore = useProjectSettingStore();
        const currentWidth = window.innerWidth;
        if (projectSettingStore.getIsMobile) {
          state.contentWidth = currentWidth;
        } else {
          state.contentWidth =
            currentWidth -
            (projectSettingStore.getMenuCollapsed
              ? setting.menuSetting.minMenuWidth
              : setting.menuSetting.menuWidth);
        }
      });
    }
  }
});

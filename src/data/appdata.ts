import { ISize } from '@/types/base';
import { defineStore } from 'pinia';

export const useLayoutSize = defineStore('layoutSize', {
  state: () => ({
    headerHeight: 52,
    footerHeight: 0,
    siderWidth: 200,
    contentHeight: 0,
    contentWidth: 0,
    windowSize: {
      height: 0,
      width: 0
    }
  }),
  getters: {},
  actions: {
    updateLayoutSize(windowSize?: ISize) {
      if (windowSize) {
        this.windowSize = windowSize;
      } else {
        this.windowSize = {
          height: window.innerHeight,
          width: window.innerWidth
        };
      }
      this.contentHeight =
        this.windowSize.height - this.headerHeight - this.footerHeight;
      this.contentWidth = this.windowSize.width - this.siderWidth;
    },
    setSiderWidth(siderWidth: number) {
      this.siderWidth = siderWidth;
      this.updateLayoutSize(undefined);
    }
  }
});

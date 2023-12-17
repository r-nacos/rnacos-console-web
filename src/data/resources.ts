import { ISize, WebResource } from '@/types/base';
import { defineStore } from 'pinia';

export const useWebResources = defineStore('webResources', {
  state: () => ({
    resource: new Set(),
    isOldConsole: true,
    fromRequest: false,
    canUpdateConfig: true,
    canUpdateService: true,
    canUpdateNamespace: true
  }),
  getters: {},
  actions: {
    update(webResource: WebResource) {
      this.resource = new Set(webResource.resources);
      this.isOldConsole = webResource.from === 'OLD_CONSOLE';
      this.fromRequest = true;
      this.canUpdateConfig = this.resource.has('CONFIG_UPDATE');
      this.canUpdateService = this.resource.has('SERVICE_UPDATE');
      this.canUpdateNamespace = this.resource.has('NAMESPACE_UPDATE');
    },
    clear() {
      this.resource = new Set();
      this.isOldConsole = true;
      this.fromRequest = false;
      this.canUpdateConfig = true;
      this.canUpdateService = true;
      this.canUpdateNamespace = true;
    }
  }
});

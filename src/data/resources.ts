import { ISize, WebResource } from '@/types/base';
import { sideAllMenu } from '@/route/routes';
import { defineStore } from 'pinia';

function sideMenu(resource: Set<string>, isOldConsole: boolean) {
  var items = [];
  for (var item of sideAllMenu) {
    var subItems = [];
    for (var subItem of item.children || []) {
      if (resource.has(subItem.path)) {
        subItems.push(subItem);
      } else if (isOldConsole && subItem.path != '/manage/user') {
        subItems.push(subItem);
      }
    }
    if (subItems.length == 0) {
      continue;
    }
    let newItem = { ...item };
    newItem.children = subItems;
    items.push(newItem);
  }
  return items;
}

export const useWebResources = defineStore('webResources', {
  state: () => ({
    resource: new Set(),
    isOldConsole: true,
    fromRequest: false,
    username: '',
    version: 'x',
    canUpdateConfig: true,
    canUpdateService: true,
    canUpdateNamespace: true,
    sideMenu: sideMenu(new Set(), true)
  }),
  getters: {},
  actions: {
    update(webResource: WebResource) {
      let resource = new Set(webResource.resources);
      this.resource = resource;
      this.isOldConsole = webResource.from === 'OLD_CONSOLE';
      this.fromRequest = true;
      this.canUpdateConfig = this.resource.has('CONFIG_UPDATE');
      this.canUpdateService = this.resource.has('SERVICE_UPDATE');
      this.canUpdateNamespace = this.resource.has('NAMESPACE_UPDATE');
      this.version = 'v' + webResource.version;
      this.username = webResource.username || '';
      this.sideMenu = sideMenu(resource, this.isOldConsole);
      return this.sideMenu;
    },
    clear() {
      this.resource = new Set();
      this.isOldConsole = true;
      this.fromRequest = false;
      this.canUpdateConfig = true;
      this.canUpdateService = true;
      this.canUpdateNamespace = true;
      this.username = '';
      this.version = 'x';
    }
  }
});

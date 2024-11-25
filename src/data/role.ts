import i18n from '@/i18n/index'; //我本地的i18n实例
let _t: any = i18n.global;

export interface Item {
  value: string;
  label: string;
}
export const roleOptions: Array<Item> = [
  {
    value: '0',
    label: _t.t('role.admin')
  },
  {
    value: '1',
    label: _t.t('role.developer')
  },
  {
    value: '2',
    label: _t.t('role.guest')
  }
];

export const getRoleNameByCode = function (value: String) {
  for (var item of roleOptions) {
    if (value == item.value) {
      return item.label;
    }
  }
  return value;
};

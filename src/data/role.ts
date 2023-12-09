export interface Item {
  value: string;
  label: string;
}

export const roleOptions: Array<Item> = [
  {
    value: '0',
    label: '管理员'
  },
  {
    value: '1',
    label: '开发者'
  },
  {
    value: '2',
    label: '访客'
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

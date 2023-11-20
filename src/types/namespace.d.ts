import { ILabelItem } from './base';

export interface INamespace {
  namespaceId: string;
  namespaceName: string;
  type?: string;
}

export interface IHandeNamespace {
  (arg: INamespace): any;
}

export interface INamespaceStore {
  current: Ref<UnwrapRef<INamespace>>;
  listList: Ref<UnwrapRef<Array<INamespace>>>;
  optionList: Ref<UnwrapRef<Array<ILabelItem>>>;
  setCurrent: (arg0: INamespace) => any;
  setLastList: (list: Array<INamespace>) => any;
  initLoad: () => any;
}

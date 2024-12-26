import { INamespace } from '@/types/namespace';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

declare global {
  interface Window {
    $message?: MessageApiInjection;
  }
}

export interface ILabelItem {
  label: string;
  value: string;
}

export interface IColumn {
  title: string;
  key: string;
  render?: (arg: any) => any;
}

export interface ICallback<T> {
  (arg: T): any;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface MyWindow extends Window {
  $message: MessageApiInjection;
}

declare var window: MyWindow;

export interface IConsoleResult<T> {
  code: number;
  message: ?string;
  data: ?T;
}

export interface IApiResult<T> {
  data: ?T;
  success: boolean;
  code: ?string;
  message: ?string;
}

export interface IOldPageResult<T> {
  size: number;
  list: Array<T>;
}

export interface IPageResult<T> {
  totalCount: number;
  list: Array<T>;
}

export interface WebResource {
  from: string;
  version: string;
  username: ?string;
  resources: Array<string>;
}

export interface ILangStore {
  current: Ref<UnwrapRef<string>>;
  setCurrent: (arg: string) => any;
}

export interface IPrivilegeGroup {
  enabled: ?boolean;
  whitelistIsAll: ?boolean;
  whitelist: ?Array<string>;
  blacklistIsAll: ?boolean;
  blacklist: ?Array<string>;
}

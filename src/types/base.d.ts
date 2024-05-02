import type { AnyObj } from '@/utils'

export interface ILabelItem {
  label: string
  value: string
}

export interface IColumn {
  title: string
  key: string
  render?: (arg: any) => any
}

export interface ICallback<T> {
  (arg: T): any
}

export interface ISize {
  width: number
  height: number
}

export interface IPoint {
  x: number
  y: number
}

export interface MyWindow extends Window {
  $message: MessageApiInjection
}

declare let window: MyWindow

export interface IConsoleResult<T> {
  code: number
  message: ?string
  data: ?T
}

export interface IApiResult<T> {
  code: ?string
  message: ?string
  data: ?T
  success: boolean
}

export interface IPageResult<T> {
  size: number
  list: Array<T>
}

export interface WebResource {
  from: string
  version: string
  username: ?string
  resources: Array<string>
}

export interface CrudOptions<T> {
  // 表格配置
  columns: TableColumn<T>[]
  // api接口配置
  apis?: {
    create?: string
    update?: string
    delete?: string
    list?: string
  }
  // 分页配置
  pagination?: AnyObj | undefined
  // 表单配置
  form?: {
    title?: string
  }
  // 请求参数
  param?: {}
  // 抽屉设置
  drawer?: {
    width?: number | string | undefined
    placement?: string
    showMask: boolean
  }
  validator?: Function
}

export interface ValidResult {
  result: boolean
  data: AnyObj
}

export interface IServiceQueryPageParam {
  namespaceId: string
  serviceNameParam: string
  groupNameParam: string
  pageNo: Number
  pageSize: Number
  accessToken?: string
}

export interface IServiceQueryItem {
  name: string
  groupName: string
  clusterCount: Number
  ip_count: Number
  healthy_instance_count: Number
  trigger_flag: Boolean
  metadata?: string
  protect_threshold?: Number
}

export interface IServiceQueryPageResult<T> {
  count: Number
  service_list: Array<T>
}

export interface ILoginParam {
  username: string
  password: string
  captcha: string
}

export interface IResetPasswordParam {
  oldPassword: string
  newPassword: string
}

export interface IUserPageParam {
  like_username?: string
  pageNo: Number
  pageSize: Number
  isRev: boolean
}

export interface IUserInfo {
  username: string
  nickname: string
  password?: string
  gmtCreate: number
  gmtModified: number
  enable: boolean
  roles: Array<String>
  extendInfo?: Map<String, String>
}

export interface IUpdateUserParam {
  username: string
  nickname?: string
  password?: string
  enable?: boolean
  roles?: string
}

export interface IConfig {
  tenant?: string
  group: string
  dataId: string
  content?: string
  md5?: string
  modifiedTime?: number
}

export interface IConfigKey {
  tenant?: string
  group: string
  dataId: string
}

export interface IConfigQueryParam {
  tenant: string
  groupParam: string
  dataParam: string
  pageNo: Number
  pageSize: Number
}

export interface IConfigQueryHistoryParam {
  tenant: string
  group: string
  dataId: string
  pageNo: Number
  pageSize: Number
}

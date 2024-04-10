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
  }
  validator?: Function
}

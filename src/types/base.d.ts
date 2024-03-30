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
  columns: TableColumn<T>[]
  apis?: {
    create?: string
    update?: string
    delete?: string
    list?: string
  }
  pagination: AnyObj
  form?: {
    title?: '标题'
  }
  param?: {}
}

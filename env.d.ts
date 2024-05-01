/// <reference types="vite/client" />
declare module 'qs'
declare module '@codemirror/lang-json'
declare module '@codemirror/language'

declare module 'axios' {
  export interface AxiosRequestConfig {
    loading?: boolean
  }
}

declare global {
  /**
   * 任意类型声明
   */
  interface AnyObject {
    [key: string]: any
  }

  /**
   * http返回声明
   */
  interface HttpResponse {
    data?: any
    msg: string
    code: number
  }

  /**
   * 运行时环境声明
   */
  interface Runtime {
    env: object
    isProd: boolean
    buildTime: string
    domain: string
  }

  /**
   * 日志声明
   */
  interface Logger {
    open: boolean
    showLine: boolean
    assert(condition?: boolean, ...agrs: any[]): void
    clear(): void
    count(label?: string): void
    countReset(label?: string): void
    debug(...agrs: any[]): void
    dir(item?: any, options?: any): void
    dirxml(...agrs: any[]): void
    error(...agrs: any[]): void
    group(...agrs: any[]): void
    groupCollapsed(...agrs: any[]): void
    groupEnd(): void
    info(...agrs: any[]): void
    log(...agrs: any[]): void
    table(tabularData?: any, properties?: string[]): void
    time(label?: string): void
    timeEnd(label?: string): void
    timeLog(label?: string, ...agrs: any[]): void
    timeStamp(label?: string): void
    trace(...agrs: any[]): void
    warn(...agrs: any[]): void
  }

  const Runtime: Runtime
  const Logger: Logger
  interface Window {
    Runtime: Runtime
    Logger: Logger
    navList: any
    $message: MessageApiInjection
  }
}

export {}

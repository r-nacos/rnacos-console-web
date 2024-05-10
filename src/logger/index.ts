class Log implements Logger {
  // 是否开启日志打印
  open: boolean
  // 是否换行显示：视原生接口实现实际情况而定
  showLine: boolean

  constructor() {
    this.open = !Runtime.isProd
    this.showLine = true
  }

  log(...args: any[]) {
    if (this.open) {
      if (this.showLine) {
        console.log(args)
      } else {
        args.forEach((arg: any) => {
          console.log(arg)
        })
      }
    }
  }

  info(...args: any[]) {
    if (this.open) {
      if (this.showLine) {
        console.info(args)
      } else {
        args.forEach((arg: any) => {
          console.info(arg)
        })
      }
    }
  }

  warn(...args: any[]) {
    if (this.open) {
      if (this.showLine) {
        console.warn(args)
      } else {
        args.forEach((arg: any) => {
          console.warn(arg)
        })
      }
    }
  }

  error(...args: any[]) {
    if (this.open) {
      if (this.showLine) {
        console.error(args)
      } else {
        args.forEach((arg: any) => {
          console.error(arg)
        })
      }
    }
  }

  dir(item?: any, options?: any) {
    if (this.open) {
      if (this.showLine) {
        console.dir(item, options)
      } else {
        console.dir(item, options)
      }
    }
  }

  count(label?: string) {
    if (this.open) {
      if (this.showLine) {
        console.count(label)
      } else {
        console.count(label)
      }
    }
  }

  table(tabularData?: any, properties?: string[]) {
    if (this.open) {
      if (this.showLine) {
        console.table(tabularData, properties)
      } else {
        properties?.forEach((arg: any) => {
          console.table(tabularData, arg)
        })
      }
    }
  }

  debug(...args: any[]) {
    if (this.open) {
      if (this.showLine) {
        console.debug(args)
      } else {
        args.forEach((arg: any) => {
          console.debug(arg)
        })
      }
    }
  }

  assert(condition?: boolean, ...data: any[]): void {
    this.log(condition, data)
  }

  clear(): void {
    console.clear()
  }

  countReset(label?: string): void {
    this.log(label)
  }

  dirxml(...data: any[]): void {
    this.log(data)
  }

  group(...data: any[]): void {
    this.log(data)
  }

  groupCollapsed(...data: any[]): void {
    this.log(data)
  }

  groupEnd(): void {}

  time(label?: string): void {
    this.log(label)
  }

  timeEnd(label?: string): void {
    this.log(label)
  }

  timeLog(label?: string, ...data: any[]): void {
    this.log(label, data)
  }

  timeStamp(label?: string): void {
    this.log(label)
  }

  trace(...data: any[]): void {
    this.log(data)
  }
}

/**
 * 默认导出函数
 */
window.Logger = new Log()
export {}

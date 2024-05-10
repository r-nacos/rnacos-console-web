const MODE = import.meta.env.MODE
console.log(MODE, 'ENV_MODE = ' + MODE)
export const log = (...args: any) => {
  if (MODE === 'development') {
    args.forEach((item: any) => {
      console.log(item)
    })
  }
}

export const info = (...args: any) => {
  if (MODE === 'development') {
    args.forEach((item: any) => {
      console.info(item)
    })
  }
}

export const warn = (...args: any) => {
  if (MODE === 'development') {
    args.forEach((item: any) => {
      console.warn(item)
    })
  }
}

export const error = (...args: any) => {
  if (MODE === 'development') {
    args.forEach((item: any) => {
      console.error(item)
    })
  }
}

export default {
  log,
  info,
  warn,
  error,
}

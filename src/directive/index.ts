import type { App } from 'vue'

export function directive(app: App) {
  longpress(app)
  auth(app)
}

export function longpress(app: App) {
  app.directive('longpress', {
    mounted(el: any, binding: any) {
      const params = binding.value || {}
      const fn = binding.arg
      let pressTimer: number | null = null
      const start = (e: any) => {
        if (e.type === 'click' && e.button !== 0) {
          return
        }
        if (pressTimer === null) {
          pressTimer = setTimeout(() => {
            fn(params)
          }, 500)
        }
      }
      const cancel = () => {
        if (pressTimer !== null) {
          clearTimeout(pressTimer)
          pressTimer = null
        }
      }
      el.addEventListener('mousedown', start)
      el.addEventListener('touchstart', start)
      el.addEventListener('click', cancel)
      el.addEventListener('mouseout', cancel)
      el.addEventListener('touchend', cancel)
      el.addEventListener('touchcancel', cancel)
    },
  })
}

// 权限指令封装
export function auth(app: App) {
  app.directive('auth', {
    mounted(el, binding) {
      const auth = sessionStorage.getItem('powerStr') || ''
      if (!auth) {
        return
      }
      const authArr: any = auth.split(',')
      const val = binding.value || ''
      if (authArr.indexOf(val.trim()) === -1) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })
}

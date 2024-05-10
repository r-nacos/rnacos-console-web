import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createStore } from './modules/layout'

const store = createPinia()

export { store }

export function setupStore(app: App<Element>) {
  app.use(store)
}

export function useLayoutSize() {
  return createStore(store)
}

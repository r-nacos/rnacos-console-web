import { type ComponentInternalInstance, getCurrentInstance } from 'vue'
export const proxy = () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  return appContext.config.globalProperties
}

import { Ref, UnwrapRef, ref } from 'vue';
import { ILangStore } from '@/types/base';

// 前期没有使用 pinia,后继调整时考虑迁移到pinia
const LANG_STORAGE_KEY = 'lang';

function createStore(): ILangStore {
  const currentRef: Ref<UnwrapRef<string>> = ref('en');
  const setCurrent = function (current: string) {
    currentRef.value = current;
    localStorage.setItem(LANG_STORAGE_KEY, current);
  };
  const value =
    localStorage.getItem(LANG_STORAGE_KEY) ||
    (navigator.language || 'en').toLocaleLowerCase().split('-')[0] ||
    'en';
  setCurrent(value);
  return {
    current: currentRef,
    setCurrent
  };
}

export const langStore: ILangStore = createStore();

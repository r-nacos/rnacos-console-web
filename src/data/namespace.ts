import { Ref, UnwrapRef, reactive, ref } from 'vue';
import namespaceApi from '../api/namespace';
import { INamespace, INamespaceStore } from '@/types/namespace';
import { ILabelItem } from '@/types/base';

// 前期没有使用 pinia,后继调整时考虑迁移到pinia
const NAMESPACE_STORAGE_KEY = 'RNACOS_NAMESPACE_KEY';

function createStore(): INamespaceStore {
  const currentRef: Ref<UnwrapRef<INamespace>> = ref({
    namespaceId: '',
    namespaceName: 'public'
  });
  const listListRef: Ref<UnwrapRef<Array<INamespace>>> = ref([
    {
      namespaceId: '',
      namespaceName: 'public'
    }
  ]);
  const optionListRef: Ref<UnwrapRef<Array<ILabelItem>>> = ref([
    {
      label: 'public',
      value: ''
    }
  ]);
  const loadRef = ref(false);
  const setCurrent = function (current: INamespace) {
    currentRef.value = current;
    localStorage.setItem(NAMESPACE_STORAGE_KEY, JSON.stringify(current));
  };
  const setLastList = function (list: Array<INamespace>) {
    var optionList = [];
    for (var item of list) {
      var obj = {
        label: item.namespaceName,
        value: item.namespaceId
      } as ILabelItem;
      optionList.push(obj);
    }
    listListRef.value = list;
    optionListRef.value = optionList;
    loadRef.value = true;
  };
  const initLoad = function () {
    if (!loadRef.value) {
      namespaceApi.queryList().then((res) => {
        if (res.status == 200 && res.data.data.length > 0) {
          setLastList(res.data.data);
        }
      });
    }
  };
  //load value from localStorage
  try {
    let storageValue = localStorage.getItem(NAMESPACE_STORAGE_KEY);
    if (storageValue) {
      let obj = JSON.parse(storageValue);
      setCurrent(obj);
    }
  } catch (err) {
    console.warn('load value from localStorage error', err);
  }
  return {
    current: currentRef,
    listList: listListRef,
    optionList: optionListRef,
    setCurrent,
    setLastList,
    initLoad
  };
}

export const namespaceStore: INamespaceStore = createStore();

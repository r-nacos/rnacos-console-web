<template>
  <n-menu
      :options="webResources.sideMenu"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :value="getSelectedKeys"
      :expanded-keys="openKeys"
      @update:value="clickMenuItem"
      @update:expanded-keys="menuExpanded"
    />
</template>

<script lang="ts" setup>
import type { MenuOption } from 'naive-ui';
import { useWebResources } from '@/data/resources';
import {ref, watch, reactive, toRefs, computed, unref} from 'vue';
import { userApi } from '@/api/user';
import { handleApiResult } from '@/utils/request';
import { useRouter, useRoute } from 'vue-router';

const emits = defineEmits(['update:collapsed', 'clickMenuItem']);
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

const webResources = useWebResources();
const menuOptions = ref<MenuOption[]>(webResources.sideMenu);
const pathRef = ref('/');
const router = useRouter();
const currentRoute = useRoute();

const updateWebResources = () => {
  if (!webResources.fromRequest) {
    userApi
      .getUserWebResources()
      .then(handleApiResult)
      .then((data) => {
        webResources.update(data);
      });
  }
};

const changeRoute = (route: any) => {
  pathRef.value = route.path;
  updateSelectedKeys();
};

watch(
  () => currentRoute.fullPath,
  (newPath: string) => {
    changeRoute({ path: newPath });
    if (props.collapsed) {
      emits('update:collapsed', !props.collapsed);
    }
  }
);

onMounted(() => {
  updateWebResources();
  changeRoute(router);
});

const selectedKeys = ref<string>(currentRoute.name as string);
const getSelectedKeys = computed(() => unref(selectedKeys));


const matched = currentRoute.matched;
const getOpenKeys =
  matched && matched.length ? matched.map((item: any) => item.name) : [];
const state = reactive({
  openKeys: getOpenKeys
});

const { openKeys } = toRefs(state);
function menuExpanded(openKeys: string[]) {
  if (!openKeys) return;
  const latestOpenKey = openKeys.find(
    (key) => state.openKeys.indexOf(key) === -1
  );
  const isExistChildren = findChildrenLen(latestOpenKey as string);
  state.openKeys = isExistChildren
    ? latestOpenKey
      ? [latestOpenKey]
      : []
    : openKeys;
}

function findChildrenLen(key: string) {
  if (!key) return false;
  const subRouteChildren: string[] = [];
  for (const { children, key } of unref(webResources.sideMenu)) {
    if (children && children.length) {
      subRouteChildren.push(key as string);
    }
  }
  return subRouteChildren.includes(key);
}

function clickMenuItem(key: string) {
  router.push({ name: key });
  emits('clickMenuItem', key);
}

function updateSelectedKeys() {
  const matched = currentRoute.matched;
  state.openKeys = matched.map((item: any) => item.name);
  const activeMenu: string = (currentRoute.meta?.activeMenu as string) || '';
  selectedKeys.value = activeMenu
    ? (activeMenu as string)
    : (currentRoute.name as string);
}
</script>

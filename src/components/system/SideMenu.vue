<template>
  <ul class="wrap">
    <template
      v-for="(item, index) in webResources.sideMenu"
      :key="index"
    >
      <template v-if="item.children">
        <li class="group-item">
          <span class="icon">
            <n-icon
              size="16"
              color="#2f6cf7"
              :component="item.icon"
            />
          </span>
          <span>{{ item.name }}</span>
        </li>
        <li
          class="item"
          :class="{ select: path === subitem.path }"
          v-for="(subitem, subindex) in item.children || []"
          :key="index + subindex"
        >
          <router-link
            class="link"
            :to="{ path: subitem.path }"
          >
            {{ subitem.name }}
          </router-link>
        </li>
      </template>

      <li
        v-else
        class="group-item"
        :class="{ select: path === item.path }"
      >
        <router-link
          class="link"
          :to="{ path: path }"
        >
          {{ item.name }}
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { useWebResources } from '@/data/resources'
import apis from '@/apis'
const route = useRoute()
const webResources = useWebResources()
const path = ref(route.path)

watch(
  () => route,
  (nv, ov) => {
    changeRoute(nv)
  },
  {
    deep: true,
  },
)

const changeRoute = (route: any) => {
  path.value = route.path
}

const updateWebResources = async () => {
  let { status, data } = await apis.getJSON(apis.userWebResources)
  if (status === 200 && data && typeof data === 'object') {
    if (data.info) {
      webResources.update(data?.data as any)
    }
  }
}

onBeforeMount(() => {
  updateWebResources()
})
</script>

<style lang="scss" scoped>
.wrap {
  background: #ffffff;
  padding: 15px 8px;
}

.group-item {
  padding-left: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  height: 36px;
  line-height: 36px;
  text-align: left;
  display: flex;
  gap: 2px;
  align-items: center;
}

.group-item .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}

.item {
  padding-left: 32px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  height: 36px;
  line-height: 36px;
  text-align: left;
  /*
    border-width: 0 0 1px 0;;
    border: 1px solid #324155;
    border-width: 0 0 1px 0;;
  */
}

.item:hover,
.group-item:hover {
  background: #f4f5f8;
}

.select {
  color: #2f6cf7;
  background: #ecf3ff;
}

.select .link {
  color: #2f6cf7;
}

.link {
  display: block;
  width: 100%;
  text-decoration: none;
  color: #595959;
}
</style>

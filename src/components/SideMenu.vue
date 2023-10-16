<template>
  <ul class="wrap">
    <template v-for="(item, index) in items" :key="index">
      <template v-if="item.children">
        <li class="group-item">
          <span class=icon>
            <n-icon size="16" color="#2f6cf7" :component="item.icon" />
          </span>
          <span>{{ item.name }}</span>
          <!--
                    <n-icon size="20">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2L227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" fill="currentColor"></path></svg>
                    </n-icon>
                    -->
        </li>
        <li
          class="item"
          :class="{ select: this.path === subitem.path }"
          v-for="(subitem, subindex) in (item.children || [])"
          :key="index + subindex">
          <router-link class="link" :to="{ 'path': subitem.path }">
            {{ subitem.name }}
          </router-link>
        </li>
      </template>

      <li v-else class="group-item" :class="{ select: this.path === item.path }">
        <router-link class="link" :to="{ 'path': item.path }">
          {{ item.name }}
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script>

//import {manageMenu} from '@/route/routes.js'
import { ServerOutline, CubeOutline, AppsSharp } from '@vicons/ionicons5'

export default {
  components: {
    ServerOutline,
    CubeOutline,
    AppsSharp,
  },
  setup() {

  },
  data() {
    const manageMenu = [
      {
        name: "配置管理",
        icon: markRaw(CubeOutline),
        children: [
          {
            name: "配置列表",
            path: "/manage/configs"
          },
          /*
          {
              name:"配置",
              path:"/manage/config"
          },
          */
        ],
      },
      {
        name: "服务管理",
        icon: markRaw(ServerOutline),
        children: [
          {
            name: "服务列表",
            path: "/manage/service"
          },
        ],
      },
      {
        name: "系统管理",
        icon: markRaw(AppsSharp),
        children: [
          {
            name: "命名空间",
            path: "/manage/namespace"
          },
          {
            name: "集群信息",
            path: "/manage/cluster"
          },
        ],
      },
    ]
    return {
      path: '/',
      name: 'side nemu',
      items: [...manageMenu],
    }
  },
  methods: {
    changeRoute(route) {
      this.path = route.path
      /*
      for(const i in this.items) {
          var item = this.items[i];
          if(route.path===item.path){
              item.select = true;
          }
          else{
              item.select = false;
              for(const subitem of (item.children || [])) {
                  if(route.path===item.path){
                      subitem.select = true;
                  }
                  else{
                      subitem.select = false;
                  }
              }
          }
      }
      */
    }
  },
  watch: {
    "$route"(newRoute, old) {
      this.changeRoute(newRoute)
    }
  },
  created() {
    this.changeRoute(this.$route)
  },
}
</script>

<style scoped>
.wrap {
  background: #ffffff;
  padding: 15px 8px;
}

.group-item {
  padding-left: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, .9);
  height: 36px;
  line-height: 36px;
  text-align: left;
  display: flex;
  gap: 2px;
  align-items: center;
  /*
        border-width: 0 0 1px 0;
        cursor: pointer;
        */
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
  color: rgba(0, 0, 0, .6);
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

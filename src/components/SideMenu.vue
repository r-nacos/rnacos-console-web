<template>
<div class="wrap">
    <div class="wrap-item" v-for="(item,index) in items" :key="index" >
        <div v-if="item.children" >
            <div class="group-item">
                <span>{{item.name}}</span>
                <!--
                <n-icon size="20">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2L227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" fill="currentColor"></path></svg>
                </n-icon>
                -->
            </div>
            <div >
                <div class="item" v-for="(subitem,subindex) in (item.children || [])" :key="index+subindex" :class="{select:this.path===subitem.path}" >
                    <router-link class="link" :to="{'path':subitem.path}">{{subitem.name}}</router-link>
                </div>
            </div>
        </div>
        <div v-else >
            <div class="group-item" :class="{select:this.path===item.path}" >
                <router-link class="link" :to="{'path':item.path}">{{item.name}}</router-link>
            </div>
        </div>
    </div>
</div>
</template>

<script>

//import {manageMenu} from '@/route/routes.js'

export default {
    setup() {
        
    },
    data() {
        const manageMenu = [
            {
                "name":"配置管理",
                children: [
                    {
                        "name":"config",
                        "path":"/manage/config"
                    },
                ],
            },
            {
                "name":"服务管理",
                children: [
                    {
                        "name":"service",
                        "path":"/manage/service"
                    },
                ],
            },
            {
                "name":"命名空间",
                "path":"/manage/namespace"
            },
        ];
        return {
            path:'/',
            name: 'side nemu',
            items: [...manageMenu],
        }
    },
    methods :{
        changeRoute(route) {
            this.path = route.path;
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
        "$route" (newRoute,old){
            this.changeRoute(newRoute);
        }
    },
    created() {
        this.changeRoute(this.$route)
    },
}
</script>

<style scoped>
.wrap {
    width:100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    overflow-y: scroll;
    background: #d9dee4;
    color: #616261;
}

.wrap-item {
    /*
    padding: 5px;
    padding-left: 30px;
    */
    text-align: left;
}

.group-item{
    padding: 5px;
    padding-left: 20px;
    font-size: 16px;
    color: #616261;
    line-height: 25px;
    text-align: left;
    border-width: 0 0 1px 0;
    cursor: pointer;
}

.item {
    padding: 5px;
    padding-left: 40px;
    font-size: 16px;
    color: #616261;
    line-height: 25px;
    text-align: left;
    border-width: 0 0 1px 0;;
    /* 
    border: 1px solid #324155;
    border-width: 0 0 1px 0;;
    */
}

.item:hover,.group-item:hover,.select {
    background: #f1f2f7;
}
.link {
    display: block;
    width: 100%;
    text-decoration: none;
    color: #616261;
}

</style>

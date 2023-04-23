<template>
<div class="wrap">
    <div class="item" v-for="(item,index) in items" :key="index" :class="{select:item.select}" >
        <router-link class="link" :to="{'path':item.path}">{{item.name}}</router-link>
    </div>
</div>
</template>

<script>

import {manageMenu} from '@/route/routes.js'

export default {
    setup() {
        
    },
    data() {
        return {
            name: 'side nemu',
            items: [...manageMenu],
        }
    },
    methods :{
        changeRoute(route) {
            for(const i in this.items) {
                var item = this.items[i];
                if(route.path===item.path){
                    item.select = true;
                }
                else{
                    item.select = false;
                }
            }
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
    background: #1f233d;
}

.item {
    padding: 5px;
    font-size: 16px;
    color: #d9dad9;
    line-height: 25px;
    text-align: center;
    border: 1px solid #324155;
    border-width: 0 0 1px 0;;
}

.select {
    background: #324155;
}
.link {
    display: block;
    width: 100%;
    text-decoration: none;
    color: #d9dad9;
}

</style>

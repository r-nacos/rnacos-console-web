<template>
    <div class="wrap">
        <div class="header-wrap" :style="{'height':layoutSize.headerHeight+'px'}">
            <div class="sider-header">
                R-NACOS
            </div>
            <div class="header">
            </div>
        </div>
        <div class="content_wrap">
            <div class="side" :style="{'width':layoutSize.siderWidth+'px'}">
                <SideMenu/>
            </div>
            <div class="content">
                <div class="content-inner" :style="{'width':layoutSize.contentWidth+'px','height':layoutSize.contentHeight+'px'}"> 
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <!-- 
        <div class="footer" :style="{'height':size.footerHeight+'px'}">
            footer
        </div>
        -->
    </div>
        
</template>
    
<script>

import SideMenu from '../SideMenu.vue';
import { useMessage } from 'naive-ui'
import { defineComponent,reactive } from 'vue'
import {useLayoutSize} from '@/data/appdata';

export default defineComponent({
    components:{
        SideMenu,
    },
    setup() {
        window.$message = useMessage();
        let layoutSize = useLayoutSize();
        layoutSize.updateLayoutSize(undefined);
        return {
            layoutSize:layoutSize,
            doUpdateLayoutSize(){
                layoutSize.updateLayoutSize(undefined);
            }
        }
    },
    methods: {
    },
    mounted() {
        var updateLayoutSize=()=>{this.doUpdateLayoutSize()};
        updateLayoutSize();
        window.addEventListener("resize",updateLayoutSize) 
    }
})

</script>
    
<style scoped>
.wrap {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header-wrap {
    flex: 0 0 auto;
    height: 52px;
    background: #2f6cf7;
    color: #fff;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
}

.sider-header{
    flex: 0 0 auto;
    height: 52px;
    width: 200px;
    position: relative;
    line-height: 52px;
    text-align: center;
    background: #2f6cf7;
    color: #fff;
}

.header {
    flex: 1 1 auto;
    background: #2f6cf7;
    color:#fff;
    height: 52px;
}

.content_wrap {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    height: 100%;
}
.side {
    flex: 0 0 auto;
    height: 100%;
    width: 200px;;
    background: #fff;
    color: #595959;
    border-right: 1px #ccc solid;
    /* 
    border-right: 1px #ccc solid;
    */
}
.content {
    flex-grow: 1;
    background: #ffffff;
    position: relative;
    display: block;
    overflow: hidden;
}

.content-inner {
    position: relative;
    display: block;
    overflow: scroll;
    background: #efefef;
}

.footer {
    flex: 0 0 auto;
    height: 30px;
}

</style>
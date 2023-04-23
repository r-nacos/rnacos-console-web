<template>
    <div class="wrap">
        <div class="header-wrap" :style="{'height':size.headerHeight+'px'}">
            <div class="sider-header">
                R-NACOS
            </div>
            <div class="header">
            </div>
        </div>
        <div class="content_wrap">
            <div class="side" :style="{'width':size.sideWidth+'px'}">
                <SideMenu/>
            </div>
            <div class="content">
                <div class="content-inner" :style="{'width':size.contentWidth+'px','height':size.contentHeight+'px'}"> 
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

export default defineComponent({
    components:{
        SideMenu,
    },
    setup() {
        window.$message = useMessage();
        let width = window.innerWidth;
        let height = window.innerHeight;
        let sizeRef=reactive({
            sideWidth:200,
            headerHeight:64,
            footerHeight:0,
            contentWidth:width-200,
            contentHeight:height-64-30,
        })

        return {
            size:sizeRef,
            doUpdateLayoutSize(){
                sizeRef.contentWidth = window.innerWidth - sizeRef.sideWidth;
                sizeRef.contentHeight = window.innerHeight - sizeRef.headerHeight - sizeRef.footerHeight;
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
    height: 64px;
    background: #021429;
    color: #fff;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
}

.sider-header{
    flex: 0 0 auto;
    height: 64px;
    width: 200px;
    position: relative;
    height: 64px;
    line-height: 64px;
    text-align: center;
    background: #021429;
    color: #fff;
}

.header {
    flex: 1 1 auto;
    background: #f1f2f7;
    color:#021429;
    height: 64px;
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
    width: 240px;;
    background: #ccffff;
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
}

.footer {
    flex: 0 0 auto;
    height: 30px;
}

</style>
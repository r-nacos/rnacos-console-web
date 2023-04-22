<template>
    <div class="wrap">
        <div class="header" :style="{'height':size.headerHeight+'px'}">
            header 
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
        <div class="footer" :style="{'height':size.footerHeight+'px'}">
            footer
        </div>
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
        window.$message = useMessage()
        let width = window.innerWidth;
        let height = window.innerHeight;
        let sizeRef=reactive({
            sideWidth:200,
            headerHeight:64,
            footerHeight:30,
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

.header {
    flex-grow: 0;
    height: 64px;
    background: #cccccc;
}
.content_wrap {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    height: 100%;
    background: #cccccc;
}
.side {
    flex-grow: 0;
    height: 100%;
    width: 240px;;
    background: #ccffff;
}
.content {
    flex-grow: 1;
    background: #ffffcc;
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
    flex-grow: 0;
    height: 30px;
}

</style>
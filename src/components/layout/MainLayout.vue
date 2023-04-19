<template>
    <div class="wrap">
        <div class="header">
            header 
        </div>
        <div class="content_wrap">
            <div class="side">
                <SideMenu/>
            </div>
            <div class="content">
                <n-message-provider>
                <router-view></router-view>
                </n-message-provider>
            </div>
        </div>
        <div class="footer">
            footer
        </div>
    </div>
        
</template>
    
<script setup>

import SideMenu from '../SideMenu.vue';

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
    height: 80px;
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
}
.footer {
    flex-grow: 0;
    height: 50px;
}

</style>
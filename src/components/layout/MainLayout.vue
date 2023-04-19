<template>
    <div class="wrap">
        <div class="header">
            header 
        </div>
        <div class="content_wrap">
            <div class="side">
                side
            </div>
            <div class="content">
                content
            </div>
        </div>
        <div class="footer">
            footer
        </div>
    </div>
        
</template>
    
<script setup>

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
    height: 100px;
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
    background: #00cccc;
}
.content {
    flex-grow: 1;
    background: #ff0000;
}
.footer {
    flex-grow: 0;
    height: 100px;
}

</style>
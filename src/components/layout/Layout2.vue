<template>
<div class="app">
    <div class="header_wrap">
        <div class="sider-header">
            r-nacos
        </div>
        <div class="header">

        </div>
    </div>
    <div class="content_wrap">
        <div class="book_sider">
            <div class="sider_content">
                side
            </div>
            <div class="clearfix"></div>
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

<style scoped>

.clear{
    float:both;
}

.app{
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header_wrap{
    flex: 0 0 auto;
    height: 64px;
    display: flex;
}

.header{
    background: #fff;
}

.content_wrap{
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
}


.book_sider {
    flex: 0 0 auto;
    width: 200px;
    background: #021429;
}

.conent{
    flex: 1 1 auto;
    overflow: hidden;
    background: #fff;
    border-top: 1px solid #ccc;
}

.sider-header {
    flex: 0 0 auto;
    height: 64px;
    line-height: 64px;
    text-align: center;
    background: #000000;
    color: #fff;
    width: 200px;
}

.sider_content{
    flex: auto;
    overflow: auto;
    height: 100%;
}


.footer{
    flex: 0 0 auto;
    height:30px;
}



</style>
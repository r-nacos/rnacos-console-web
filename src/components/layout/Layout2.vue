<template>
<div class="app" ref="container">
    <div class="header_wrap">
        <div class="sider-header">
            r-nacos
        </div>
        <div class="header">

        </div>
    </div>
    <div class="content_wrap">
        <div class="book_sider" ref="sider">
            <div class="sider_content">
                side
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="content-outter">
            <div class="content" ref="contentView">
                <div class="content-inner">
                    content
                    <div class="test-block"> 
                        test block
                    </div>
                    <div >
                    content
                    </div>
                    <div >
                    content
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer">
        footer
    </div>
</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {

    },
    methods: {
        updateContentSize(){
            let contentWidth = window.innerWidth-200;
            console.log("updateContentSize",contentWidth)
            this.$refs.contentView.style.width=contentWidth+"px";
        }
    },
    mounted() {
        var f=()=>{this.updateContentSize()};
        f();
        window.addEventListener("resize",function(a,b){
            console.log("onsize:",a,b);
            f();
        })
    }
})
</script>


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

.conent-outter{
    flex: 1 1 auto;
    overflow: hidden;
    background: #fff;
    border-top: 1px solid #ccc;
    position: relative;
    display: block;
}

.content{
    height: 100%;
    width: 100%;
    overflow:scroll;
    position: relative;
    display: block;
}

.content-inner{
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


.test-block{
    background:#f00;
    width: 100%;
    height: 1500px;
}


</style>
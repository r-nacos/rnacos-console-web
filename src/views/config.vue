<template>
    <div>
        <div>
            <span>tenant:</span>
            <input type="text" v-model="tenant" />
        </div>
        <div>
            <span>group:</span>
            <input type="text" v-model="group" />
        </div>
        <div>
            <span>dataId:</span>
            <input type="text" v-model="dataId" />
        </div>
        <div>
            <span>content:</span>
            <input type="text" v-model="content" />
        </div>
        <div>
            <button @click="setConfig"> 设置</button>
            <button @click="getConfig"> 获取</button>
        </div>
    </div>
</template>

<script>
import configApi from '@/api/config'
import { useMessage } from 'naive-ui'

const message=useMessage();

export default {
    name:"Config",
    data() {
        return {
            tenant: "",
            group: "foo",
            dataId: "001",
            content: "",
            message:message,
        }
    },
    methods: {
        setConfig() {
            console.log("setConfig",this.group,this.dataId);
            configApi.setConfig(this.tenant,this.group,this.dataId,this.content).then( res => {
                console.log("response",res.request.responseText)
                if(res.status==200){
                    this.content=null;
                }
            })
            .catch(err=> {
                console.log("response err",err.message)
            })
        },
        getConfig() {
            console.log("getConfig",this.group,this.dataId);
            configApi.getConfig(this.tenant,this.group,this.dataId).then( res => {
                console.log("response",res.request.responseText)
                if(res.status==200){
                    this.content = res.request.responseText;
                }
            })
            .catch(err=> {
                console.log("response err",err.message)
                this.message.info(err.message +"\n"+ res.request.responseText);
            })
        },
    }
}

</script>


<style scoped>

</style>
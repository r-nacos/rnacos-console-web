<template>
<div>
    <n-form
    inline
    :label-width="80"
  >
    <n-form-item label="服务" path="param.serviceParam">
      <n-input v-model:value="param.serviceParam" placeholder="input service name" />
    </n-form-item>
    <n-form-item label="服务组" path="param.groupParam">
      <n-input v-model:value="param.groupParam" placeholder="input group name" />
    </n-form-item>
    <n-form-item>
      <n-button attr-type="button" @click="queryList">
         查询
      </n-button>
    </n-form-item>
  </n-form>
</div>
    
</template>

<script>

import {ref} from 'vue'
import namingApi from '@/api/naming'

export default {
    setup() {
    },
    data() {
        return {
            param:ref({
                "serviceParam":"",
                "groupParam":"",
                "namespaceId":"",
                "pageNo":1,
                "pageSize":20,
            }),
            namespaceId:'',
        }
    },
    methods: {
        queryList(){
            namingApi.queryServicePage({
                namespaceId:this.namespaceId,
                accessToken:null,
                serviceNameParam:this.param.serviceParam,
                groupNameParam:this.param.groupParam,
                pageNo:this.param.pageNo,
                pageSize:this.param.pageSize,
            }).then( res => {
                console.log("response",res.request.responseText)
                if(res.status==200){
                }
            })
            .catch(err=> {
                console.log("response err",err.message)
            })
        },
    }
}
</script>

<style scoped>

</style>
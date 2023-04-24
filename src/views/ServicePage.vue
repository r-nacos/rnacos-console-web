<template>

<div class="form-container">
    <div > 
        <NamespacePopSelect/>
    </div>
    <div class="query-params">
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
    <div class="table-data">
        <n-data-table
            remote
            ref="table"
            :columns="columns"
            :data="data"
            :loading="loading"
            :pagination="pagination"
            :row-key="rowKey"
            @update:page="handlePageChange"
        />
    </div>
</div>
    
</template>


<script>

import {ref,reactive,defineComponent} from 'vue'
import namingApi from '@/api/naming'
import {namespaceStore} from '../data/namespace'
import NamespacePopSelect from '../components/namespace/NamespacePopSelect.vue';

const columns = [
    {
        title:'服务',
        key:'name'
    },
    {
        title:'服务组',
        key:'groupName'
    },
    {
        title:'实例数',
        key:'ipCount'
    },
    {
        title:'健康实例数',
        key:'healthyInstanceCount'
    },
]

export default defineComponent({
    components:{
        NamespacePopSelect,
    },
    setup(self) {
        //window.$message = useMessage();
        const dataRef = ref([])
        const loadingRef = ref(false)
        const paginationReactive = reactive({
            page: 1,
            pageCount: 1,
            pageSize: 10,
            itemCount:0,
            prefix ({ itemCount }) {
                return `Total is ${itemCount}.`
            }
        })
        return {
            columns,
            data: dataRef,
            pagination: paginationReactive,
            loading: loadingRef,
            param:ref({
                "serviceParam":"",
                "groupParam":"",
                "namespaceId":"",
                "pageNo":1,
                "pageSize":20,
            }),
            namespaceId:'',
            rowKey (rowData) {
                return rowData.groupName+ "@@"+rowData.name
            },
            doHandlePageChange (currentPage) {
                paginationReactive.page = currentPage;
                if (!loadingRef.value) {
                    loadingRef.value = true
                    this.doQueryList()
                    .then(res => {
                        loadingRef.value=false;
                        if(res.status==200){
                            let count = res.data.count;
                            let pageSize = paginationReactive.pageSize;
                            dataRef.value=res.data.serviceList
                            paginationReactive.itemCount = count;
                            paginationReactive.pageCount = Math.round((count+pageSize-1)/pageSize);
                        }
                        else{
                            window.$message.error("request err,status code:"+res.status);
                            dataRef.value=[];
                        }
                    })
                    .catch(err=> {
                        window.$message.error("request err,message"+err.message);
                        dataRef.value=[];
                        loadingRef.value=false;
                    })
                }
            },
        }
    },

    methods: {
        handlePageChange(page){
            this.doHandlePageChange(page);
        },
        queryList(){
            this.doHandlePageChange(1);
        },
        doQueryList(){
            console.log("doQueryList",namespaceStore.current,namespaceStore.current.namespaceId);
            return namingApi.queryServicePage({
                namespaceId:namespaceStore.current.value.namespaceId,
                accessToken:null,
                serviceNameParam:this.param.serviceParam,
                groupNameParam:this.param.groupParam,
                pageNo:this.pagination.page,
                pageSize:this.pagination.pageSize,
            })
            /*
            .then( res => {
                console.log("response",res.request.responseText)
                if(res.status==200){
                }
            })
            .catch(err=> {
                console.log("response err",err.message)
            })
            */
        },
    }
})
</script>

<style scoped>
.form-container{
    display: flex;
    flex-direction: column;
    position: relative;
    background: #fff;
    height: 100%;
    width:100%;
}

.query-params{
    flex: 0 0 auto;
}

.table-data {
    flex-grow: 1 1 auto;
    position: relative;
    overflow: scroll;
    height: 100%;
    width: 100%;
}

</style>
<template>
<div class="container">
    <div class="ops">
        <div class="title">
            <n-h2 prefix="bar">
                <n-text type="primary">
                    命名空间
                </n-text>
            </n-h2>
        </div>
        <div class="buttons">
            <n-button>创建命名空间</n-button>
            <n-button @click="loadNamespace">刷新</n-button>
        </div>
    </div>
    <div class="data clear">
        <n-data-table
            remote
            ref="table"
            :columns="columns"
            :data="data"
            :loading="loading"
            :pagination="false"
            :row-key="rowKey"
        />
    </div>
</div>
    
</template>

<script>
import {ref,defineComponent} from 'vue'
import {NButton} from 'naive-ui'
import namespaceApi from '@/api/namespace'

const columns = [
    {
        title:'命名空间名称',
        key:'namespaceName'
    },
    {
        title:'命名空间ID',
        key:'namespaceId'
    },
    {
        title:'操作',
        key:'type',
        render (row) {
            return h(
            NButton,
            {
                strong: true,
                tertiary: true,
                size: 'small',
                onClick: () => window.$message.info(row.namespaceName)
            },
            { default: () => 'Play' }
            )
        }
    },
]

export default defineComponent({
    setup() {
        const dataRef = ref([{
            'namespaceId':'',
            'namespaceName':'public',
            'type':'0',
        }]);
        const loadingRef = ref(false)
        return {
            columns,
            data: dataRef,
            pagination: false,
            loading: loadingRef,
            rowKey (rowData) {
                return rowData.namespaceId
            },
            doLoadNamespace(){
                namespaceApi.queryList().then(res=>{
                    if(res.status==200){
                        dataRef.value = res.data.data
                    }
                    else{
                        window.$message.error("request err,status code:"+res.status);
                    }
                })
                .catch(err=>{
                    window.$message.error(err.message)
                })
            }
        }
    },
    methods:{
        loadNamespace() {
            console.log("loadNamespace")
            this.doLoadNamespace()
        }
    }
})
</script>

<style scoped>

.container{
    padding: 5px;
}
.title {
    float: left;
}

.buttons{
    float: right;
}

</style>

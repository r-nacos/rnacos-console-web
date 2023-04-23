<template>
<div class="wrap">
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
            <n-button @click="showCreate">创建命名空间</n-button>
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
    <div class="form" v-show="useForm">
        <div>
            <div class="form-close"> 
                <n-icon size="20" @click="closeForm">
                    <Close/>
                </n-icon>
            </div>
        </div>
    </div>
</div>
    
</template>

<script>
import {ref,defineComponent} from 'vue'
import {NButton} from 'naive-ui'
import {Close} from '@vicons/ionicons5';
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
    components:{
        Close,
    },
    setup() {
        const dataRef = ref([{
            'namespaceId':'',
            'namespaceName':'public',
            'type':'0',
        }]);
        const loadingRef = ref(false)
        const useFormRef = ref(false)
        return {
            useForm:useFormRef,
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
            },
            showCreate(){
                useFormRef.value=true;
            },
            closeForm(){
                useFormRef.value=false;
            }
        }
    },
    methods:{
        loadNamespace() {
            console.log("loadNamespace")
            this.doLoadNamespace()
        },
    }
})
</script>

<style scoped>

.wrap{
    position: relative;
}

.container{
    padding: 5px;
}
.title {
    float: left;
}

.buttons{
    float: right;
}


.form{
    z-index: 1;
    position:absolute;
    width:400px;
    height: 100%;
    right:0px;
    background: #fff;
    border-left: #ccc 1px solid;
}

.form-close{
    cursor: pointer;
    font-size:20px;
    line-height: 30px;
    height: 30px;
    width: 30px;
    padding: 5px;
    text-align: center;
}

</style>

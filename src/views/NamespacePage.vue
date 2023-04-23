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
        <div class="clear form-top">
            <div class="form-close"> 
                <n-icon size="20" @click="closeForm">
                    <Close/>
                </n-icon>
            </div>
        </div>
        <div> 
            <n-form :model="model" :rules="rules">
                <n-form-item path="namespaceName" label="命名空间名称">
                    <n-input v-model:value="model.namespaceName" @keydown.enter.prevent />
                </n-form-item>
                <n-form-item path="namespaceId" label="命名空间Id">
                    <n-input v-model:value="model.namespaceId" @keydown.enter.prevent />
                </n-form-item>
    
                <n-row :gutter="[0, 24]">
                    <n-col :span="24">
                        <div style="display: flex; justify-content: flex-end">
                        <n-button
                            :disabled="model.namespaceId === null"
                            round
                            @click="closeForm"
                        >
                            返回
                        </n-button>
                        <n-button
                            :disabled="model.namespaceId === null"
                            round
                            type="primary"
                            @click="create"
                        >
                            确认
                        </n-button>
                        </div>
                    </n-col>
                </n-row>
            </n-form>
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
        const modelRef = ref({
            'namespaceId':'',
            'namespaceName':'',
        })
        const rules ={
            namespaceId: [
                {
                required: true,
                validator (rule , value ) {
                    if (!value) {
                    return new Error('需要输入ID')
                    }
                    return true
                },
                trigger: ['input', 'blur']
                }
            ],

            namespaceName: [
                {
                required: true,
                validator (rule , value ) {
                    if (!value) {
                    return new Error('需要输入名称')
                    }
                    return true
                },
                trigger: ['input', 'blur']
                }
            ],
        }
        return {
            useForm:useFormRef,
            columns,
            data: dataRef,
            model: modelRef,
            pagination: false,
            loading: loadingRef,
            rules,
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
                modelRef.value = {
                    'namespaceId':'',
                    'namespaceName':'',
                };
            },
            closeForm(){
                useFormRef.value=false;
            },
            doCreate(){
                namespaceApi.add(modelRef.value).then(res=>{
                    if(res.status==200){
                        if(res.data.code==200){
                            this.closeForm();
                            this.doLoadNamespace();
                        }
                        else{
                            window.$message.error(res.data.message);
                        }
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
        },
        create(){
            this.doCreate()
        },
    },
    created(){
        this.loadNamespace()
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
    padding: 0 5px;
    z-index: 1;
    position:absolute;
    width:400px;
    height: 100%;
    right:0px;
    background: #fff;
    border-left: #ccc 1px solid;
}

.form-top {
    clear:both;
    height:30px;
}

.form-close{
    cursor: pointer;
    font-size:20px;
    line-height: 30px;
    float:right;
    height: 30px;
    width: 30px;
    padding: 5px;
    text-align: center;
}

</style>

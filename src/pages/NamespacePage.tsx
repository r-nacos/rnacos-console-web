
import {ref,defineComponent} from 'vue'
import {NButton, NCol, NDataTable, NForm, NFormItem, NH2, NIcon, NInput, NRow, NText} from 'naive-ui'
import {Close} from '@vicons/ionicons5';
import namespaceApi from '@/api/namespace'
//import {createColumns} from '../components/namespace/NamespaceColumns'
//import NamespacePopSelect from '../components/namespace/NamespacePopSelect.vue';
import {namespaceStore} from '../data/namespace'
import { IHandeNamespace, INamespace } from '@/types/namespace';
import SubContentPage from '@/components/common/SubContentPage'
import styles from './NamespacePage.module.css'

import {
    FormInst,
    FormItemInst,
    FormItemRule,
    FormRules
  } from 'naive-ui'
import { IColumn, MyWindow } from '@/types/base';

declare var window :MyWindow;

export const createColumns= function(showUpdate:IHandeNamespace, remove:IHandeNamespace):IColumn[] {
    const columns = [
        {
            title: '命名空间名称',
            key: 'namespaceName'
        },
        {
            title: '命名空间ID',
            key: 'namespaceId'
        },
        {
            title: '操作',
            key: 'type',
            render(row:INamespace) {
                if(row.namespaceId===''){
                    return <div>保留空间</div>
                }
                return (
                    <div>
                        <NButton size="tiny" onClick={()=>showUpdate(row)}>编辑</NButton>
                        <NButton size="tiny" onClick={()=>remove(row)}>删除</NButton>
                    </div>
                )
            }
        },
    ]
    return columns
}

/*
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
*/

export default defineComponent({
    components:{
        Close,
        //NamespacePopSelect,
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
            'mode':'',
        })
        const rules ={
            namespaceId: [
                {
                required: true,
                validator (rule:FormItemRule , value:string ) {
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
                validator (rule:FormItemRule , value:string ) {
                    if (!value) {
                    return new Error('需要输入名称')
                    }
                    return true
                },
                trigger: ['input', 'blur']
                }
            ],
        }
        const showUpdate=function(row:INamespace){
            modelRef.value = {
                'namespaceId':row.namespaceId,
                'namespaceName':row.namespaceName,
                'mode':'update'
            };
            useFormRef.value=true;

        }
        const doLoadNamespace=function(){
                namespaceApi.queryList().then(res=>{
                    if(res.status==200){
                        dataRef.value = res.data.data
                        namespaceStore.setLastList(res.data.data);
                    }
                    else{
                        window.$message.error("request err,status code:"+res.status);
                    }
                })
                .catch(err=>{
                    window.$message.error(err.message)
                })
        };
        const removeItem=function(row:INamespace){
            namespaceApi.delete(row).then(res=>{
                if(res.status==200){
                    if(res.data.code==200){
                        doLoadNamespace();
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
        const columns:IColumn[] = createColumns(showUpdate,removeItem);
        return {
            useForm:useFormRef,
            columns,
            data: dataRef,
            model: modelRef,
            pagination: {
                pageSize: 5,
            },
            loading: loadingRef,
            rules,
            rowKey (rowData:INamespace) {
                return rowData.namespaceId
            },
            doLoadNamespace,
            showCreate(){
                modelRef.value = {
                    'namespaceId':'',
                    'namespaceName':'',
                    'mode':'add'
                };
                useFormRef.value=true;
            },
            closeForm(){
                useFormRef.value=false;
            },
            
            
        }
    },
    methods:{
        loadNamespace() {
            this.doLoadNamespace()
        },
        create(){
            this.doCreate()
        },
        submit(){
            if(this.model.mode==='add'){
                this.doCreate()
            }
            else{
                this.doUpdate()
            }
        },
        doCreate(){
            namespaceApi.add(this.model).then(res=>{
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
        },
        doUpdate(){
            namespaceApi.update(this.model).then(res=>{
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
        },
    },
    created(){
        this.loadNamespace()
    }
    ,
    render() {
        return (
<div class="wrap">
    <div class="container">

    <div class={styles.ops}>
        <div class={styles.opsTitle}>
            <span >
                命名空间
            </span>
        </div>
        <div class={styles.opsButton}>
            <NButton onClick={()=>{this.showCreate()}}>创建命名空间</NButton>
            <NButton onClick={()=>{this.loadNamespace()}}>刷新</NButton>
        </div>
    </div>
    <div class="data clear">
        <NDataTable
            remote
            ref="table"
            columns={this.columns}
            data={this.data}
            loading={this.loading}
            pagination={this.pagination}
            row-key={this.rowKey}
        />
    </div>
    </div>
    <SubContentPage 
        v-show={this.useForm}
        title={this.model.mode=="add"?"新增命名空间":"修改命名空间"}
        onClose={()=>this.closeForm()}
        onSubmit={()=>this.submit()}
    > 
        <NForm model={this.model} rules={this.rules}>
                <NFormItem path="namespaceName" label="命名空间名称">
                    <NInput value={this.model.namespaceName} onUpdateValue={(v)=>this.model.namespaceName=v } />
                </NFormItem>
                <NFormItem path="namespaceId" label="命名空间Id">
                    <NInput value={this.model.namespaceId} onUpdateValue={(v)=>this.model.namespaceId=v } />
                </NFormItem>
        </NForm>
    </SubContentPage>
</div>

        )
    }
})

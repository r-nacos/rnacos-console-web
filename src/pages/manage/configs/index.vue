<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '配置',
      },
      apis: {
        list: apis.configList,
        create: apis.configAdd,
        update: apis.configUpdate,
        delete: apis.configRemove,
      },
      param: param,
      drawer: {
        width: drawerWidth,
      },
    }"
    :data="tableData"
  >
    <template #header>
      <div>配置列表</div>
      <div>
        <NamespacePopSelect @change="changeNamespace" />
      </div>
    </template>
    <template #actions="{ param }">
      <div>
        <NForm
          label-placement="left"
          label-width="auto"
          inline
        >
          <NFormItem
            label="配置"
            path="param.dataParam"
          >
            <n-input
              v-model:value="param.dataParam"
              placeholder="输入配置ID"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="配置组"
            path="param.groupParam"
          >
            <n-input
              v-model:value="param.groupParam"
              placeholder="输入配置组"
              clearable
            />
          </NFormItem>
        </NForm>
      </div>
      <div class="actions-right">
        <NButton class="mg-r10 mg-l10">查询</NButton>
        <NButton
          class="mg-r10"
          @click="createForm"
          type="info"
        >
          新建
        </NButton>
        <a
          ref="downloadRef"
          @click="download"
        >
          <NButton
            type="info"
            class="mg-r10"
          >
            下载
          </NButton>
        </a>
        <n-upload
          :action="apis.configImport"
          :headers="uploadHeader"
          :show-file-list="false"
          @before-upload="doBeforeUpload"
          @finish="handlerUploadFinish"
        >
          <NButton type="info">上传文件</NButton>
        </n-upload>
      </div>
    </template>
    <template #form="{ formData }">
      <ConfigForm
        ref="configForm"
        :formData="formData"
        v-if="visibleType == 1"
      />
      <DiffContent
        v-else
        :nv="formData.content"
        :ov="state.ov"
      />
    </template>
    <template #footer>
      <NSpace
        align="baseline"
        v-if="visibleType == 1"
      >
        <NButton
          text
          @click="closeDrawer"
        >
          返回
        </NButton>
        <NButton
          type="primary"
          @click="onNext"
        >
          确认
        </NButton>
      </NSpace>
      <NSpace
        align="baseline"
        v-else
      >
        <NButton
          text
          @click="onPrev"
        >
          返回
        </NButton>
        <NButton
          type="primary"
          @click="onSave()"
        >
          确认变更
        </NButton>
      </NSpace>
    </template>
  </PageContainer>
</template>

<script lang="tsx" setup title="配置列表" layout="nav">
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue'
import DiffContent from '@/components/config/DiffContent.vue'
import apis from '@/apis/index'
import { configApi } from '@/apis/config'
import { namespaceStore } from '@/data/namespace'
import { useWebResources } from '@/data/resources'
import { useRouter } from 'vue-router'
import * as constant from '@/types/constant'
import qs from 'qs'
import { NButton, NPopconfirm, NUpload, useMessage, NSpace, NForm, NFormItem } from 'naive-ui'
import ConfigForm from '@/components/config/ConfigForm.vue'
import { useLayoutSize } from '@/store/index'
import type { CrudOptions } from '@/types/base'
const pageContainer = ref<HTMLDivElement>() as any
const configForm = ref<HTMLDivElement>() as any
let layoutSize = useLayoutSize()
let router = useRouter()
let webResources = useWebResources()
const downloadRef = ref<any>(null)
const tableData = ref([])
const useFormRef = ref(false)
const visibleType = ref(1)
const drawerWidth = ref(600)
const paramRef = ref({
  dataParam: '',
  groupParam: '',
  tenant: '',
  pageNo: 1,
  pageSize: 20,
})
let state = reactive({
  ov: '',
})
const modelRef = ref({ dataId: '', group: 'DEFAULT_GROUP', md5: '', showMd5: true, content: '', sourceContent: '', mode: constant.FORM_MODE_CREATE })
const uploadHeader = ref({
  tenant: namespaceStore.current.value.namespaceId,
})
const message = useMessage()

onMounted(() => {
  let bd = document.querySelector('body')
  if (bd) {
    drawerWidth.value = bd?.clientWidth - layoutSize.siderWidth
  }
})

const changeNamespace = () => {
  alert('查询')
}

const createForm = () => {
  state.ov = ''
  pageContainer.value?.createForm({
    dataId: '',
    group: 'DEFAULT_GROUP',
    md5: '',
    showMd5: true,
    content: '',
    sourceContent: '',
    mode: constant.FORM_MODE_CREATE,
  })
}

/**
 * 上一步
 */
const onPrev = () => {
  visibleType.value = 1
}

/**
 * 下一步进行diff对比
 */
const onNext = () => {
  console.log('next')
  visibleType.value = 2
}

/* 关闭表单 */
const closeDrawer = () => {
  pageContainer.value?.closeDrawer()
}

// 保存数据
const onSave = () => {
  pageContainer.value?.onSave()
}

// const getTenant = computed(() => namespaceStore.current.value.namespaceId)

// const getDetailTitle = computed(() => {
//   if (modelRef.value.mode === constant.FORM_MODE_UPDATE) {
//     return '编辑配置'
//   } else if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
//     return '新增配置'
//   }
//   return '编辑详情'
// })

const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `总行数: ${itemCount}`
  },
})

const param = {
  tenant: namespaceStore.current.value.namespaceId,
  dataParam: paramRef.value.dataParam,
  groupParam: paramRef.value.groupParam,
  pageNo: paginationReactive.page,
  pageSize: paginationReactive.pageSize,
}

/**
 * 修改
 *
 * @param row 行数据
 */
const updateItem = async (row: any) => {
  let res = await apis.getJSON(apis.getConfig, {
    params: {
      tenant: row.tenant,
      group: row.group || 'DEFAULT_GROUP',
      dataId: row.dataId || '',
    },
  })
  visibleType.value = 1
  state.ov = res.request.responseText
  pageContainer.value?.updateForm({
    md5: res.headers['content-md5'] || '',
    showMd5: row.showMd5 || true,
    content: res.request.responseText || '',
    sourceContent: row.sourceContent || '',
    mode: constant.FORM_MODE_UPDATE,
    tenant: row.tenant,
    group: row.group || 'DEFAULT_GROUP',
    dataId: row.dataId || '',
  })
}

const doBeforeUpload = () => {
  uploadHeader.value = {
    tenant: namespaceStore.current.value.namespaceId,
  }
}

const doShowConfigDetail = (row: any, mode: any) => {
  let config = {
    tenant: row.tenant,
    group: row.group,
    dataId: row.dataId,
  }
  configApi
    .getConfig(config)
    .then(res => {
      if (res.status == 200) {
        modelRef.value = {
          mode: mode,
          showMd5: true,
          content: res.request.responseText,
          sourceContent: res.request.responseText,
          md5: res.headers['content-md5'] || '',
          ...config,
        }
        useFormRef.value = true
      } else {
        message.error('查询配置报错,response code:' + res.status)
      }
    })
    .catch(err => {
      message.error('查询配置报错,' + err.message)
    })
}

/**
 *
 * @param row 详情数据
 */
const detailItem = (row: any) => {
  doShowConfigDetail(row, constant.FORM_MODE_DETAIL)
}

/**
 * 删除
 * @param row 行数据
 */
const removeItem = (row: any) => {
  pageContainer.value?.onDelete({
    tenant: row.tenant,
    group: row.group,
    dataId: row.dataId,
  })
}

/**
 * 显示历史
 *
 * @param row 行数据
 */
const showHistory = (row: any) => {
  router.push({
    path: '/manage/config/history',
    query: {
      tenant: row.tenant,
      group: row.group,
      dataId: row.dataId,
    },
  })
}

const removeConfirmSlots = {
  trigger: () => {
    return (
      <NButton
        size="tiny"
        quaternary
        type="error"
      >
        删除
      </NButton>
    )
  },
}

const columns = [
  {
    title: '配置ID',
    key: 'dataId',
  },
  {
    title: '配置组',
    key: 'group',
  },
  {
    title: '操作',
    key: 'type',
    fixed: 'right',
    render(row: { group: any; dataId: any }) {
      let editButton
      let removePopconfirm
      if (webResources.canUpdateConfig) {
        editButton = (
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => updateItem(row)}
          >
            编辑
          </NButton>
        )
        removePopconfirm = (
          <NPopconfirm
            onPositiveClick={() => removeItem(row)}
            v-slots={removeConfirmSlots}
          >
            <span>
              确认要删配置组为:{row.group},ID为:{row.dataId}的配置吗？
            </span>
          </NPopconfirm>
        )
      } else {
        editButton = <span></span>
        removePopconfirm = editButton
      }
      return (
        <div>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => detailItem(row)}
          >
            详情
          </NButton>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => showHistory(row)}
          >
            历史记录
          </NButton>
          {editButton}
          {removePopconfirm}
        </div>
      )
    },
  },
]

const rowKey = (rowData: any) => {
  return rowData.group + '@@' + rowData.dataId
}

const handlerUploadFinish = ({ event }: any) => {
  if (event.target.status == 200) {
    message.info('上传成功')
    doHandlePageChange(1)
  } else {
    message.error('上传处理失败')
  }
}

const download = () => {
  paramRef.value.tenant = namespaceStore.current.value.namespaceId
  let params = qs.stringify(paramRef.value)
  let url = apis.configDownload + '?' + params
  downloadRef.value?.setAttribute('href', url)
  return true
}
</script>

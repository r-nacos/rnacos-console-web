<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '配置',
      },
      apis: {
        list: apis.configs,
      },
      param: param,
    }"
    :data="tableData"
  >
    <template #header>
      <div>配置列表</div>
      <div>
        <NamespacePopSelect @change="doQueryList" />
      </div>
    </template>
    <template #actions="{ param }">
      <div>
        <n-form
          label-placement="left"
          label-width="auto"
          inline
        >
          <n-form-item
            label="配置"
            path="param.dataParam"
          >
            <n-input
              v-model:value="param.dataParam"
              placeholder="输入配置ID"
              clearable
            />
          </n-form-item>
          <n-form-item
            label="配置组"
            path="param.groupParam"
          >
            <n-input
              v-model:value="param.groupParam"
              placeholder="输入配置组"
              clearable
            />
          </n-form-item>
        </n-form>
      </div>
      <div class="actions-right">
        <n-button class="mg-r10">查询</n-button>
        <n-button
          class="mg-r10"
          @click="createHandle"
          type="info"
        >
          新建
        </n-button>
        <a
          ref="downloadRef"
          @click="download"
        >
          <n-button
            type="info"
            class="mg-r10"
          >
            下载
          </n-button>
        </a>
        <n-upload
          :action="apis.configImport"
          :headers="uploadHeader"
          :show-file-list="false"
          @before-upload="doBeforeUpload"
          @finish="handlerUploadFinish"
        >
          <n-button type="info">上传文件</n-button>
        </n-upload>
      </div>
    </template>
  </PageContainer>
  <ConfigForm
    v-if="visible"
    :formData="modelRef"
    :visible="visible"
    @close-modal="visible = false"
    @refreshData="refreshData"
  />
</template>

<script lang="tsx" setup title="配置列表" layout="nav">
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue'
import apis from '@/apis/index'
import { configApi } from '@/apis/config'
import { namespaceStore } from '@/data/namespace'
import { useWebResources } from '@/data/resources'
import { useRouter } from 'vue-router'
import * as constant from '@/types/constant'
import qs from 'qs'
import { NButton, NPopconfirm, NUpload, useMessage } from 'naive-ui'
import ConfigForm from '@/components/config/ConfigForm.vue'
let router = useRouter()
let webResources = useWebResources()
const downloadRef = ref<any>(null)
const tableData = ref([])
const useFormRef = ref(false)
const loadingRef = ref(false)
const visible = ref(false)
const paramRef = ref({
  dataParam: '',
  groupParam: '',
  tenant: '',
  pageNo: 1,
  pageSize: 20,
})
const modelRef = ref({ dataId: '', group: 'DEFAULT_GROUP', md5: '', showMd5: true, content: '', sourceContent: '', mode: constant.FORM_MODE_CREATE })
const uploadHeader = ref({
  tenant: namespaceStore.current.value.namespaceId,
})
const message = useMessage()
const getTenant = computed(() => namespaceStore.current.value.namespaceId)
const getDetailTitle = computed(() => {
  if (modelRef.value.mode === constant.FORM_MODE_UPDATE) {
    return '编辑配置'
  } else if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
    return '新增配置'
  }
  return '编辑详情'
})
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
 * 创建配置
 */
const createHandle = () => {
  modelRef.value = {
    dataId: '',
    group: 'DEFAULT_GROUP',
    md5: '',
    showMd5: true,
    content: '',
    sourceContent: '',
    mode: constant.FORM_MODE_CREATE,
  }
  visible.value = true
}

/**
 * 修改
 *
 * @param row 行数据
 */
const updateItem = (row: any) => {
  modelRef.value = {
    dataId: row.dataId || '',
    group: row.group || 'DEFAULT_GROUP',
    md5: row.md5 || '',
    showMd5: row.showMd5 || true,
    content: row.content || '',
    sourceContent: row.sourceContent || '',
    mode: constant.FORM_MODE_UPDATE,
  }
  visible.value = true
  // doShowConfigDetail(row, constant.FORM_MODE_UPDATE)
}

const doBeforeUpload = () => {
  uploadHeader.value = {
    tenant: namespaceStore.current.value.namespaceId,
  }
}

const doQueryList = () => {
  return configApi.queryConfigPage({
    tenant: namespaceStore.current.value.namespaceId,
    dataParam: paramRef.value.dataParam,
    groupParam: paramRef.value.groupParam,
    pageNo: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
  })
}

const doHandlePageChange = (currentPage: number) => {
  doQueryList()
    .then(res => {
      loadingRef.value = false
      if (res.status == 200) {
        let count = res.data.count
        let pageSize = paginationReactive.pageSize
        tableData.value = res.data.list
        paginationReactive.itemCount = count
        paginationReactive.pageCount = Math.round((count + pageSize - 1) / pageSize)
      } else {
        message.error('request err,status code:' + res.status)
        tableData.value = []
      }
    })
    .catch(err => {
      message.error('request err,message' + err.message)
      tableData.value = []
      loadingRef.value = false
    })
}

const refreshData = () => {
  visible.value = false
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
  let config = {
    tenant: row.tenant,
    group: row.group,
    dataId: row.dataId,
  }
  configApi
    .removeConfig(config)
    .then(res => {
      if (res.status == 200) {
        message.info('删除配置成功')
        doHandlePageChange(1)
      } else {
        message.error('删除配置报错,response code:' + res.status)
      }
    })
    .catch(err => {
      message.error('删除配置报错,' + err.message)
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
        type="error">
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
            onClick={() => updateItem(row)}>
            编辑
          </NButton>
        )
        removePopconfirm = (
          <NPopconfirm
            onPositiveClick={() => removeItem(row)}
            v-slots={removeConfirmSlots}>
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
            onClick={() => detailItem(row)}>
            详情
          </NButton>
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => showHistory(row)}>
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
  let url = '/nacos/v1/console/config/download?' + params
  downloadRef.value?.setAttribute('href', url)
  return true
}
</script>

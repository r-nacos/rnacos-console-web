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
      param: paramRef,
      drawer: {
        width: '100%',
        placement: placement,
        showMask: false,
      },
    }"
    show
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
        <NButton
          class="mg-r10 mg-l10"
          @click="onSearch"
        >
          查询
        </NButton>
        <NButton
          class="mg-r10"
          @click="createForm"
          type="info"
          v-if="webResources.canUpdateConfig"
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
            导出
          </NButton>
        </a>
        <n-upload
          :action="apis.configImport"
          :headers="uploadHeader"
          :show-file-list="false"
          @before-upload="doBeforeUpload"
          @finish="handlerUploadFinish"
          v-if="webResources.canUpdateConfig"
        >
          <NButton type="info">导入</NButton>
        </n-upload>
      </div>
    </template>
    <template #custom="{ formData, isReadonly }">
      <ConfigFormContainer
        :formData="formData"
        :isReadonly="isReadonly"
        :ov="state.ov"
        :visibleType="visibleType"
        :showForm="showForm"
        @cancel="cancel"
      ></ConfigFormContainer>
    </template>
  </PageContainer>
</template>

<script lang="tsx" setup title="配置列表" layout="nav">
import ConfigFormContainer from '@/components/config/ConfigFormContainer.vue'
import apis from '@/apis/index'
import { namespaceStore } from '@/data/namespace'
import { useWebResources } from '@/data/resources'
import { useRouter } from 'vue-router'
import * as constant from '@/types/constant'
import qs from 'qs'
import { NButton, NPopconfirm, NUpload, useMessage, NSpace, NForm, NFormItem } from 'naive-ui'
import { useLayoutSize } from '@/store/index'
import type { INamespace } from '@/types/namespace'
const pageContainer = ref<HTMLDivElement>() as any
let layoutSize = useLayoutSize()
let router = useRouter()
let webResources = useWebResources()
const downloadRef = ref<any>(null)
const visibleType = ref(1)
const drawerWidth = ref(600)
const placement = ref('auto')
const paramRef = ref({
  dataParam: '',
  groupParam: '',
  tenant: namespaceStore.current.value.namespaceId,
  pageNo: 1,
  pageSize: 10,
})
let state = reactive({
  ov: '',
  mode: '',
})
const uploadHeader = ref({
  tenant: namespaceStore.current.value.namespaceId,
})
let showForm = ref(false)
const message = useMessage()

onMounted(() => {
  let bd = document.querySelector('body')
  if (bd) {
    drawerWidth.value = bd?.clientWidth - layoutSize.siderWidth
  }
})

const cancel = (type: string = '') => {
  showForm.value = false
  if (type === 'refreshData') {
    pageContainer.value?.refreshData()
  }
}

/** 查询 */
const onSearch = () => {
  pageContainer.value?.onSearch()
}

/**
 * 改变命名空间
 *
 * @param nm
 */
const changeNamespace = (nm: INamespace) => {
  paramRef.value.tenant = nm.namespaceId
  pageContainer.value?.onSearch()
}

/**
 * 新建表单
 */
const createForm = () => {
  state.ov = ''
  visibleType.value = 1
  state.mode = constant.FORM_MODE_CREATE
  pageContainer.value?.initFormData({
    dataId: '',
    group: 'DEFAULT_GROUP',
    md5: '',
    showMd5: true,
    content: '',
    sourceContent: '',
    desc: '',
    configType: '',
    mode: constant.FORM_MODE_CREATE,
  })
  showForm.value = true
}

/**
 * 获取配置内容
 *
 * @param row 行数据
 */
const getConfig = (row: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let { status, data } = await apis.getJSON(apis.configInfo, {
      params: {
        tenant: row.tenant,
        group: row.group || 'DEFAULT_GROUP',
        dataId: row.dataId || '',
      },
    })
    if (status === 200 && data.data && typeof data.data === 'object') {
      if (data.success) {
        resolve(data.data)
      } else {
        message.info('获取请求配置失败')
        reject({})
      }
    } else {
      message.error('请求失败')
      reject({})
    }
  })
}

/**
 * 修改
 *
 * @param row 行数据
 */
const cloneItem = async (row: any) => {
  getConfig(row).then((data: any) => {
    state.mode = constant.FORM_MODE_CREATE
    state.ov = ``
    pageContainer.value?.initFormData({
      md5: ``,
      showMd5: true,
      content: `${data.value || ''}`,
      sourceContent: '',
      mode: state.mode,
      tenant: row.tenant,
      group: row.group || 'DEFAULT_GROUP',
      dataId: '',
      desc: data.desc || '',
      configType: data.configType || 'text',
    })
    showForm.value = true
    visibleType.value = 1
  })
}

/**
 * 修改
 *
 * @param row 行数据
 */
const updateItem = async (row: any) => {
  getConfig(row).then((data: any) => {
    state.mode = constant.FORM_MODE_UPDATE
    state.ov = `${data.value || ''}`
    pageContainer.value?.initFormData({
      md5: `${data.md5 || ''}`,
      showMd5: row.showMd5 || true,
      content: `${data.value || ''}`,
      sourceContent: row.sourceContent || '',
      mode: state.mode,
      tenant: row.tenant,
      group: row.group || 'DEFAULT_GROUP',
      dataId: row.dataId || '',
      desc: data.desc || '',
      configType: data.configType || 'text',
    })
    showForm.value = true
    visibleType.value = 1
  })
}

/**
 * 下载前处理
 */
const doBeforeUpload = () => {
  uploadHeader.value = {
    tenant: namespaceStore.current.value.namespaceId,
  }
}

/**
 *
 * @param row 详情数据
 */
const detailItem = async (row: any) => {
  getConfig(row).then((data: any) => {
    state.mode = constant.FORM_MODE_DETAIL
    pageContainer.value?.initFormData({
      md5: data.md5 || '',
      showMd5: row.showMd5 || true,
      content: data.value || '',
      sourceContent: row.sourceContent || '',
      mode: constant.FORM_MODE_DETAIL,
      tenant: row.tenant,
      group: row.group || 'DEFAULT_GROUP',
      dataId: row.dataId || '',
      desc: data.desc || '',
      configType: data.configType || 'text',
    })
    showForm.value = true
    visibleType.value = 1
  })
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
    path: '/manage/configs/history',
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
      let cloneButton
      let removePopconfirm
      console.log(webResources.canUpdateConfig, 'webResources.canUpdateConfig')
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
        cloneButton = (
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => cloneItem(row)}>
            克隆
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
        removePopconfirm = <span></span>
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
          {cloneButton}
          {removePopconfirm}
        </div>
      )
    },
  },
]

/**
 * 文件上传
 *
 * @param param 文件上传
 */
const handlerUploadFinish = ({ event }: any) => {
  if (event.target.status == 200) {
    message.info('导入成功')
    pageContainer.value?.refreshData()
  } else {
    message.error('导入处理失败')
  }
}

/**
 * 下载配置
 */
const download = () => {
  paramRef.value.tenant = namespaceStore.current.value.namespaceId
  let params = qs.stringify(paramRef.value)
  let url = apis.configDownload + '?' + params
  downloadRef.value?.setAttribute('href', url)
  return true
}
</script>

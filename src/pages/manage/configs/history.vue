<template>
  <PageContainer
    ref="pageContainer"
    :config="{
      columns: columns,
      form: {
        title: '历史记录内容',
      },
      apis: {
        list: apis.configHistory,
        create: apis.configAdd,
        update: apis.configUpdate,
        delete: apis.configRemove,
      },
      param: paramRef,
      drawer: {
        width: '600px',
        placement: 'right',
      },
      pagination: paginationReactive,
    }"
  >
    <template #header>
      <div>配置历史记录列表</div>
      <n-button @click="router.go(-1)">返回</n-button>
    </template>
    <template #actions="{ param, methods }">
      <div>
        <n-form
          label-placement="left"
          label-width="auto"
          inline
        >
          <NFormItem
            label="配置ID"
            path="param.serviceParam"
          >
            <NInput
              :disabled="true"
              v-model:value="param.dataId"
              placeholder=""
            />
          </NFormItem>
          <NFormItem
            label="配置组"
            path="param.groupParam"
          >
            <NInput
              :disabled="true"
              v-model:value="param.group"
              placeholder=""
            />
          </NFormItem>
        </n-form>
      </div>
      <n-button @click="methods.refreshData()">刷新</n-button>
    </template>
    <template #form="{ formData }">
      <ConfigForm
        ref="configForm"
        :formData="formData"
        :is-history="true"
        v-if="visibleType == 1"
      />
      <DiffContent
        v-else
        :nv="formData.content"
        :ov="state.ov"
      />
    </template>
    <template #footer="{ formData }">
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
          @click="onSave(formData)"
        >
          确认变更
        </NButton>
      </NSpace>
    </template>
  </PageContainer>
</template>

<script lang="tsx" setup title="配置历史记录列表" layout="nav">
import DiffContent from '@/components/config/DiffContent.vue'
import apis from '@/apis/index'
import { namespaceStore } from '@/data/namespace'
import { useWebResources } from '@/data/resources'
import { useRouter } from 'vue-router'
import * as constant from '@/types/constant'
import { NButton, NPopconfirm, NUpload, useMessage, NSpace, NForm, NFormItem } from 'naive-ui'
import ConfigForm from '@/components/config/ConfigForm.vue'
import { useLayoutSize } from '@/store/index'
import type { AnyObj } from '@/utils'
import { toDateTime } from '@/utils/date'
const pageContainer = ref<HTMLDivElement>() as any
const configForm = ref<HTMLDivElement>() as any
const layoutSize = useLayoutSize()
const route = useRoute()
const router = useRouter()
const webResources = useWebResources()
const visibleType = ref(1)
const drawerWidth = ref(600)
const paramRef = ref({
  tenant: route.query.tenant || '',
  dataId: route.query.dataId,
  group: route.query.group || '',
  pageNo: 1,
  pageSize: 20,
})
let state = reactive({
  ov: '',
  mode: '',
})
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
  if (state.mode === constant.FORM_MODE_DETAIL) {
    pageContainer.value?.closeDrawer()
    return
  }
  visibleType.value = 2
}

/* 关闭表单 */
const closeDrawer = () => {
  pageContainer.value?.closeDrawer()
}

/**
 * 保存配置数据
 *
 * @param formData 配置项
 */
const onSave = (formData: AnyObj) => {
  pageContainer.value?.onSave(formData)
  visibleType.value = 1
}

/**
 * 分页
 */
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  prefix({ itemCount }: any) {
    paginationReactive.itemCount = itemCount
    return `总行数: ${itemCount}`
  },
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})

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
const updateItem = async (row: any) => {
  getConfig(row).then((data: any) => {
    visibleType.value = 2
    state.mode = constant.FORM_MODE_UPDATE
    state.ov = `${data.value || ''}`
    pageContainer.value?.updateForm({
      md5: `${data.md5 || ''}`,
      showMd5: row.showMd5 || true,
      content: `${data.value || ''}`,
      sourceContent: row.sourceContent || '',
      mode: constant.FORM_MODE_UPDATE,
      tenant: row.tenant,
      group: row.group || 'DEFAULT_GROUP',
      dataId: row.dataId || '',
      desc: '',
      configType: '',
    })
  })
}

/**
 *
 * @param row 详情数据
 */
const detailItem = async (row: any) => {
  getConfig(row).then((data: any) => {
    visibleType.value = 1
    state.mode = constant.FORM_MODE_DETAIL
    pageContainer.value?.showDetail({
      md5: data.md5 || '',
      showMd5: row.showMd5 || true,
      content: data.value || '',
      sourceContent: row.sourceContent || '',
      mode: constant.FORM_MODE_DETAIL,
      tenant: row.tenant,
      group: row.group || 'DEFAULT_GROUP',
      dataId: row.dataId || '',
    })
  })
}

const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '配置ID',
    key: 'dataId',
  },
  {
    title: '配置组',
    key: 'group',
  },
  {
    title: '更新时间',
    key: 'modifiedTime',
    render(row: { modifiedTime: string | number | Date }) {
      let value = ''
      if (row.modifiedTime) {
        let date = new Date(row.modifiedTime)
        value = toDateTime(date)
      }
      return <span>{value}</span>
    },
  },
  {
    title: '操作',
    key: 'type',
    fixed: 'right',
    render(row: any) {
      let rollbackButton
      if (webResources.canUpdateConfig) {
        rollbackButton = (
          <NButton
            size="tiny"
            quaternary
            type="primary"
            onClick={() => updateItem(row)}>
            恢复
          </NButton>
        )
      } else {
        rollbackButton = <span></span>
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
          {rollbackButton}
        </div>
      )
    },
  },
]
</script>

<template>
  <div class="wrap">
    <PageContainer
      v-if="!useDiffForm"
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
          width: state.width,
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
        />
      </template>
      <template #footer="{ formData }">
        <NSpace align="baseline">
          <NButton
            text
            @click="closeDrawer"
          >
            返回
          </NButton>
          <NButton
            type="primary"
            @click="showDiffForm"
          >
            恢复历史记录
          </NButton>
        </NSpace>
      </template>
    </PageContainer>

    <Transition name="slide-fade">
      <SubContentFullPage
        v-if="useDiffForm"
        title="配置内容比较"
        submitName="确认变更"
        @close="closeDiffForm"
        @submit="submitDiffForm"
      >
        <DiffComponent
          :src="state.ov"
          :dst="state.nv"
        />
      </SubContentFullPage>
    </Transition>
  </div>
</template>

<script lang="tsx" setup title="配置历史记录列表" layout="nav">
import DiffComponent from '@/components/config/DiffComponent.vue'
import apis from '@/apis/index'
import { namespaceStore } from '@/data/namespace'
import { useWebResources } from '@/data/resources'
import { useRouter } from 'vue-router'
import * as constant from '@/types/constant'
import { NButton, useMessage, NSpace, NForm, NFormItem } from 'naive-ui'
import ConfigForm from '@/components/config/ConfigForm.vue'
import SubContentFullPage from '@/components/common/SubContentFullPage'
import { useLayoutSize } from '@/store/index'
import type { AnyObj } from '@/utils'
import { toDateTime } from '@/utils/date'
const pageContainer = ref<HTMLDivElement>() as any
const configForm = ref<HTMLDivElement>() as any
const layoutSize = useLayoutSize()
const route = useRoute()
const router = useRouter()
const webResources = useWebResources()
const useDiffForm = ref(false)
const drawerWidth = ref(600)
const paramRef = ref({
  tenant: route.query.tenant || '',
  dataId: route.query.dataId,
  group: route.query.group || '',
  pageNo: 1,
  pageSize: 20,
})
let state = reactive({
  nv: '',
  ov: '',
  historyContent: '',
  mode: '',
  width: '600px',
})
const message = useMessage()
/*
onMounted(() => {
  let bd = document.querySelector('body')
  if (bd) {
    drawerWidth.value = bd?.clientWidth - layoutSize.siderWidth
  }
})
*/

/* 关闭表单 */
const closeDrawer = () => {
  pageContainer.value?.closeDrawer()
}

/**
 * 分页
 */
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 20, 30, 40],
  showSizePicker: true,
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
  return new Promise((resolve, reject) => {
    apis
      .getJSON(apis.configInfo, {
        params: {
          tenant: row.tenant,
          group: row.group || 'DEFAULT_GROUP',
          dataId: row.dataId || '',
        },
      })
      .then(res => {
        if (res.status === 200 && res.data.data && typeof res.data.data === 'object') {
          if (res.data.success) {
            resolve(res.data.data)
          } else {
            message.info('获取请求配置失败')
            reject({})
          }
        } else {
          message.error('请求失败')
          reject({})
        }
      })
  })
}

const closeDiffForm = () => {
  useDiffForm.value = false
}

const showDiffForm = () => {
  // 历史的值
  //state.nv = `${data.value || ''}`
  //state.ov = `${row.content || ''}`
  getConfig(paramRef.value).then((data: any) => {
    state.nv = `${data.value || ''}`
    state.mode = constant.FORM_MODE_UPDATE
    useDiffForm.value = true
  })
}

const submitDiffForm = () => {
  //console.log('submit,history content', state.historyContent)
  //pageContainer.value?.onSave(pageContainer.value?.formData)
  postDate(state.historyContent).then(() => {
    useDiffForm.value = false
  })
}

const postDate = async function (content: any) {
  let requestData = {
    tenant: route.query.tenant || '',
    dataId: route.query.dataId,
    group: route.query.group || '',
    content: content,
  }
  let { status, data } = await apis.postJSON(apis.configUpdate, {
    data: requestData,
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      message.info('编辑成功')
      //refreshData()
    } else {
      message.info('编辑失败')
    }
  } else {
    message.error('请求失败')
  }
}

/**
 * 修改
 *
 * @param row 行数据
 */
const rollback = async (row: any) => {
  state.historyContent = row.content
  state.ov = row.content
  getConfig(paramRef.value).then((data: any) => {
    useDiffForm.value = true
    state.mode = constant.FORM_MODE_UPDATE
    // 历史的值
    state.nv = `${data.value || ''}`
    state.ov = `${row.content || ''}`
    // 当前数据
    pageContainer.value?.updateForm({
      md5: `${data.md5 || ''}`,
      showMd5: row.showMd5 || true,
      content: `${row.content || ''}`,
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
  state.historyContent = row.content
  state.ov = row.content
  // 此处详情应该是历史的数据
  pageContainer.value?.showDetail({
    md5: row.md5 || '',
    showMd5: row.showMd5 || true,
    content: row.content || '',
    sourceContent: row.sourceContent || '',
    mode: constant.FORM_MODE_DETAIL,
    tenant: row.tenant,
    group: row.group || 'DEFAULT_GROUP',
    dataId: row.dataId || '',
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
            onClick={() => rollback(row)}>
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

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efefef;
  flex: 1 auto;
}
</style>

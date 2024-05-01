<template>
  <div class="page-container">
    <div
      class="page-header"
      v-if="slots.header"
    >
      <slot
        name="header"
        :methods="{ createForm, refreshData, onSearch }"
        :param="state.param"
      ></slot>
    </div>
    <div
      class="page-content"
      id="page-content"
    >
      <NCard>
        <div
          v-if="slots.actions"
          class="page-actions"
        >
          <div class="action">
            <slot
              name="actions"
              :methods="{ createForm, refreshData, loadData }"
              :param="state.param"
            ></slot>
          </div>
        </div>
        <div class="page-table">
          <NDataTable
            :columns="config.columns"
            :data="state.tableData"
            :pagination="config.pagination"
            :bordered="false"
          />
        </div>
        <div
          class="page-pager"
          v-if="!config.pagination"
        >
          <NPagination
            :item-count="state.totalCount"
            :on-update:page="pageUpdate"
            :on-update:pageSize="pageSizeUpdate"
            show-size-picker
            :page-sizes="pageSizes"
          >
            <template #prefix>总行数: {{ state.totalCount }}</template>
          </NPagination>
        </div>
      </NCard>
    </div>
    <NDrawer
      to="#page-content"
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="showDrawer"
      default-width="600"
      :height="height"
      :width="config.drawer?.width"
      resizable
      :placement="placement"
      :show-mask="false"
    >
      <NDrawerContent
        :title="formTitle"
        closable
      >
        <slot
          name="form"
          :operationType="state.operationType"
          :submitLoading="state.submitLoading"
          :formData="state.formData"
          :isReadonly="state.formData.mode === constant.FORM_MODE_DETAIL"
          :isKeyReadonly="state.formData.mode !== constant.FORM_MODE_CREATE"
          :methods="{ onSave, onValidateFail, closeDrawer }"
        ></slot>
        <template #footer>
          <slot
            name="footer"
            :formData="state.formData"
            v-if="slots.footer"
          ></slot>
          <NSpace
            v-else
            align="baseline"
          >
            <NButton
              text
              @click="closeDrawer"
            >
              返回
            </NButton>
            <NButton
              type="primary"
              @click="confirm"
            >
              确认
            </NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
<script setup lang="ts">
import type { CrudOptions } from '@/types/base'
import { NCard, NDrawerContent, useMessage, NButton, NTable } from 'naive-ui'
import type { AnyObj } from '@/utils'
import constant from '@/types/constant'
import apis from '@/apis/index'
const slots = useSlots()
const toast = useMessage()
const emits = defineEmits(['onSave'])
let props = defineProps({
  config: {
    type: Object as PropType<CrudOptions<Object>>,
    default: new Map<string, any>(),
  },
  data: {
    type: Array<any>,
    default: () => [],
  },
})
const placement: any = 'auto'
const showDrawer = ref(false)
const height = ref(500)
const state = reactive({
  operationType: 1,
  submitLoading: false,
  formData: {} as AnyObj,
  param: (props.config.param ? props.config.param : {}) as AnyObj,
  tableData: [],
  totalCount: 0,
})
const pageSizes = [
  {
    label: '10 每页',
    value: 10,
  },
  {
    label: '20 每页',
    value: 20,
  },
  {
    label: '30 每页',
    value: 30,
  },
  {
    label: '40 每页',
    value: 40,
  },
]

// 动态标题
const formTitle = computed(() => props.config.form?.title + (state.formData.mode == constant.FORM_MODE_CREATE ? '新增' : state.formData.mode == constant.FORM_MODE_UPDATE ? '编辑' : '详情'))

/**
 * 新增
 *
 * @param model 数据字段
 */
const createForm = (model: AnyObj = {}) => {
  state.formData = { ...model, mode: constant.FORM_MODE_CREATE }
  console.log(state.formData, 'state.formData')
  showDrawer.value = true
}

/**
 * 修改
 *
 * @param itemData 变更数据项
 */
const updateForm = (itemData: AnyObj) => {
  state.formData = { ...itemData, mode: constant.FORM_MODE_UPDATE }
  showDrawer.value = true
}

/**
 * 显示详情
 *
 * @param itemData 详情数据
 */
const showDetail = (itemData: AnyObj) => {
  state.formData = { ...itemData, mode: constant.FORM_MODE_DETAIL }
  showDrawer.value = true
}

/**
 * 确认
 */
const confirm = () => {
  // 调用表单校验 此处主要是验证之后再次控制提交的数据，便于提交之前再做一次自定义调整
  if (props.config.validator && typeof props.config.validator === 'function') {
    props.config
      .validator(state.formData)
      .then((data: AnyObj) => {
        console.log(data, `mode: ${data.mode || ''} type:submit`)
        if (data) {
          if (data.mode === 'add' || data.mode === constant.FORM_MODE_CREATE) {
            onSave(data)
          } else {
            onUpdate(data)
          }
        }
      })
      .catch(() => {
        return
      })
  } else {
    if (state.formData.mode === 'add' || state.formData.mode === constant.FORM_MODE_CREATE) {
      onSave(state.formData)
    } else {
      onUpdate(state.formData)
    }
  }
}

/**
 * 保存表单数据
 */
const onSave = async (formData: any) => {
  let url = formData.mode === 'add' || formData.mode === constant.FORM_MODE_CREATE ? `${props.config.apis?.create || ''}` : `${props.config.apis?.update || ''}`
  let { status, data } = await apis.postJSON(url, {
    data: formData,
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      toast.success('添加成功')
      refreshData()
    } else {
      toast.error('添加失败')
    }
  } else {
    toast.error('请求失败')
  }
}

/**
 * 更新表单数据
 * headers: {
 *   'Content-Type': 'application/x-www-form-urlencoded',
 * },
 */
const onUpdate = async (formData: any) => {
  let { status, data } = await apis.postJSON(`${props.config.apis?.update || ''}`, {
    data: formData,
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      toast.success('修改成功')
      refreshData()
    } else {
      toast.error(data.message || '修改失败')
    }
  } else {
    toast.error('请求失败')
  }
}

/**
 * 删除数据
 *
 * @param params 删除参数
 */
const onDelete = async (params: AnyObj) => {
  let { status, data } = await apis.postJSON(`${props.config.apis?.delete || ''}`, {
    data: params,
  })
  if (status === 200 && data && typeof data === 'object') {
    if (data.success) {
      toast.success('删除成功')
      refreshData()
    } else {
      toast.error(data.message || '删除失败')
    }
  } else {
    toast.error('请求失败')
  }
}

/**
 * 关闭抽屉
 */
const closeDrawer = () => {
  state.formData = {}
  showDrawer.value = false
  state.submitLoading = false
}

/**
 * 加载数据
 */
const loadData = async () => {
  let url = `${props.config.apis?.list}`
  if (url) {
    let resp = await apis.getJSON(url, {
      params: state.param,
    })
    // 兼容处理
    if (Array.isArray(resp.data.data)) {
      state.tableData = resp.data?.data || []
    } else {
      if (Array.isArray(resp.data.list)) {
        state.tableData = resp.data.list || []
        return
      } else if (Array.isArray(resp.data.data.list)) {
        state.tableData = resp.data.data.list || []
        state.totalCount = resp.data.data.totalCount || 0
      }
    }
    // }
  } else {
    state.tableData = (props.data || []) as any
  }
}

/**
 * 页数变更时
 *
 * @param page 页数
 */
const pageUpdate = (page: number) => {
  state.param.pageNo = page
  loadData()
}

/**
 * 页条数变更时
 *
 * @param pageSize 页条数变更时
 */
const pageSizeUpdate = (pageSize: number) => {
  state.param.pageNo = 1
  state.param.pageSize = pageSize
  loadData()
}

/**
 * 刷新数据
 */
const refreshData = () => {
  state.param.pageNo = 1
  closeDrawer()
  loadData()
}

/**
 * 搜索
 */
const onSearch = () => {
  state.param.pageNo = 1
  loadData()
}

onBeforeMount(() => {
  // 计算
  height.value = window.innerHeight - 52
})

/**
 * 初始化数据加载
 */
onMounted(() => {
  loadData()
})

/**
 * 表单验证
 */
const onValidateFail = () => {
  console.log('onValidateFail')
}

const saveUpdateForm = async (data: AnyObj) => {
  let url = `${props.config?.apis?.update || ''}`
  if (!url) {
    toast.error('请传入update-api')
    return
  }
  let res = await apis.putJSON(`${props.config?.apis?.update || ''}`, {
    data: {
      ...data,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  if (res.status == 200) {
    if (res.data.code == 200) {
      refreshData()
      toast.success(res.data.message || '修改成功')
    } else {
      toast.error(res.data.message || '修改失败')
    }
  } else {
    toast.error('request err,status code:' + res.status)
  }
}

defineExpose({
  onSave,
  onSearch,
  onUpdate,
  onDelete,
  createForm,
  updateForm,
  closeDrawer,
  refreshData,
  saveUpdateForm,
  showDetail,
})
</script>

<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
  border-radius: 10px;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background: #fff;
    box-sizing: border-box;
    padding-left: 10px;
    margin-bottom: 10px;
    padding-right: 5px;
  }

  .page-actions {
    background-color: #fff;
    padding: 16px 0 0 0;
    box-sizing: border-box;

    .action {
      display: flex;
      justify-content: space-between;
    }
  }

  .page-content {
    margin: 10px;
    border-radius: 12px;
    overflow: hidden;
    // height: calc(100vh - 112px);
  }

  .page-table {
    background-color: #fff;
  }

  .page-pager {
    text-align: right;
    padding-top: 10px;
    display: flex;
    justify-content: right;
  }

  :deep(.n-card__content) {
    padding: 8px;
  }
}
</style>

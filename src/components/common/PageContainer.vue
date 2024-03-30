<template>
  <div class="page-container">
    <div
      class="page-header"
      v-if="slots.header"
    >
      <slot
        name="header"
        :methods="{ createForm, refreshData }"
        :param="state.param"
      ></slot>
    </div>
    <div class="page-content">
      <div
        v-if="slots.actions"
        class="page-actions"
      >
        <NCard>
          <div class="action">
            <slot
              name="actions"
              :methods="{ createForm, refreshData, loadData }"
              :param="state.param"
            ></slot>
          </div>
        </NCard>
      </div>
      <div class="page-table">
        <NCard>
          <n-data-table
            :columns="config.columns"
            :data="state.tableData"
            :pagination="config.pagination"
          />
        </NCard>
      </div>
      <div class="page-pager"></div>
    </div>
    <NDrawer
      to="#app"
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="showDrawer"
      default-width="600"
      resizable
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
          <n-space align="baseline">
            <n-button
              text
              @click="closeDrawer"
            >
              返回
            </n-button>
            <n-button
              type="primary"
              @click="onSave"
            >
              确认
            </n-button>
          </n-space>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
<script setup lang="ts">
import type { CrudOptions } from '@/types/base'
import { NCard, NDrawerContent } from 'naive-ui'
import type { AnyObj } from '@/utils'
import constant from '@/types/constant'
import apis from '@/apis/index'
const slots = useSlots()
console.log(slots.actions, 'slots')
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
const showDrawer = ref(false)
const state = reactive({
  operationType: 1,
  submitLoading: false,
  formData: {} as AnyObj,
  param: (props.config.param ? props.config.param : {}) as AnyObj,
  tableData: [],
})

// 动态标题
const formTitle = computed(() => props.config.form?.title + (state.formData.mode == constant.FORM_MODE_CREATE ? '新增' : state.formData.mode == constant.FORM_MODE_UPDATE ? '编辑' : '详情'))

/**
 * 新增
 *
 * @param model 数据字段
 */
const createForm = (model: AnyObj = {}) => {
  state.formData = { ...model, mode: constant.FORM_MODE_CREATE }
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
 * 保存表单数据
 */
const onSave = () => {
  emits('onSave', state.formData)
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
    let resp = (await apis.getJSON(url, {
      params: state.param,
    })) as any
    // 兼容处理
    if (Array.isArray(resp.data)) {
      state.tableData = resp.data || []
    } else {
      console.log(resp.data, 'resp')
      if (Array.isArray(resp.data.list)) {
        state.tableData = resp.data.list || []
      }
    }
  } else {
    state.tableData = (props.data || []) as any
  }
}

const refreshData = () => {
  state.param.pageNo = 1
  closeDrawer()
  loadData()
}

onMounted(() => {
  loadData()
})

/**
 * 表单验证
 */
const onValidateFail = () => {
  console.log('onValidateFail')
}

defineExpose({
  createForm,
  updateForm,
  closeDrawer,
  refreshData,
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
    padding: 0 20px;
    margin-bottom: 10px;
  }

  .page-actions {
    background-color: #fff;

    .action {
      display: flex;
      justify-content: space-between;
    }
  }

  .page-content {
    margin: 10px;
  }

  .page-table {
    background-color: #fff;
  }
}
</style>
